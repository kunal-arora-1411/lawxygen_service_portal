"use client";

import { useState } from "react";
import {
  API_ORIGIN,
  WHATSAPP_RATE_PAISE,
  type ApiResult,
  type WhatsappSendOutcome,
  type WhatsappTemplate,
} from "@/lib/api";
import styles from "./SendWhatsapp.module.css";

/**
 * Firing an approved template at the client on an order.
 *
 * Shared by the admin console and the professional dashboard, because the interaction
 * is identical — the difference is enforced server-side, where a professional may only
 * reach a client on a matter they hold.
 *
 * Templates load on open rather than with the page: most orders never get a manual
 * message, and fetching a list for every row would be wasteful.
 *
 * The outcome deserves care. `deduplicated` is a success, not a failure — it means the
 * same message was already sent and a second one was not. `delivery_unknown` is the
 * uncomfortable one: the request left, Meta never answered, and it may or may not have
 * arrived. Saying "failed" there would be a lie in both directions.
 */
export function SendWhatsapp({
  orderReference,
  basePath,
}: {
  orderReference: string;
  /** `/admin/whatsapp` or `/pro/whatsapp`. */
  basePath: string;
}) {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<WhatsappTemplate[] | null>(null);
  const [chosen, setChosen] = useState<WhatsappTemplate | null>(null);
  const [values, setValues] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setOpen(true);
    if (templates) return;
    setBusy(true);
    try {
      const response = await fetch(`${API_ORIGIN}${basePath}/templates`, {
        credentials: "include",
      });
      const result = (await response.json()) as ApiResult<WhatsappTemplate[]>;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      const sendable = result.data.filter((t) => t.status === "approved");
      setTemplates(sendable);
      if (sendable.length === 1) setChosen(sendable[0] ?? null);
    } catch {
      setError("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    if (!chosen) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const response = await fetch(`${API_ORIGIN}${basePath}/send`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          templateName: chosen.name,
          language: chosen.language,
          orderReference,
          variables: chosen.variables.map((_, index) => values[index] ?? ""),
        }),
      });
      const result = (await response.json()) as ApiResult<WhatsappSendOutcome>;

      if (!result.ok) {
        setError(result.message);
        return;
      }

      switch (result.data.status) {
        case "accepted":
          setNote("Sent.");
          setOpen(false);
          break;
        case "deduplicated":
          // Not a failure. The same message already went a moment ago.
          setNote("Already sent a moment ago — not sent twice.");
          setOpen(false);
          break;
        case "delivery_unknown":
          setError(
            "It left, but WhatsApp never confirmed. It may have arrived. Check before resending.",
          );
          break;
        case "in_progress":
          setNote("Already going out.");
          break;
        default:
          setError(result.data.reason ?? "WhatsApp refused it.");
      }
    } catch {
      setError("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <div className={styles.wrap}>
        <button type="button" className={styles.trigger} onClick={() => void load()}>
          WhatsApp
        </button>
        {note && <span className={styles.note}>{note}</span>}
      </div>
    );
  }

  const rate = chosen ? WHATSAPP_RATE_PAISE[chosen.category] : null;
  const filled = chosen ? chosen.variables.every((_, i) => (values[i] ?? "").trim()) : false;

  return (
    <div className={styles.panel}>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      {note && <div className={styles.note}>{note}</div>}

      {templates === null ? (
        <span className={styles.note}>Loading templates…</span>
      ) : templates.length === 0 ? (
        <span className={styles.note}>
          No approved templates yet. One has to clear Meta&apos;s review before anything can be
          sent.
        </span>
      ) : (
        <>
          <label className={styles.field}>
            <span className={styles.label}>Template</span>
            <select
              className={styles.select}
              value={chosen?.name ?? ""}
              onChange={(e) => {
                setChosen(templates.find((t) => t.name === e.target.value) ?? null);
                setValues([]);
              }}
            >
              <option value="">Choose one…</option>
              {templates.map((template) => (
                <option key={template.name} value={template.name}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>

          {chosen && (
            <>
              {chosen.bodyPreview && <div className={styles.preview}>{chosen.bodyPreview}</div>}

              {chosen.variables.map((meaning, index) => (
                <label className={styles.field} key={meaning || index}>
                  <span className={styles.label}>
                    {`{{${String(index + 1)}}}`} {meaning && `· ${meaning}`}
                  </span>
                  <input
                    className={styles.input}
                    value={values[index] ?? ""}
                    onChange={(e) => {
                      const next = [...values];
                      while (next.length <= index) next.push("");
                      next[index] = e.target.value;
                      setValues(next);
                    }}
                  />
                </label>
              ))}

              {rate !== null && (
                <span className={styles.note}>
                  About ₹{(rate / 100).toFixed(2)}
                  {chosen.category === "marketing" && " — this one is priced as marketing."}
                </span>
              )}
            </>
          )}
        </>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          onClick={() => void send()}
          disabled={busy || !chosen || !filled}
        >
          {busy ? "Sending…" : "Send"}
        </button>
        <button
          type="button"
          className={styles.ghost}
          onClick={() => setOpen(false)}
          disabled={busy}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  API_ORIGIN,
  WHATSAPP_RATE_PAISE,
  type ApiResult,
  type TemplateIssue,
  type WhatsappTemplate,
} from "@/lib/api";
import styles from "../admin.module.css";

/**
 * Writing a template and sending it to Meta for review.
 *
 * Two things shape this form, and both are about not wasting something you cannot get
 * back.
 *
 * **A rejected name cannot be reused.** Meta reviews asynchronously and reports a
 * rejection days later as a terse code, and the corrected template usually has to go
 * out under a different name. So the form checks against the same rules the API
 * applies, on demand, before anything is submitted.
 *
 * **Meta decides the category, not us.** It classifies from the wording. A utility
 * template that reads like an advertisement is repriced as marketing at roughly seven
 * times the rate, for the life of the template — so the cost is shown next to the
 * choice rather than buried in documentation.
 */
export function TemplateComposer() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"utility" | "marketing">("utility");
  const [body, setBody] = useState("");
  const [footer, setFooter] = useState("");
  const [busy, setBusy] = useState(false);
  const [issues, setIssues] = useState<TemplateIssue[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** `{{1}}`, `{{2}}` … as typed, so the sample and meaning inputs can follow along. */
  const placeholders = [...body.matchAll(/\{\{(\d+)\}\}/g)].map((match) => Number(match[1]));
  const count = placeholders.length > 0 ? Math.max(...placeholders) : 0;

  const [samples, setSamples] = useState<string[]>([]);
  const [meanings, setMeanings] = useState<string[]>([]);

  function setAt(list: string[], index: number, value: string): string[] {
    const next = [...list];
    while (next.length <= index) next.push("");
    next[index] = value;
    return next;
  }

  function payload() {
    return {
      name,
      category,
      body,
      ...(footer.trim() ? { footer } : {}),
      samples: Array.from({ length: count }, (_, i) => samples[i] ?? ""),
      variables: Array.from({ length: count }, (_, i) => meanings[i] ?? ""),
    };
  }

  async function check() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${API_ORIGIN}/admin/whatsapp/templates/check`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload()),
      });
      const result = (await response.json()) as ApiResult<{ issues: TemplateIssue[] }>;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setIssues(result.data.issues);
    } catch {
      setError("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${API_ORIGIN}/admin/whatsapp/templates`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload()),
      });
      const result = (await response.json()) as ApiResult<WhatsappTemplate>;

      if (!result.ok) {
        setError(result.message);
        // The API returns the same rules the check does, keyed by field.
        if (result.fieldErrors) {
          setIssues(
            Object.entries(result.fieldErrors).flatMap(([field, messages]) =>
              messages.map((message) => ({ field, message })),
            ),
          );
        }
        return;
      }

      setOpen(false);
      setName("");
      setBody("");
      setFooter("");
      setSamples([]);
      setMeanings([]);
      setIssues(null);
      router.refresh();
    } catch {
      setError("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className={styles.button} onClick={() => setOpen(true)}>
        Write a template
      </button>
    );
  }

  const rate = WHATSAPP_RATE_PAISE[category];
  const ready = /^[a-z0-9_]+$/.test(name) && body.trim().length > 0;

  return (
    <div className={styles.composer}>
      <h2 className={styles.sectionTitle}>New template</h2>

      {error && <div className={styles.rowError}>{error}</div>}

      <label className={styles.field}>
        <span className={styles.label}>Name</span>
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
          placeholder="lawxygen_matter_update"
          maxLength={512}
        />
        {/* Said here because it is the one mistake that cannot be undone. */}
        <span className={styles.help}>
          Lowercase, numbers and underscores. If Meta rejects this template, the name cannot be
          reused — the fix has to go out under a different one.
        </span>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Category</span>
        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value as "utility" | "marketing")}
        >
          <option value="utility">Utility — order updates, receipts, reminders</option>
          <option value="marketing">Marketing — anything promotional</option>
        </select>
        <span className={category === "marketing" ? styles.rowError : styles.help}>
          About ₹{(rate / 100).toFixed(2)} per message.
          {category === "marketing"
            ? " Roughly seven times the utility rate."
            : " Meta decides the real category from your wording, and its decision lasts the life of the template."}
        </span>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Message</span>
        <textarea
          className={styles.textarea}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={1024}
          placeholder="Hello {{1}}, your {{2}} is now underway. Reference {{3}}."
        />
        <span className={styles.help}>
          Use {"{{1}}"}, {"{{2}}"} for the parts that change. They must run in order, and cannot
          open or close the message.
        </span>
      </label>

      {count > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Example for the reviewer</th>
                <th>What it means</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: count }, (_, index) => (
                <tr key={index}>
                  <td className={styles.numeric}>{`{{${String(index + 1)}}}`}</td>
                  <td>
                    <input
                      className={styles.input}
                      value={samples[index] ?? ""}
                      onChange={(e) => setSamples(setAt(samples, index, e.target.value))}
                      placeholder="Priya Sharma"
                      aria-label={`Example for variable ${String(index + 1)}`}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.input}
                      value={meanings[index] ?? ""}
                      onChange={(e) => setMeanings(setAt(meanings, index, e.target.value))}
                      placeholder="client name"
                      aria-label={`Meaning of variable ${String(index + 1)}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <span className={styles.help}>
            Meta rejects a template whose variables have no examples — a reviewer needs to see what
            they stand for.
          </span>
        </div>
      )}

      <label className={styles.field}>
        <span className={styles.label}>
          Footer <span className={styles.muted}>optional</span>
        </span>
        <input
          className={styles.input}
          value={footer}
          onChange={(e) => setFooter(e.target.value)}
          maxLength={60}
          placeholder="Lawxygen"
        />
      </label>

      {issues && (
        <div className={issues.length === 0 ? styles.banner : styles.warn}>
          {issues.length === 0 ? (
            <strong>Nothing to fix. This should pass Meta&apos;s review.</strong>
          ) : (
            <>
              <strong>
                {issues.length} thing{issues.length === 1 ? "" : "s"} to fix first
              </strong>
              <ul className={styles.list}>
                {issues.map((issue) => (
                  <li key={`${issue.field}-${issue.message}`} className={styles.listItem}>
                    {issue.message}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.ghost}
          onClick={() => void check()}
          disabled={busy || !ready}
        >
          Check it
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => void submit()}
          disabled={busy || !ready}
        >
          {busy ? "Sending to Meta…" : "Submit for review"}
        </button>
        <button type="button" className={styles.ghost} onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}

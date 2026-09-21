"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, MATTER_LABELS, type ApiResult, type Matter } from "@/lib/api";
import { SendWhatsapp } from "@/components/SendWhatsapp";
import styles from "./pro.module.css";

/**
 * One matter, and the actions available on it.
 *
 * The client's contact details are shown here and nowhere else, because v1 has no
 * in-app messaging — this card *is* the handoff. Everything after it happens off the
 * platform, which is why the PRD has contact accompany the assignment itself rather
 * than waiting on confirmation.
 *
 * An earlier version withheld contact until the matter was acknowledged. That was both
 * a departure from the PRD and, more to the point, not a boundary at all: the props of
 * a server component are serialised into the page payload, so the address was in the
 * HTML regardless of whether this branch rendered it. Withholding data has to happen
 * in the API or not at all.
 *
 * Which buttons appear follows the transitions the API enforces. The API is the
 * authority; hiding an impossible action only avoids offering something it would refuse.
 */
export function MatterCard({ matter, overdue }: { matter: Matter; overdue: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function act(path: string, body?: unknown) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${API_ORIGIN}/pro/matters/${matter.assignmentId}${path}`, {
        method: "POST",
        headers: body ? { "content-type": "application/json" } : {},
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
      });
      const result = (await response.json()) as ApiResult<unknown>;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach Lawxygen.");
    } finally {
      setBusy(false);
    }
  }

  const tone =
    matter.status === "assigned"
      ? styles.toneNew
      : matter.status === "completed"
        ? styles.toneDone
        : ["declined", "revoked", "escalated"].includes(matter.status)
          ? styles.toneClosed
          : styles.toneActive;

  return (
    <article
      className={`${styles.matter} ${matter.status === "assigned" ? styles.needsAction : ""}`}
    >
      <div className={styles.matterHead}>
        <div>
          <h3 className={styles.matterName}>{matter.serviceTitle}</h3>
          <div className={styles.matterMeta}>
            {matter.reference} · {matter.categorySlug} ·{" "}
            {new Date(matter.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </div>
        </div>
        <span className={`${styles.status} ${tone}`}>{MATTER_LABELS[matter.status]}</span>
      </div>

      {matter.status === "assigned" && matter.acknowledgeBy && (
        <div className={`${styles.deadline} ${overdue ? styles.overdue : ""}`}>
          {overdue
            ? "Past its confirmation deadline — admin has been alerted and may reassign it."
            : `Confirm by ${new Date(matter.acknowledgeBy).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
              })}`}
        </div>
      )}

      {matter.client && (
        <div className={styles.contact}>
          <div>
            <span className={styles.contactLabel}>Client</span>
            {matter.client.name ?? "—"}
          </div>
          {matter.client.phone && (
            <div>
              <span className={styles.contactLabel}>Phone</span>
              <a href={`tel:${matter.client.phone}`}>{matter.client.phone}</a>
            </div>
          )}
          {matter.client.email && (
            <div>
              <span className={styles.contactLabel}>Email</span>
              <a href={`mailto:${matter.client.email}`}>{matter.client.email}</a>
            </div>
          )}
        </div>
      )}

      {/* Acknowledged means the matter is genuinely theirs, which is also when the
          server will let them message the client. Offering it earlier would show a
          control that is refused. */}
      {matter.status !== "assigned" && (
        <SendWhatsapp orderReference={matter.reference} basePath="/pro/whatsapp" />
      )}

      <div className={styles.matterActions}>
        {matter.status === "assigned" && (
          <button
            type="button"
            className={styles.primary}
            onClick={() => void act("/acknowledge")}
            disabled={busy}
          >
            Confirm I am on this
          </button>
        )}

        {matter.status === "acknowledged" && (
          <button
            type="button"
            className={styles.primary}
            onClick={() => void act("/status", { status: "in_progress" })}
            disabled={busy}
          >
            Start work
          </button>
        )}

        {(matter.status === "acknowledged" || matter.status === "in_progress") && (
          <button
            type="button"
            className={styles.secondary}
            onClick={() => void act("/status", { status: "awaiting_client" })}
            disabled={busy}
          >
            Waiting on the client
          </button>
        )}

        {matter.status === "awaiting_client" && (
          <button
            type="button"
            className={styles.secondary}
            onClick={() => void act("/status", { status: "in_progress" })}
            disabled={busy}
          >
            Back to in progress
          </button>
        )}

        {["acknowledged", "in_progress", "awaiting_client"].includes(matter.status) && (
          <button
            type="button"
            className={styles.secondary}
            onClick={() => void act("/status", { status: "completed" })}
            disabled={busy}
          >
            Mark completed
          </button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </article>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, type ApiResult } from "@/lib/api";
import styles from "../admin.module.css";

/**
 * What an admin can do to an application, which depends entirely on where it is.
 *
 * The actions are status-specific rather than always-on. Verifying now refuses
 * anything that was not actually submitted, so offering "Verify" on a draft would be
 * offering a button that returns a conflict — the applicant has not finished, and the
 * honest thing is to say so instead.
 *
 * Verifying and reinstating both emit an event whose subscriber immediately drains the
 * queue of orders parked for want of supply. At launch that is the common case, not an
 * edge one, so the page refreshes to show it having happened.
 *
 * Rejecting and suspending both require a typed reason. Every privileged action has to
 * be explicable afterwards, and the audit log is only as good as what was put in it —
 * a rejection reason is also the only thing the applicant will see.
 */
export function ProfessionalActions({
  professional,
}: {
  professional: { id: string; displayName: string; status: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asking, setAsking] = useState<"reject" | "suspend" | null>(null);
  const [reason, setReason] = useState("");

  async function post(path: string, body?: unknown) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${API_ORIGIN}/admin/professionals/${professional.id}${path}`, {
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
      setAsking(null);
      setReason("");
      router.refresh();
    } catch {
      setError("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  if (asking) {
    const rejecting = asking === "reject";
    return (
      <div className={styles.actions}>
        <input
          className={styles.search}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={rejecting ? "Why? They will read this." : "Reason for suspending"}
          aria-label={`Reason for ${asking}ing ${professional.displayName}`}
        />
        <button
          type="button"
          className={`${styles.ghost} ${styles.danger}`}
          onClick={() => void post(rejecting ? "/reject" : "/suspend", { reason })}
          disabled={busy || reason.trim().length < 3}
        >
          Confirm
        </button>
        <button
          type="button"
          className={styles.ghost}
          onClick={() => {
            setAsking(null);
          }}
          disabled={busy}
        >
          Cancel
        </button>
        {error && <div className={styles.rowError}>{error}</div>}
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      {professional.status === "pending_review" && (
        <>
          <button
            type="button"
            className={styles.ghost}
            onClick={() => void post("/verify")}
            disabled={busy}
          >
            Verify
          </button>
          <button
            type="button"
            className={`${styles.ghost} ${styles.danger}`}
            onClick={() => {
              setAsking("reject");
            }}
            disabled={busy}
          >
            Reject
          </button>
        </>
      )}

      {professional.status === "verified" && (
        <button
          type="button"
          className={`${styles.ghost} ${styles.danger}`}
          onClick={() => {
            setAsking("suspend");
          }}
          disabled={busy}
        >
          Suspend
        </button>
      )}

      {professional.status === "suspended" && (
        <button
          type="button"
          className={styles.ghost}
          onClick={() => void post("/reinstate")}
          disabled={busy}
        >
          Reinstate
        </button>
      )}

      {/* Nothing to do: it is the applicant's turn, not ours. */}
      {(professional.status === "draft" || professional.status === "rejected") && (
        <span className={styles.muted}>With the applicant</span>
      )}

      {error && <div className={styles.rowError}>{error}</div>}
    </div>
  );
}

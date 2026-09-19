"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, type AdminProfessional, type ApiResult } from "@/lib/api";
import styles from "../admin.module.css";

/**
 * Verify or suspend.
 *
 * Verifying emits an event whose subscriber immediately drains the queue of orders
 * parked for want of supply — which at launch is the common case, not an edge one, so
 * the page refreshes to show that having happened.
 *
 * Suspending requires a typed reason. Every privileged action has to be explicable
 * afterwards, and the audit log is only as useful as what was put in it.
 */
export function ProfessionalActions({ professional }: { professional: AdminProfessional }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [askingReason, setAskingReason] = useState(false);
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
      setAskingReason(false);
      setReason("");
      router.refresh();
    } catch {
      setError("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  if (askingReason) {
    return (
      <div className={styles.actions}>
        <input
          className={styles.search}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for suspending"
          aria-label={`Reason for suspending ${professional.displayName}`}
        />
        <button
          type="button"
          className={`${styles.ghost} ${styles.danger}`}
          onClick={() => void post("/suspend", { reason })}
          disabled={busy || reason.trim().length < 3}
        >
          Confirm
        </button>
        <button
          type="button"
          className={styles.ghost}
          onClick={() => setAskingReason(false)}
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
      {professional.status !== "verified" && (
        <button
          type="button"
          className={styles.ghost}
          onClick={() => void post("/verify")}
          disabled={busy}
        >
          Verify
        </button>
      )}
      {professional.status !== "suspended" && (
        <button
          type="button"
          className={`${styles.ghost} ${styles.danger}`}
          onClick={() => setAskingReason(true)}
          disabled={busy}
        >
          Suspend
        </button>
      )}
      {error && <div className={styles.rowError}>{error}</div>}
    </div>
  );
}

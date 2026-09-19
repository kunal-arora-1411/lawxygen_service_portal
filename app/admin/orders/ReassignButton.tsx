"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, type ApiResult } from "@/lib/api";
import styles from "../admin.module.css";

/**
 * Take a matter off one professional and re-run the engine.
 *
 * Revoke-and-rerun rather than hand-picking a replacement: the same eligibility and
 * capacity rules then apply to whoever gets it, which hand-picking would bypass.
 *
 * The revocation stands even when nothing is free — the order parks in the queue
 * rather than staying with someone unsuitable — so the result distinguishes
 * "reassigned" from "revoked and queued".
 */
export function ReassignButton({ reference }: { reference: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function reassign() {
    setBusy(true);
    setNote(null);
    try {
      const response = await fetch(`${API_ORIGIN}/admin/orders/${reference}/reassign`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason }),
      });
      const result = (await response.json()) as ApiResult<{ reassigned: boolean }>;

      if (!result.ok) {
        setNote(result.message);
        return;
      }
      if (!result.data.reassigned) {
        setNote("Revoked, but nobody eligible was free. The order is queued.");
        router.refresh();
        return;
      }
      setOpen(false);
      setReason("");
      router.refresh();
    } catch {
      setNote("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <div className={styles.actions}>
        <button type="button" className={styles.ghost} onClick={() => setOpen(true)}>
          Reassign
        </button>
        {note && <div className={styles.rowError}>{note}</div>}
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      <input
        className={styles.search}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Why?"
        aria-label={`Reason for reassigning ${reference}`}
      />
      <button
        type="button"
        className={styles.ghost}
        onClick={() => void reassign()}
        disabled={busy || reason.trim().length < 3}
      >
        Confirm
      </button>
      <button type="button" className={styles.ghost} onClick={() => setOpen(false)} disabled={busy}>
        Cancel
      </button>
      {note && <div className={styles.rowError}>{note}</div>}
    </div>
  );
}

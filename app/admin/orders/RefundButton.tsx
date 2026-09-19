"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, formatPrice, type ApiResult } from "@/lib/api";
import styles from "../admin.module.css";

/**
 * Giving a client their money back.
 *
 * Full amount only — partial refunds move the GST position, the commission split and
 * the professional's share at the same time, and the backend deliberately does not
 * offer one. So the confirmation names the whole figure, because a confirmation that
 * does not state the amount is not a confirmation.
 *
 * It also warns when somebody is holding the matter, since refunding takes it off them
 * and may leave them owing money already paid out. That is the ledger doing the right
 * thing, but it is a conversation the admin should know they are starting.
 */
export function RefundButton({
  reference,
  pricePaise,
  currency,
  professionalName,
}: {
  reference: string;
  pricePaise: number;
  currency: string;
  professionalName: string | null;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function refund() {
    setBusy(true);
    setNote(null);
    try {
      const response = await fetch(`${API_ORIGIN}/admin/orders/${reference}/refund`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason }),
      });
      const result = (await response.json()) as ApiResult<{ professionalClawedBack: boolean }>;

      if (!result.ok) {
        setNote(result.message);
        return;
      }
      setConfirming(false);
      setReason("");
      router.refresh();
    } catch {
      setNote("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  if (!confirming) {
    return (
      <div className={styles.actions}>
        <button type="button" className={styles.ghost} onClick={() => setConfirming(true)}>
          Refund
        </button>
        {note && <div className={styles.rowError}>{note}</div>}
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      <span>
        Return <strong>{formatPrice(pricePaise, currency)}</strong> in full?
      </span>
      {professionalName && (
        <span className={styles.rowError}>
          {professionalName} loses this matter, and is clawed back for it.
        </span>
      )}
      <input
        className={styles.search}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Why?"
        aria-label={`Reason for refunding ${reference}`}
      />
      <button
        type="button"
        className={styles.button}
        onClick={() => void refund()}
        disabled={busy || reason.trim().length < 3}
      >
        {busy ? "Refunding…" : "Yes, refund it"}
      </button>
      <button
        type="button"
        className={styles.ghost}
        onClick={() => setConfirming(false)}
        disabled={busy}
      >
        Cancel
      </button>
      {note && <div className={styles.rowError}>{note}</div>}
    </div>
  );
}

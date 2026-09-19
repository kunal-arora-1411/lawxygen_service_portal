"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, formatPrice, type ApiResult } from "@/lib/api";
import styles from "../admin.module.css";

/**
 * Drafting a batch, and releasing one.
 *
 * Release is the only control in this application that sends money out of the
 * business, so it asks first and states the figure in the question. A confirmation
 * that does not name the amount is not a confirmation.
 */

export function DraftBatchButton({ total, count }: { total: number; count: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function draft() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${API_ORIGIN}/admin/payouts/draft`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });
      const result = (await response.json()) as ApiResult<{ reference: string }>;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={() => void draft()}
        disabled={busy || count === 0}
      >
        {busy
          ? "Drafting…"
          : `Draft a batch for ${String(count)} professional${count === 1 ? "" : "s"} · ${formatPrice(total)}`}
      </button>
      {error && <div className={styles.rowError}>{error}</div>}
    </>
  );
}

export function ReleaseButton({
  reference,
  total,
  count,
}: {
  reference: string;
  total: number;
  count: number;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function release() {
    setBusy(true);
    setNote(null);
    try {
      const response = await fetch(`${API_ORIGIN}/admin/payouts/${reference}/release`, {
        method: "POST",
        credentials: "include",
      });
      const result = (await response.json()) as ApiResult<{
        paid: number;
        failed: number;
        totalPaise: number;
      }>;

      if (!result.ok) {
        setNote(result.message);
        return;
      }

      // A partial release is the normal outcome of a bank problem, not an error —
      // some money left and some did not, and saying so is the only honest report.
      if (result.data.failed > 0) {
        setNote(
          `${String(result.data.paid)} paid, ${String(result.data.failed)} failed. The failed ones are still owed.`,
        );
      }
      setConfirming(false);
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
        <button type="button" className={styles.button} onClick={() => setConfirming(true)}>
          Release
        </button>
        {note && <div className={styles.rowError}>{note}</div>}
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      <span>
        Send <strong>{formatPrice(total)}</strong> to {count} professional
        {count === 1 ? "" : "s"}?
      </span>
      <button
        type="button"
        className={styles.button}
        onClick={() => void release()}
        disabled={busy}
      >
        {busy ? "Releasing…" : "Yes, send it"}
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

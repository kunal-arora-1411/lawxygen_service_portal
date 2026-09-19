"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, type ApiResult, type ReconciliationRun } from "@/lib/api";
import styles from "../admin.module.css";

/**
 * Run it now.
 *
 * The scheduled run is every six hours, which is right for catching silence and wrong
 * for the moment somebody suspects a webhook was missed. That moment is when they want
 * the answer, so the same job is available on demand over a chosen window.
 */
export function RunButton() {
  const router = useRouter();
  const [hours, setHours] = useState("48");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setNote(null);
    try {
      const response = await fetch(`${API_ORIGIN}/admin/reconciliation/run`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ hours: Number(hours) }),
      });
      const result = (await response.json()) as ApiResult<ReconciliationRun>;

      if (!result.ok) {
        setNote(result.message);
        return;
      }
      if (result.data.repairedCount > 0) {
        setNote(
          `Repaired ${String(result.data.repairedCount)} missed capture${
            result.data.repairedCount === 1 ? "" : "s"
          }.`,
        );
      }
      router.refresh();
    } catch {
      setNote("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.actions}>
      <label className={styles.muted} htmlFor="recon-hours">
        Look back
      </label>
      <select
        id="recon-hours"
        className={styles.select}
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      >
        <option value="6">6 hours</option>
        <option value="24">24 hours</option>
        <option value="48">48 hours</option>
        <option value="168">7 days</option>
        <option value="720">30 days</option>
      </select>
      <button type="button" className={styles.button} onClick={() => void run()} disabled={busy}>
        {busy ? "Checking with the gateway…" : "Run now"}
      </button>
      {note && <div className={styles.rowError}>{note}</div>}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, type ApiResult } from "@/lib/api";
import styles from "./pro.module.css";

/**
 * Available or not.
 *
 * Going unavailable does not release matters already held — those are commitments, and
 * a professional stepping back from *new* work is not the same as abandoning work in
 * hand. Coming back on drains the queue of orders parked for want of supply, which is
 * why the page refreshes rather than just flipping a label.
 */
export function AvailabilityToggle({
  available,
  open,
  capacity,
}: {
  available: boolean;
  open: number;
  capacity: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const full = open >= capacity;

  async function toggle() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${API_ORIGIN}/pro/availability`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ available: !available }),
      });
      const result = (await response.json()) as ApiResult<{ available: boolean }>;
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

  return (
    <div className={styles.availability}>
      <div className={styles.availabilityBody}>
        <div className={styles.availabilityTitle}>
          {available ? "Available for new matters" : "Not taking new matters"}
        </div>
        <div className={styles.availabilityNote}>
          {full
            ? `You are at capacity — ${String(open)} of ${String(capacity)} slots in use. New matters will go to someone else until one closes.`
            : available
              ? `${String(capacity - open)} of ${String(capacity)} slots free. Matters are assigned automatically.`
              : "Matters you already hold are unaffected. Turn this on to start receiving new ones."}
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>

      <button
        type="button"
        className={styles.toggle}
        data-off={!available}
        onClick={() => void toggle()}
        disabled={busy}
        aria-pressed={available}
      >
        {busy ? "Saving…" : available ? "Go unavailable" : "Go available"}
      </button>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, type ApiResult } from "@/lib/api";
import styles from "../admin.module.css";

/**
 * Pulls the current state of every template from Meta.
 *
 * Meta owns the truth and never tells us when it changes its mind: a template approved
 * last week can be paused this week for poor quality, or have its category — and so its
 * price — reassigned. Nothing here notices until somebody asks.
 */
export function SyncButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function sync() {
    setBusy(true);
    setNote(null);
    try {
      const response = await fetch(`${API_ORIGIN}/admin/whatsapp/templates/sync`, {
        method: "POST",
        credentials: "include",
      });
      const result = (await response.json()) as ApiResult<{ synced: number }>;
      if (!result.ok) {
        setNote(result.message);
        return;
      }
      setNote(`${String(result.data.synced)} template(s) read from Meta.`);
      router.refresh();
    } catch {
      setNote("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className={styles.ghost} onClick={() => void sync()} disabled={busy}>
        {busy ? "Asking Meta…" : "Refresh from Meta"}
      </button>
      {note && <span className={styles.muted}>{note}</span>}
    </>
  );
}

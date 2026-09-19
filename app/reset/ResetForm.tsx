"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, type ApiResult } from "@/lib/api";
import styles from "../login/page.module.css";

/**
 * Setting a new password from an emailed link.
 *
 * The token comes from the query string and is never displayed, stored or logged — it
 * is a bearer credential for the next hour, and the address bar is quite enough
 * exposure.
 *
 * Completing a reset signs every session out, including any this browser held, so the
 * only honest next step is the sign-in page.
 */
export function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Mirrors the server's rule rather than guessing at a stricter one. A password
  // policy the client enforces and the server does not is theatre; the reverse is a
  // form that fails after submission for no visible reason.
  const longEnough = password.length >= 10;
  const matches = password === confirm;

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${API_ORIGIN}/auth/password/reset`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password }),
      });
      const result = (await response.json()) as ApiResult<unknown>;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setDone(true);
      router.refresh();
    } catch {
      setError("Could not reach Lawxygen. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <div className={styles.card}>
        <h1 className={styles.title}>That link is incomplete</h1>
        <p className={styles.subtitle}>
          Open the link from your email again, or ask for a new one.
        </p>
        <Link href="/forgot" className={styles.switch}>
          Send me another link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className={styles.card}>
        <h1 className={styles.title}>Password changed</h1>
        <p className={styles.subtitle}>
          You have been signed out everywhere else as well, which is the point — if somebody knew
          your old password, they no longer have a way in.
        </p>
        <Link href="/login" className={styles.submit}>
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.brand}>
        <span className={styles.mark} aria-hidden="true">
          LX
        </span>
        Lawxygen
      </div>

      <h1 className={styles.title}>Set a new password</h1>
      <p className={styles.subtitle}>At least 10 characters. Longer beats complicated.</p>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <label className={styles.field}>
        <span className={styles.label}>New password</span>
        <input
          className={styles.input}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password.length > 0 && !longEnough && (
          <span className={styles.fieldError}>Use at least 10 characters.</span>
        )}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Again, to be sure</span>
        <input
          className={styles.input}
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && longEnough && matches) void submit();
          }}
        />
        {confirm.length > 0 && !matches && (
          <span className={styles.fieldError}>These do not match.</span>
        )}
      </label>

      <button
        type="button"
        className={styles.submit}
        onClick={() => void submit()}
        disabled={busy || !longEnough || !matches}
      >
        {busy ? "Saving…" : "Set my password"}
      </button>
    </div>
  );
}

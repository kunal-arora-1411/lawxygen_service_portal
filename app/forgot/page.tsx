"use client";

import Link from "next/link";
import { useState } from "react";
import { API_ORIGIN, type ApiResult } from "@/lib/api";
import styles from "../login/page.module.css";

/**
 * Asking for a reset link.
 *
 * The confirmation is deliberately the same whether or not the address is known — the
 * API answers identically, and a page that said "no account found" would reintroduce
 * the enumeration oracle the API works to avoid. So the success copy is phrased to be
 * true either way: *if* there is an account, a link is on its way.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${API_ORIGIN}/auth/password/forgot`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as ApiResult<unknown>;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setSent(true);
    } catch {
      setError("Could not reach Lawxygen. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            LX
          </span>
          Lawxygen
        </div>

        {sent ? (
          <>
            <h1 className={styles.title}>Check your email</h1>
            <p className={styles.subtitle}>
              If there is a Lawxygen account for <strong>{email}</strong>, a link to set a new
              password is on its way. It works once and expires in an hour.
            </p>
            <p className={styles.subtitle}>
              Nothing has changed on your account yet — your password only changes when you use the
              link.
            </p>
            <Link href="/login" className={styles.switch}>
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Forgotten your password?</h1>
            <p className={styles.subtitle}>
              Tell us the address on your account and we will send you a link to set a new one.
            </p>

            {error && (
              <div className={styles.error} role="alert">
                {error}
              </div>
            )}

            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input
                className={styles.input}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email.includes("@")) void submit();
                }}
              />
            </label>

            <button
              type="button"
              className={styles.submit}
              onClick={() => void submit()}
              disabled={busy || !email.includes("@")}
            >
              {busy ? "Sending…" : "Send me a link"}
            </button>

            <Link href="/login" className={styles.switch}>
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

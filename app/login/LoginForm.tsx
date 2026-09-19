"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, type ApiResult, type SessionUser } from "@/lib/api";
import styles from "./page.module.css";

/**
 * Sign in and register.
 *
 * Both post straight to the API rather than through a Next route handler: the session
 * is an httpOnly cookie the API sets, and proxying it would mean re-issuing that cookie
 * on a second host for no benefit.
 *
 * Errors are read from the envelope's `code` and `fieldErrors`, never from the message
 * text — the API owns the wording, the form owns where it appears.
 */

type Mode = "signin" | "register";

const OAUTH_ERRORS: Record<string, string> = {
  google_denied: "Google sign-in was cancelled.",
  google_failed: "Google sign-in could not be completed. Try again.",
  google_unavailable: "Google sign-in is not available right now.",
  email_in_use: "An account already exists with that email. Sign in with your password instead.",
};

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const next = params.get("next") ?? "/dashboard";
  const oauthError = params.get("error");

  const [mode, setMode] = useState<Mode>("signin");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(
    oauthError ? (OAUTH_ERRORS[oauthError] ?? "Sign-in failed. Try again.") : null,
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    setFieldErrors({});

    const form = new FormData(event.currentTarget);
    const path = mode === "signin" ? "/auth/login" : "/auth/register";
    const body =
      mode === "signin"
        ? { email: form.get("email"), password: form.get("password") }
        : {
            name: form.get("name"),
            email: form.get("email"),
            password: form.get("password"),
            phone: form.get("phone"),
            whatsappConsent: form.get("whatsappConsent") === "on",
          };

    try {
      const response = await fetch(`${API_ORIGIN}${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const result = (await response.json()) as ApiResult<{ user: SessionUser }>;

      if (!result.ok) {
        setMessage(result.message);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }

      router.push(next);
      // The shell reads the session server-side, so the cache has to be dropped or
      // the next render still believes nobody is signed in.
      router.refresh();
    } catch {
      setMessage("Could not reach Lawxygen. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const invalid = (field: string) => (fieldErrors[field] ? true : undefined);

  return (
    <div className={styles.card}>
      <div className={styles.brand}>
        <span className={styles.mark} aria-hidden="true">
          LX
        </span>
        <strong>Lawxygen</strong>
      </div>

      <h1 className={styles.title}>{mode === "signin" ? "Sign in" : "Create your account"}</h1>
      <p className={styles.subtitle}>
        {mode === "signin"
          ? "Track your matters and start new ones."
          : "A few details, then you can get started."}
      </p>

      <div className={styles.tabs} role="tablist" aria-label="Sign in or register">
        <button
          type="button"
          role="tab"
          className={styles.tab}
          aria-selected={mode === "signin"}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          className={styles.tab}
          aria-selected={mode === "register"}
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>

      {message && (
        <div className={styles.error} role="alert">
          {message}
        </div>
      )}

      <form onSubmit={(e) => void submit(e)} noValidate>
        {mode === "register" && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              name="name"
              className={styles.input}
              required
              autoComplete="name"
              aria-invalid={invalid("name")}
            />
            {fieldErrors.name?.map((e) => (
              <div key={e} className={styles.fieldError}>
                {e}
              </div>
            ))}
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            required
            autoComplete="email"
            aria-invalid={invalid("email")}
          />
          {fieldErrors.email?.map((e) => (
            <div key={e} className={styles.fieldError}>
              {e}
            </div>
          ))}
        </div>

        {mode === "register" && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">
              Mobile number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={styles.input}
              required
              placeholder="+919876543210"
              autoComplete="tel"
              aria-invalid={invalid("phone")}
            />
            {fieldErrors.phone?.map((e) => (
              <div key={e} className={styles.fieldError}>
                {e}
              </div>
            ))}
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={styles.input}
            required
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            aria-invalid={invalid("password")}
          />
          {fieldErrors.password?.map((e) => (
            <div key={e} className={styles.fieldError}>
              {e}
            </div>
          ))}
          {/* Only when signing in. Offering it mid-registration reads as a warning
              that you already have an account, which is confusing and, for somebody
              who does not, meaningless. */}
          {mode === "signin" && (
            <Link href="/forgot" className={styles.forgot}>
              Forgotten your password?
            </Link>
          )}
        </div>

        {mode === "register" && (
          // Unticked by default, deliberately. WhatsApp is Phase 2, but the consent is
          // collected now because Meta requires opt-in and asking every existing user
          // later is a campaign nobody wants to run. A pre-ticked box is not consent.
          <label className={styles.consent}>
            <input type="checkbox" name="whatsappConsent" />
            <span>Send me updates about my matters on WhatsApp.</span>
          </label>
        )}

        <button type="submit" className={styles.submit} disabled={busy}>
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className={styles.divider}>or</div>

      <a className={styles.google} href={`${API_ORIGIN}/auth/google/start`}>
        Continue with Google
      </a>

      <p className={styles.switch}>
        {mode === "signin" ? (
          <>
            New to Lawxygen? <button onClick={() => setMode("register")}>Create an account</button>
          </>
        ) : (
          <>
            Already have an account? <button onClick={() => setMode("signin")}>Sign in</button>
          </>
        )}
      </p>
    </div>
  );
}

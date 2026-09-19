"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type LoginMethod = "email" | "mobile";

function GoogleMark() {
  return (
    <svg className="lawx-auth-provider-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.31 2.98-7.38Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.89 6.62-2.4l-3.23-2.51c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.08v2.59A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.93A6.01 6.01 0 0 1 6.1 12c0-.67.12-1.32.31-1.93V7.48H3.08A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.52l3.33-2.59Z" />
      <path fill="#EA4335" d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.95 2.95 14.7 2 12 2a10 10 0 0 0-8.92 5.48l3.33 2.59C7.2 7.71 9.4 5.95 12 5.95Z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg className="lawx-auth-provider-icon apple" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M16.7 12.3c0-2.2 1.8-3.3 1.9-3.4a4.1 4.1 0 0 0-3.2-1.7c-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8A4.5 4.5 0 0 0 5.2 9.5c-1.6 2.8-.4 7 1.1 9.2.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.7-.7 3.2-.7s1.9.7 3.2.7c1.3 0 2.2-1.2 2.9-2.3a10 10 0 0 0 1.3-2.7 4 4 0 0 1-3.1-3.7ZM14.5 5.8A4.1 4.1 0 0 0 15.4 3a4.1 4.1 0 0 0-2.7 1.4 3.9 3.9 0 0 0-1 2.7 3.4 3.4 0 0 0 2.8-1.3Z" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg className="lawx-auth-provider-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path fill="#fff" d="M13.5 20v-7h2.35l.35-2.74h-2.7V8.51c0-.79.22-1.33 1.36-1.33h1.45V4.73c-.25-.03-1.11-.11-2.11-.11-2.09 0-3.52 1.28-3.52 3.62v2.02H8.32V13h2.36v7h2.82Z" />
    </svg>
  );
}

export function LoginModal({ open, onClose }: Props) {
  const [method, setMethod] = useState<LoginMethod>("email");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.documentElement.classList.add("lawx-auth-open");
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.classList.remove("lawx-auth-open");
      window.removeEventListener("keydown", onKeyDown);

      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;

      window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setOtpSent(false);
      setMethod("email");
    }
  }, [open]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (method === "mobile" && !otpSent) setOtpSent(true);
  };

  return (
    <>
      <button
        type="button"
        className={`lawx-auth-backdrop ${open ? "active" : ""}`}
        aria-label="Close login"
        onClick={onClose}
        onWheel={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      />

      <section
        className={`lawx-auth-modal ${open ? "active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lawx-login-title"
        aria-hidden={!open}
        data-lenis-prevent
        onWheel={(event) => event.stopPropagation()}
      >
        <div className="lawx-auth-glow" />

        <div className="lawx-auth-brand-row">
          <Image
            src="/lawxygen-logo-clean.png"
            alt="LAWXYGEN"
            width={112}
            height={56}
            className="lawx-auth-logo"
          />

          <button
            type="button"
            className="lawx-auth-close"
            onClick={onClose}
            aria-label="Close login"
          >
            ×
          </button>
        </div>

        <div className="lawx-auth-title-block">
          <span>SECURE CLIENT ACCESS</span>
          <h2 id="lawx-login-title">Log in or sign up</h2>
          <p>Access consultations, appointments and your LAWXYGEN client account.</p>
        </div>

        <div className="lawx-auth-socials">
          <button type="button" className="lawx-auth-social-button">
            <GoogleMark />
            <span>Continue with Google</span>
          </button>

          <button type="button" className="lawx-auth-social-button">
            <AppleMark />
            <span>Continue with Apple</span>
          </button>

          <button type="button" className="lawx-auth-social-button">
            <FacebookMark />
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="lawx-auth-divider">
          <span>OR</span>
        </div>

        <div className="lawx-auth-method" aria-label="Login method">
          <button
            type="button"
            className={method === "email" ? "active" : ""}
            onClick={() => {
              setMethod("email");
              setOtpSent(false);
            }}
          >
            Email
          </button>
          <button
            type="button"
            className={method === "mobile" ? "active" : ""}
            onClick={() => {
              setMethod("mobile");
              setOtpSent(false);
            }}
          >
            Mobile + OTP
          </button>
        </div>

        <form className="lawx-auth-form" onSubmit={submit}>
          {method === "email" ? (
            <>
              <label>
                <span>Email address</span>
                <input type="email" placeholder="you@example.com" autoComplete="email" />
              </label>

              <label>
                <span>Password</span>
                <input type="password" placeholder="Enter your password" autoComplete="current-password" />
              </label>

              <div className="lawx-auth-meta">
                <label>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button">Forgot password?</button>
              </div>
            </>
          ) : (
            <>
              <label>
                <span>Mobile number</span>
                <div className="lawx-auth-phone-field">
                  <b>+91</b>
                  <input type="tel" placeholder="98765 43210" autoComplete="tel" />
                </div>
              </label>

              {otpSent && (
                <label>
                  <span>Enter 6-digit OTP</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="• • • • • •"
                    autoComplete="one-time-code"
                    className="lawx-auth-otp"
                  />
                </label>
              )}
            </>
          )}

          <button type="submit" className="lawx-auth-submit">
            {method === "email"
              ? "Continue"
              : otpSent
                ? "Verify OTP"
                : "Send OTP"}
            <span>→</span>
          </button>
        </form>

        <label className="lawx-auth-consent">
          <input type="checkbox" defaultChecked />
          <span>
            I agree to the <button type="button">Terms of Use</button> &amp; <button type="button">Privacy Policy</button>
          </span>
        </label>
      </section>
    </>
  );
}

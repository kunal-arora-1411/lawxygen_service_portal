import { FormEvent, useEffect, useState } from "react";
import apiService from "@/api/ApiService";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { GoogleLogin } from "@react-oauth/google";
import { initializeFacebook } from "@/utils/facebook";

type Props = {
  open: boolean;
  onClose: () => void;
};

function GoogleMark() {
  return (
    <svg
      className="lawx-auth-provider-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.31 2.98-7.38Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.89 6.62-2.4l-3.23-2.51c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.08v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.93A6.01 6.01 0 0 1 6.1 12c0-.67.12-1.32.31-1.93V7.48H3.08A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.52l3.33-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.95 2.95 14.7 2 12 2a10 10 0 0 0-8.92 5.48l3.33 2.59C7.2 7.71 9.4 5.95 12 5.95Z"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg
      className="lawx-auth-provider-icon apple"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M16.7 12.3c0-2.2 1.8-3.3 1.9-3.4a4.1 4.1 0 0 0-3.2-1.7c-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8A4.5 4.5 0 0 0 5.2 9.5c-1.6 2.8-.4 7 1.1 9.2.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.7-.7 3.2-.7s1.9.7 3.2.7c1.3 0 2.2-1.2 2.9-2.3a10 10 0 0 0 1.3-2.7 4 4 0 0 1-3.1-3.7ZM14.5 5.8A4.1 4.1 0 0 0 15.4 3a4.1 4.1 0 0 0-2.7 1.4 3.9 3.9 0 0 0-1 2.7 3.4 3.4 0 0 0 2.8-1.3Z"
      />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
        />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth={1.8} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M6.5 6.7C4 8.3 2 12 2 12s3.6 7 10 7c1.8 0 3.4-.5 4.7-1.3M9.9 4.2A9.7 9.7 0 0 1 12 4c6.4 0 10 8 10 8a17 17 0 0 1-2.9 4.1"
      />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg
      className="lawx-auth-provider-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.5 20v-7h2.35l.35-2.74h-2.7V8.51c0-.79.22-1.33 1.36-1.33h1.45V4.73c-.25-.03-1.11-.11-2.11-.11-2.09 0-3.52 1.28-3.52 3.62v2.02H8.32V13h2.36v7h2.82Z"
      />
    </svg>
  );
}

type ForgotStep = "email" | "otp" | "reset";

export function LoginModal({ open, onClose }: Props) {
  // Email authentication
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loginNotice, setLoginNotice] = useState<string | null>(null);

  // Forgot password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const navigate = useNavigate();
  // -----------------------------------------
  // Modal body scroll handling
  // -----------------------------------------

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
      if (event.key === "Escape") {
        onClose();
      }
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

      window.scrollTo({
        top: scrollY,
        left: 0,
        behavior: "auto",
      });
    };
  }, [open, onClose]);

  // -----------------------------------------
  // Reset modal when closed
  // -----------------------------------------

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);

      setFormError(null);
      setLoginNotice(null);
      setIsSubmitting(false);

      setShowForgotPassword(false);
      setForgotStep("email");
      setResetEmail("");
      setResetOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setForgotSubmitting(false);
      setForgotError(null);
    }
  }, [open]);

  // -----------------------------------------
  // Error helper
  // -----------------------------------------

  const extractErrorMessage = (error: any) => {
    return (
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again."
    );
  };

  // -----------------------------------------
  // Email authentication
  //
  // Backend decides:
  // existing email -> login
  // new email      -> create account
  // -----------------------------------------

  const handleEmailAuth = async () => {
    setFormError(null);

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      setFormError("Please enter your name.");
      return;
    }

    if (!normalizedEmail) {
      setFormError("Please enter your email address.");
      return;
    }

    if (!password) {
      setFormError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.call("emailAuth", {
        name: normalizedName,
        email: normalizedEmail,
        password,
      });

      console.log("Authentication successful:", response.data);

      // Get userId from backend response
      const userId = response.data.user._id;

      // Store userId in cookie
      Cookies.set("userId", userId, {
        expires: 7,
        sameSite: "lax",
        secure: import.meta.env.PROD,
      });

      console.log("User ID stored:", Cookies.get("userId"));

      onClose();

      if (normalizedEmail === "admin@lawxygen.local") {
        navigate("/admin");
      } else {
        navigate(`/dashboard/${userId}`);
      }
    } catch (error) {
      setFormError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------------------
  // Forgot password
  // -----------------------------------------

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setForgotStep("email");
    setResetEmail(email.trim());
    setResetOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setForgotError(null);
  };

  const backToLogin = () => {
    setShowForgotPassword(false);
    setForgotStep("email");
    setForgotError(null);
  };

  const handleRequestResetOtp = async () => {
    setForgotError(null);

    const normalizedEmail = resetEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setForgotError("Please enter your email address.");
      return;
    }

    setForgotSubmitting(true);

    try {
      await apiService.call("forgotPassword", { email: normalizedEmail });

      setResetEmail(normalizedEmail);
      setForgotStep("otp");
    } catch (error) {
      setForgotError(extractErrorMessage(error));
    } finally {
      setForgotSubmitting(false);
    }
  };

  const handleVerifyResetOtp = async () => {
    setForgotError(null);

    if (!resetOtp) {
      setForgotError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(resetOtp)) {
      setForgotError("Please enter a valid 6-digit OTP.");
      return;
    }

    setForgotSubmitting(true);

    try {
      await apiService.call("verifyResetOtp", {
        email: resetEmail,
        otp: resetOtp,
      });

      setForgotStep("reset");
    } catch (error) {
      window.alert(
        "Verification failed. Try again — the OTP you entered was not correct."
      );
      setForgotStep("email");
      setResetOtp("");
    } finally {
      setForgotSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    setForgotError(null);

    if (!newPassword || !confirmPassword) {
      setForgotError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword.length < 8) {
      setForgotError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    setForgotSubmitting(true);

    try {
      await apiService.call("resetPassword", {
        email: resetEmail,
        otp: resetOtp,
        newPassword,
      });

      setEmail(resetEmail);
      setPassword("");
      setLoginNotice("Password reset. Please log in with your new password.");
      setShowForgotPassword(false);
      setForgotStep("email");
    } catch (error) {
      setForgotError(extractErrorMessage(error));
    } finally {
      setForgotSubmitting(false);
    }
  };

  const handleFacebookLogin = async () => {
  try {
    setIsSubmitting(true);
    setFormError(null);

    await initializeFacebook();

    window.FB.login(
      async (response: any) => {
        try {
          if (!response.authResponse?.accessToken) {
            throw new Error(
              "Facebook authentication was cancelled."
            );
          }

          const accessToken =
            response.authResponse.accessToken;

          const result = await apiService.call(
            "facebookAuth",
            {
              accessToken,
            }
          );

          console.log(
            "Facebook authentication:",
            result.data
          );

          const userId = result.data.user._id;

          Cookies.set("userId", userId, {
            expires: 7,
            sameSite: "lax",
            secure: import.meta.env.PROD,
          });

          onClose();

          navigate(`/dashboard/${userId}`);
        } catch (error) {
          setFormError(
            extractErrorMessage(error)
          );
        } finally {
          setIsSubmitting(false);
        }
      },
      {
        scope: "public_profile,email",
      }
    );
  } catch (error) {
    setIsSubmitting(false);
    setFormError(
      extractErrorMessage(error)
    );
  }
};

  // -----------------------------------------
  // Form submit
  // -----------------------------------------

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleEmailAuth();
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="lawx-auth-backdrop active"
        aria-label="Close login"
        onClick={onClose}
        onWheel={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      />

      <section
        className="lawx-auth-modal active"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lawx-login-title"
        data-lenis-prevent
        onWheel={(event) => event.stopPropagation()}
      >
        <div className="lawx-auth-glow" />

        {/* Brand */}
        <div className="lawx-auth-brand-row">
          <img
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

        {/* Heading */}
        {showForgotPassword ? (
          <div className="lawx-auth-title-block">
            <span>ACCOUNT RECOVERY</span>

            {forgotStep === "email" && (
              <>
                <h2 id="lawx-login-title">Reset your password</h2>
                <p>
                  Enter the email linked to your account and we&rsquo;ll send you a one-time code.
                </p>
              </>
            )}

            {forgotStep === "otp" && (
              <>
                <h2 id="lawx-login-title">Enter the OTP</h2>
                <p>
                  OTP sent to <b>{resetEmail}</b>. It&rsquo;s valid for 10 minutes.
                </p>
              </>
            )}

            {forgotStep === "reset" && (
              <>
                <h2 id="lawx-login-title">Set a new password</h2>
                <p>Choose a new password for {resetEmail}.</p>
              </>
            )}
          </div>
        ) : (
          <div className="lawx-auth-title-block">
            <span>SECURE CLIENT ACCESS</span>

            <h2 id="lawx-login-title">Log in or sign up</h2>

            <p>
              Access consultations, appointments and your LAWXYGEN client account.
            </p>
          </div>
        )}

        {/* Social Login */}
        {!showForgotPassword && (
        <div className="lawx-auth-socials">
          {/* <button
            type="button"
            className="lawx-auth-social-button"
            onClick={() => {
              // TODO: Google authentication
            }}
          >
            <GoogleMark />
            <span>Continue with Google</span>
          </button> */}

          <GoogleLogin
            shape="pill"
            logo_alignment="center"
            text="continue_with"
            onSuccess={async (credentialResponse) => {
              try {
                setIsSubmitting(true);
                setFormError(null);

                if (!credentialResponse.credential) {
                  throw new Error("Google credential was not received.");
                }

                const response = await apiService.call("googleAuth", {
                  credential: credentialResponse.credential,
                });

                console.log("Google authentication:", response.data);

                const userId = response.data.user._id;

                // If you're storing userId in your frontend cookie
                Cookies.set("userId", userId, {
                  expires: 7,
                  sameSite: "lax",
                  secure: import.meta.env.PROD,
                });

                onClose();

                navigate(`/dashboard/${userId}`);
              } catch (error) {
                setFormError(extractErrorMessage(error));
              } finally {
                setIsSubmitting(false);
              }
            }}
            onError={() => {
              setFormError("Google authentication failed.");
            }}
          />

          <button
            type="button"
            className="lawx-auth-social-button"
            onClick={handleFacebookLogin}
          >
            <FacebookMark />
            <span>Continue with Facebook</span>
          </button>
        </div>
        )}

        {/* Divider */}
        {!showForgotPassword && (
        <div className="lawx-auth-divider">
          <span>OR</span>
        </div>
        )}

        {/* Login form */}
        {!showForgotPassword && (
        <form className="lawx-auth-form" onSubmit={submit}>
          {loginNotice && <p className="lawx-auth-notice">{loginNotice}</p>}

          <label>
            <span>Full name</span>

            <input
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setFormError(null);
                setLoginNotice(null);
              }}
              required
            />
          </label>

          <label>
            <span>Email address</span>

            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFormError(null);
                setLoginNotice(null);
              }}
              required
            />
          </label>

          <label>
            <span>Password</span>

            <div className="lawx-auth-password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFormError(null);
                }}
                required
              />

              <button
                type="button"
                className="lawx-auth-password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </label>

          <div className="lawx-auth-meta">
            <label>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button type="button" onClick={openForgotPassword}>
              Forgot password?
            </button>
          </div>

          {/* Error */}
          {formError && <p className="lawx-auth-error">{formError}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="lawx-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Please wait…" : "Continue"}

            <span>→</span>
          </button>
        </form>
        )}

        {/* Forgot password: step 1 — request OTP */}
        {showForgotPassword && forgotStep === "email" && (
          <form
            className="lawx-auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleRequestResetOtp();
            }}
          >
            <label>
              <span>Email address</span>

              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={resetEmail}
                onChange={(event) => {
                  setResetEmail(event.target.value);
                  setForgotError(null);
                }}
                required
              />
            </label>

            {forgotError && <p className="lawx-auth-error">{forgotError}</p>}

            <button type="submit" className="lawx-auth-submit" disabled={forgotSubmitting}>
              {forgotSubmitting ? "Sending…" : "Send OTP"}
              <span>→</span>
            </button>

            <button type="button" className="lawx-auth-back" onClick={backToLogin}>
              ← Back to log in
            </button>
          </form>
        )}

        {/* Forgot password: step 2 — verify OTP */}
        {showForgotPassword && forgotStep === "otp" && (
          <form
            className="lawx-auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleVerifyResetOtp();
            }}
          >
            <label>
              <span>Enter 6-digit OTP</span>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="• • • • • •"
                autoComplete="one-time-code"
                className="lawx-auth-otp"
                value={resetOtp}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "").slice(0, 6);
                  setResetOtp(value);
                  setForgotError(null);
                }}
                required
              />
            </label>

            {forgotError && <p className="lawx-auth-error">{forgotError}</p>}

            <button type="submit" className="lawx-auth-submit" disabled={forgotSubmitting}>
              {forgotSubmitting ? "Verifying…" : "Verify"}
              <span>→</span>
            </button>

            <div className="lawx-auth-meta">
              <button type="button" onClick={handleRequestResetOtp} disabled={forgotSubmitting}>
                Resend OTP
              </button>

              <button type="button" onClick={backToLogin}>
                ← Back to log in
              </button>
            </div>
          </form>
        )}

        {/* Forgot password: step 3 — set new password */}
        {showForgotPassword && forgotStep === "reset" && (
          <form
            className="lawx-auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleResetPassword();
            }}
          >
            <label>
              <span>New password</span>

              <div className="lawx-auth-password-field">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setForgotError(null);
                  }}
                  required
                />

                <button
                  type="button"
                  className="lawx-auth-password-toggle"
                  onClick={() => setShowNewPassword((value) => !value)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  aria-pressed={showNewPassword}
                >
                  <EyeIcon open={showNewPassword} />
                </button>
              </div>
            </label>

            <label>
              <span>Confirm new password</span>

              <div className="lawx-auth-password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setForgotError(null);
                  }}
                  required
                />

                <button
                  type="button"
                  className="lawx-auth-password-toggle"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  aria-pressed={showConfirmPassword}
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>
            </label>

            {forgotError && <p className="lawx-auth-error">{forgotError}</p>}

            <button type="submit" className="lawx-auth-submit" disabled={forgotSubmitting}>
              {forgotSubmitting ? "Saving…" : "Reset password"}
              <span>→</span>
            </button>

            <button type="button" className="lawx-auth-back" onClick={backToLogin}>
              ← Back to log in
            </button>
          </form>
        )}

        {/* Consent */}
        {!showForgotPassword && (
        <label className="lawx-auth-consent">
          <input type="checkbox" defaultChecked />

          <span>
            I agree to the <button type="button">Terms of Use</button> &amp;{" "}
            <button type="button">Privacy Policy</button>
          </span>
        </label>
        )}
      </section>
    </>
  );
}

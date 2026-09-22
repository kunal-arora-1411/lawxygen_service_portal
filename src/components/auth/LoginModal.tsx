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

type LoginMethod = "email" | "mobile";

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

export function LoginModal({ open, onClose }: Props) {
  const [method, setMethod] = useState<LoginMethod>("email");

  // Email authentication
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Mobile authentication
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
      setMethod("email");

      setEmail("");
      setPassword("");

      setPhone("");
      setOtp("");
      setOtpSent(false);

      setFormError(null);
      setIsSubmitting(false);
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

    const normalizedEmail = email.trim().toLowerCase();

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

      navigate(`/dashboard/${userId}`);
    } catch (error) {
      setFormError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
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
  // Send phone OTP
  // -----------------------------------------

  const handleSendOtp = async () => {
    setFormError(null);

    const normalizedPhone = phone.replace(/\D/g, "");

    if (!normalizedPhone) {
      setFormError("Please enter your mobile number.");
      return;
    }

    if (normalizedPhone.length !== 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.call("sendPhoneOtp", {
        phone: normalizedPhone,
      });

      setOtpSent(true);
    } catch (error) {
      setFormError(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------------------
  // Verify phone OTP
  //
  // Backend decides:
  // existing phone -> login
  // new phone      -> create account
  // -----------------------------------------

  const handleVerifyOtp = async () => {
    setFormError(null);

    if (!otp) {
      setFormError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setFormError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedPhone = phone.replace(/\D/g, "");

      const response = await apiService.call("verifyPhoneOtp", {
        phone: normalizedPhone,
        otp,
      });

      console.log("Phone authentication successful:", response.data);

      // response.data.isNewUser tells you whether
      // this was a newly created account.

      const userId = response.data.user._id;

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
  };

  // -----------------------------------------
  // Form submit
  // -----------------------------------------

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (method === "email") {
      await handleEmailAuth();
      return;
    }

    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    await handleVerifyOtp();
  };

  // -----------------------------------------
  // Switch authentication method
  // -----------------------------------------

  const switchMethod = (nextMethod: LoginMethod) => {
    setMethod(nextMethod);
    setFormError(null);

    if (nextMethod === "email") {
      setOtpSent(false);
      setOtp("");
    }
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
        <div className="lawx-auth-title-block">
          <span>SECURE CLIENT ACCESS</span>

          <h2 id="lawx-login-title">Log in or sign up</h2>

          <p>
            Access consultations, appointments and your LAWXYGEN client account.
          </p>
        </div>

        {/* Social Login */}
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

        {/* Divider */}
        <div className="lawx-auth-divider">
          <span>OR</span>
        </div>

        {/* Email / Mobile tabs */}
        <div className="lawx-auth-method" aria-label="Authentication method">
          <button
            type="button"
            className={method === "email" ? "active" : ""}
            onClick={() => switchMethod("email")}
          >
            Email
          </button>

          <button
            type="button"
            className={method === "mobile" ? "active" : ""}
            onClick={() => switchMethod("mobile")}
          >
            Mobile + OTP
          </button>
        </div>

        {/* Form */}
        <form className="lawx-auth-form" onSubmit={submit}>
          {method === "email" && (
            <>
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
                  }}
                  required
                />
              </label>

              <label>
                <span>Password</span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFormError(null);
                  }}
                  required
                />
              </label>

              <div className="lawx-auth-meta">
                <label>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    // TODO: forgot password
                  }}
                >
                  Forgot password?
                </button>
              </div>
            </>
          )}

          {/* ================================
              MOBILE
          ================================= */}
          {method === "mobile" && (
            <>
              {!otpSent ? (
                <label>
                  <span>Mobile number</span>

                  <div className="lawx-auth-phone-field">
                    <b>+91</b>

                    <input
                      type="tel"
                      placeholder="98765 43210"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => {
                        const value = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);

                        setPhone(value);
                        setFormError(null);
                      }}
                      required
                    />
                  </div>
                </label>
              ) : (
                <>
                  <label>
                    <span>Mobile number</span>

                    <div className="lawx-auth-phone-field">
                      <b>+91</b>

                      <input type="tel" value={phone} disabled />
                    </div>
                  </label>

                  <label>
                    <span>Enter 6-digit OTP</span>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="• • • • • •"
                      autoComplete="one-time-code"
                      className="lawx-auth-otp"
                      value={otp}
                      onChange={(event) => {
                        const value = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);

                        setOtp(value);
                        setFormError(null);
                      }}
                      required
                    />
                  </label>

                  <button
                    type="button"
                    className="lawx-auth-resend"
                    onClick={handleSendOtp}
                    disabled={isSubmitting}
                  >
                    Resend OTP
                  </button>
                </>
              )}
            </>
          )}

          {/* Error */}
          {formError && <p className="lawx-auth-error">{formError}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="lawx-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? method === "mobile"
                ? otpSent
                  ? "Verifying…"
                  : "Sending OTP…"
                : "Please wait…"
              : method === "mobile"
                ? otpSent
                  ? "Verify OTP"
                  : "Send OTP"
                : "Continue"}

            <span>→</span>
          </button>
        </form>

        {/* Consent */}
        <label className="lawx-auth-consent">
          <input type="checkbox" defaultChecked />

          <span>
            I agree to the <button type="button">Terms of Use</button> &amp;{" "}
            <button type="button">Privacy Policy</button>
          </span>
        </label>
      </section>
    </>
  );
}

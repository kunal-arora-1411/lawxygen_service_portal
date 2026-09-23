import { FormEvent, useEffect, useState } from "react";
import apiService from "@/api/ApiService";
import { updateCurrentUser, updateCurrentUserPassword } from "@/services/portalApi";
import { useAuth } from "@/context/AuthContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

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

interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified?: boolean;
  createdAt?: string;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AccountSettingsModal({ open, onClose }: Props) {
  const { refresh: refreshSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setError(null);
    setNotice(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setPasswordNotice(null);

    apiService
      .call("getCurrentUser")
      .then((response) => {
        const data = (response.data?.user ?? response.data) as CurrentUser;
        setUser(data);
        setName(data?.name ?? "");
        setPhone(data?.phone ?? "");
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Couldn't load your account details.");
      })
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.documentElement.classList.add("lawx-auth-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.classList.remove("lawx-auth-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    setSaving(true);

    try {
      await updateCurrentUser({ name: trimmedName, phone: phone.trim() || undefined });
      // Keep the shared session copy in step, so the header and portal shell
      // pick up the new name instead of showing the one loaded at boot.
      await refreshSession();
      setNotice("Your details have been updated.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordError(null);
    setPasswordNotice(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setPasswordSaving(true);

    try {
      await updateCurrentUserPassword({ currentPassword, newPassword });
      setPasswordNotice("Your password has been updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message || "Couldn't update your password. Please try again.");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="lawx-auth-backdrop active"
        aria-label="Close account settings"
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
        aria-labelledby="lawx-settings-title"
        data-lenis-prevent
        onWheel={(event) => event.stopPropagation()}
      >
        <div className="lawx-auth-glow" />

        <div className="lawx-auth-brand-row">
          <span style={{ fontWeight: 700, fontSize: 13, color: "#0c2c4c" }}>Account settings</span>

          <button
            type="button"
            className="lawx-auth-close"
            onClick={onClose}
            aria-label="Close account settings"
          >
            ×
          </button>
        </div>

        <div className="lawx-auth-title-block">
          <span>YOUR ACCOUNT</span>
          <h2 id="lawx-settings-title">Manage your details</h2>
          <p>View your account information and update your name or phone number.</p>
        </div>

        {loading ? (
          <p style={{ padding: "16px 0", color: "#71869c", fontSize: 11 }}>
            Loading your details…
          </p>
        ) : (
          <>
            <form className="lawx-auth-form" onSubmit={handleSave}>
              {notice && <p className="lawx-auth-notice">{notice}</p>}

              <label>
                <span>Full name</span>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError(null);
                  }}
                  required
                />
              </label>

              <label>
                <span>Email address</span>
                <input type="email" value={user?.email ?? ""} disabled />
              </label>

              <label>
                <span>Phone number</span>

                <input
                  type="tel"
                  value={phone}
                  placeholder="Add a phone number"
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setError(null);
                  }}
                />
              </label>

              <div className="lawx-auth-meta">
                <span style={{ color: "#718398", fontSize: 9.5 }}>
                  Member since {formatDate(user?.createdAt)}
                </span>
                <span style={{ color: "#718398", fontSize: 9.5 }}>
                  {user?.isVerified ? "Verified account" : "Not verified"}
                </span>
              </div>

              {error && <p className="lawx-auth-error">{error}</p>}

              <button type="submit" className="lawx-auth-submit" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
                <span>→</span>
              </button>
            </form>

            <div className="lawx-auth-divider"><span>Change password</span></div>

            <form className="lawx-auth-form" onSubmit={handlePasswordSave}>
              {passwordNotice && <p className="lawx-auth-notice">{passwordNotice}</p>}

              <label>
                <span>Current password</span>

                <div className="lawx-auth-password-field">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) => {
                      setCurrentPassword(event.target.value);
                      setPasswordError(null);
                    }}
                    required
                  />

                  <button
                    type="button"
                    className="lawx-auth-password-toggle"
                    onClick={() => setShowCurrentPassword((value) => !value)}
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                    aria-pressed={showCurrentPassword}
                  >
                    <EyeIcon open={showCurrentPassword} />
                  </button>
                </div>
              </label>

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
                      setPasswordError(null);
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
                      setPasswordError(null);
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

              {passwordError && <p className="lawx-auth-error">{passwordError}</p>}

              <button type="submit" className="lawx-auth-submit" disabled={passwordSaving}>
                {passwordSaving ? "Updating…" : "Update password"}
                <span>→</span>
              </button>
            </form>
          </>
        )}
      </section>
    </>
  );
}

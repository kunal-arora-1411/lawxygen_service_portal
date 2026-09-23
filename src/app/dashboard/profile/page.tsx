import { FormEvent, useEffect, useMemo, useState } from "react";
import { PortalIcon, PortalIconName } from "@/components/portal/PortalIcons";
import { PortalEmptyState } from "@/components/portal/PortalEmptyState";
import { useUserId } from "@/hooks/useUserId";
import {
  getCurrentUserProfile,
  updateCurrentUser,
  updateCurrentUserPassword,
  UpdateProfilePayload,
  UserProfile,
} from "@/services/portalApi";
import { formatShortDate } from "@/utils/portalFormat";
import styles from "./Profile.module.css";

// =========================================================================
// Section / field definitions
//
// `tracked: true` marks a field as counting toward the completion score, so
// adding a field here automatically updates the percentage, the "N fields
// remaining" note and the per-section status — nothing else to change.
// =========================================================================

type FieldType = "text" | "email" | "tel" | "date" | "select";

type FieldDef = {
  key: string; // dot path into UserProfile
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  readOnly?: boolean;
  tracked?: boolean;
  hint?: string;
};

type ToggleDef = { key: string; label: string; note: string };

type SectionDef = {
  id: string;
  title: string;
  subtitle: string;
  icon: PortalIconName;
  fields: FieldDef[];
  toggles?: ToggleDef[];
};

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "undisclosed", label: "Prefer not to say" },
];

const BUSINESS_TYPE_OPTIONS = [
  { value: "private_limited", label: "Private Limited Company" },
  { value: "opc", label: "One Person Company" },
  { value: "llp", label: "Limited Liability Partnership" },
  { value: "partnership", label: "Partnership Firm" },
  { value: "proprietorship", label: "Sole Proprietorship" },
  { value: "public_limited", label: "Public Limited Company" },
  { value: "trust_ngo", label: "Trust / Society / NGO" },
  { value: "unregistered", label: "Not registered yet" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "mr", label: "Marathi" },
  { value: "gu", label: "Gujarati" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "bn", label: "Bengali" },
  { value: "kn", label: "Kannada" },
];

const SECTIONS: SectionDef[] = [
  {
    id: "personal",
    title: "Personal information",
    subtitle: "Name, contact details and date of birth",
    icon: "profile",
    fields: [
      { key: "name", label: "Full name", type: "text", placeholder: "Your full name", tracked: true },
      { key: "email", label: "Email address", type: "email", readOnly: true, hint: "Email can't be changed", tracked: true },
      { key: "phone", label: "Phone number", type: "tel", placeholder: "98765 43210", tracked: true },
      { key: "dateOfBirth", label: "Date of birth", type: "date", tracked: true },
      { key: "gender", label: "Gender", type: "select", options: GENDER_OPTIONS, tracked: true },
    ],
  },
  {
    id: "address",
    title: "Address",
    subtitle: "Where we send physical correspondence",
    icon: "location",
    fields: [
      { key: "address.line1", label: "Address line 1", type: "text", placeholder: "Flat / building / street", tracked: true },
      { key: "address.line2", label: "Address line 2", type: "text", placeholder: "Area / landmark (optional)" },
      { key: "address.city", label: "City", type: "text", placeholder: "e.g. Mumbai", tracked: true },
      { key: "address.state", label: "State", type: "text", placeholder: "e.g. Maharashtra", tracked: true },
      { key: "address.postalCode", label: "PIN code", type: "text", placeholder: "400001", tracked: true },
      { key: "address.country", label: "Country", type: "text", placeholder: "India", tracked: true },
    ],
  },
  {
    id: "business",
    title: "Business profile",
    subtitle: "Company details used on filings and documents",
    icon: "services",
    fields: [
      { key: "business.companyName", label: "Company name", type: "text", placeholder: "Registered business name", tracked: true },
      { key: "business.businessType", label: "Business type", type: "select", options: BUSINESS_TYPE_OPTIONS, tracked: true },
      { key: "business.designation", label: "Your designation", type: "text", placeholder: "e.g. Director", tracked: true },
      { key: "business.industry", label: "Industry", type: "text", placeholder: "e.g. Information Technology", tracked: true },
      { key: "business.gstin", label: "GSTIN", type: "text", placeholder: "27ABCDE1234F1Z5", tracked: true },
      { key: "business.pan", label: "PAN", type: "text", placeholder: "ABCDE1234F", tracked: true },
      { key: "business.website", label: "Website", type: "text", placeholder: "https://example.com" },
    ],
  },
  {
    id: "preferences",
    title: "Communication preferences",
    subtitle: "How LAWXYGEN keeps you updated",
    icon: "settings",
    fields: [
      { key: "preferences.language", label: "Preferred language", type: "select", options: LANGUAGE_OPTIONS, tracked: true },
    ],
    toggles: [
      { key: "preferences.emailNotifications", label: "Email notifications", note: "Matter updates and reminders" },
      { key: "preferences.smsNotifications", label: "SMS notifications", note: "Time-sensitive alerts" },
      { key: "preferences.whatsappNotifications", label: "WhatsApp notifications", note: "Updates on WhatsApp" },
      { key: "preferences.marketingEmails", label: "Product & offer emails", note: "Occasional news and offers" },
    ],
  },
];

const SECURITY_SECTION = {
  id: "security",
  title: "Security",
  subtitle: "Password and linked sign-in methods",
  icon: "shield" as PortalIconName,
};

// =========================================================================
// Helpers
// =========================================================================

function getValue(source: any, path: string): any {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), source);
}

function setValue<T extends object>(source: T, path: string, value: any): T {
  const keys = path.split(".");
  const next: any = { ...source };
  let cursor = next;

  for (let i = 0; i < keys.length - 1; i += 1) {
    cursor[keys[i]] = { ...(cursor[keys[i]] ?? {}) };
    cursor = cursor[keys[i]];
  }

  cursor[keys[keys.length - 1]] = value;
  return next;
}

function isFilled(value: any) {
  return value != null && String(value).trim() !== "";
}

function trackedFieldsOf(section: SectionDef) {
  return section.fields.filter((field) => field.tracked);
}

function getInitials(name?: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function toDateInputValue(value?: string) {
  if (!value) return "";
  // Accepts both a plain "YYYY-MM-DD" and a full ISO timestamp.
  return String(value).slice(0, 10);
}

function extractErrorMessage(error: any, fallback: string) {
  return error?.response?.data?.message || fallback;
}

// =========================================================================
// Page
// =========================================================================

export default function Page() {
  const userId = useUserId();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const [openSection, setOpenSection] = useState<string | null>(null);
  const [draft, setDraft] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    getCurrentUserProfile()
      .then((data) => {
        setProfile(data);
        setLoadFailed(false);
      })
      .catch((error) => {
        console.error("Failed to load profile:", error);
        setLoadFailed(true);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // --- completion --------------------------------------------------------

  const completion = useMemo(() => {
    const all = SECTIONS.flatMap(trackedFieldsOf);
    const filled = all.filter((field) => isFilled(getValue(profile, field.key)));

    return {
      total: all.length,
      filled: filled.length,
      remaining: all.length - filled.length,
      percent: all.length === 0 ? 100 : Math.round((filled.length / all.length) * 100),
    };
  }, [profile]);

  const sectionStatus = useMemo(() => {
    const map: Record<string, { total: number; remaining: number }> = {};

    SECTIONS.forEach((section) => {
      const tracked = trackedFieldsOf(section);
      const remaining = tracked.filter((field) => !isFilled(getValue(profile, field.key))).length;
      map[section.id] = { total: tracked.length, remaining };
    });

    return map;
  }, [profile]);

  const providers = profile?.authProviders ?? {};
  const providerCount = [providers.password, providers.google, providers.facebook].filter(Boolean).length;
  const providerLabel =
    [providers.password && "Email", providers.google && "Google", providers.facebook && "Facebook"]
      .filter(Boolean)
      .join(" + ") || "Not configured";

  const enabledNotifications = [
    profile?.preferences?.emailNotifications,
    profile?.preferences?.smsNotifications,
    profile?.preferences?.whatsappNotifications,
    profile?.preferences?.marketingEmails,
  ].filter(Boolean).length;

  // --- open / cancel / save ----------------------------------------------

  const toggleSection = (id: string) => {
    if (openSection === id) {
      cancelEdit();
      return;
    }

    setOpenSection(id);
    setDraft(profile ? { ...profile } : null);
    setSectionError(null);
    setNotice(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const cancelEdit = () => {
    setOpenSection(null);
    setDraft(null);
    setSectionError(null);
  };

  const updateDraft = (key: string, value: any) => {
    setDraft((prev) => (prev ? setValue(prev, key, value) : prev));
    setSectionError(null);
  };

  const handleSaveSection = (section: SectionDef) => (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;

    if (section.id === "personal" && !isFilled(draft.name)) {
      setSectionError("Please enter your name.");
      return;
    }

    // Only send this section's own fields, so saving one card can never
    // clobber values a different card is holding.
    let payload: UpdateProfilePayload = {};

    section.fields.forEach((field) => {
      if (field.readOnly) return;
      payload = setValue(payload, field.key, getValue(draft, field.key) ?? "");
    });

    section.toggles?.forEach((toggle) => {
      payload = setValue(payload, toggle.key, Boolean(getValue(draft, toggle.key)));
    });

    setSaving(true);
    setSectionError(null);

    updateCurrentUser(payload)
      .then((updated: any) => {
        const serverUser = (updated?.user ?? updated) as UserProfile | undefined;
        setProfile(serverUser?._id ? { ...draft, ...serverUser } : draft);
        setNotice(`${section.title} updated.`);
        setOpenSection(null);
        setDraft(null);
      })
      .catch((error) => {
        console.error("Failed to save profile section:", error);
        setSectionError(extractErrorMessage(error, "Couldn't save your changes. Please try again."));
      })
      .finally(() => setSaving(false));
  };

  const handleSavePassword = (event: FormEvent) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSectionError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setSectionError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSectionError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);
    setSectionError(null);

    updateCurrentUserPassword({ currentPassword, newPassword })
      .then(() => {
        setNotice("Password updated. You may need to sign in again.");
        setOpenSection(null);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        console.error("Failed to update password:", error);
        setSectionError(extractErrorMessage(error, "Couldn't update your password. Please try again."));
      })
      .finally(() => setSaving(false));
  };

  // --- field renderer -----------------------------------------------------

  const renderField = (field: FieldDef) => {
    const rawValue = getValue(draft, field.key);
    const value = field.type === "date" ? toDateInputValue(rawValue) : (rawValue ?? "");

    return (
      <label className={styles.field} key={field.key}>
        <span>{field.label}</span>

        {field.type === "select" ? (
          <select
            value={value}
            disabled={field.readOnly}
            onChange={(event) => updateDraft(field.key, event.target.value)}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            value={value}
            placeholder={field.placeholder}
            disabled={field.readOnly}
            onChange={(event) => updateDraft(field.key, event.target.value)}
          />
        )}

        {field.hint && <small className={styles.fieldHint}>{field.hint}</small>}
      </label>
    );
  };

  const metrics = [
    {
      label: "Profile complete",
      value: `${completion.percent}%`,
      note: completion.remaining === 0
        ? "All details added"
        : `${completion.remaining} field${completion.remaining === 1 ? "" : "s"} remaining`,
      icon: "profile" as PortalIconName,
      progress: completion.percent,
    },
    {
      label: "Business",
      value: isFilled(profile?.business?.companyName) ? "1" : "0",
      note: isFilled(profile?.business?.companyName)
        ? profile?.business?.companyName ?? "Primary workspace"
        : "No business added yet",
      icon: "services" as PortalIconName,
    },
    {
      label: "Sign-in methods",
      value: String(providerCount),
      note: providerLabel,
      icon: "shield" as PortalIconName,
    },
    {
      label: "Preferences",
      value: String(enabledNotifications),
      note: enabledNotifications > 0 ? "Notification channels on" : "All notifications off",
      icon: "settings" as PortalIconName,
    },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.head}>
        <div>
          <span>ACCOUNT</span>
          <h1>Profile &amp; preferences</h1>
          <p>Manage contact details, business information and account security.</p>
        </div>

        {profile && (
          <div className={styles.identity}>
            <span className={styles.avatar}>{getInitials(profile.name)}</span>
            <div className={styles.identityCopy}>
              <strong>{profile.name || "Your account"}</strong>
              <small>{profile.email}</small>
              <small>Member since {formatShortDate(profile.createdAt ?? "")}</small>
            </div>
          </div>
        )}
      </section>

      <section className={styles.metrics}>
        {metrics.map((item) => (
          <article key={item.label}>
            <i><PortalIcon name={item.icon} /></i>
            <div className={styles.metricBody}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <small>{item.note}</small>
              {item.progress != null && (
                <span className={styles.bar}><i style={{ width: `${item.progress}%` }} /></span>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <strong>Account sections</strong>
            <span>Open a section to view and edit its details.</span>
          </div>
        </div>

        {notice && <p className={styles.notice}>{notice}</p>}

        {loading && <p className={styles.loadingNote}>Loading your profile…</p>}

        {!loading && loadFailed && (
          <PortalEmptyState icon="profile" title="Not available" note="We couldn't load your profile right now." />
        )}

        {!loading && !loadFailed && profile && (
          <div className={styles.rows}>
            {SECTIONS.map((section) => {
              const isOpen = openSection === section.id;
              const status = sectionStatus[section.id];
              const complete = status.remaining === 0;

              return (
                <div
                  key={section.id}
                  className={`${styles.sectionBlock} ${isOpen ? styles.sectionBlockOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.row}
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.rowIcon}><PortalIcon name={section.icon} size={16} /></span>

                    <span className={styles.copy}>
                      <strong>{section.title}</strong>
                      <span>{section.subtitle}</span>
                    </span>

                    <span className={styles.meta}>
                      {complete
                        ? `${status.total} of ${status.total} added`
                        : `${status.remaining} field${status.remaining === 1 ? "" : "s"} incomplete`}
                    </span>

                    <span className={`${styles.status} ${complete ? styles.good : styles.warn}`}>
                      {complete ? "Complete" : "Incomplete"}
                    </span>

                    <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
                      <PortalIcon name="arrow" size={14} />
                    </span>
                  </button>

                  {isOpen && draft && (
                    <form className={styles.editPanel} onSubmit={handleSaveSection(section)}>
                      <div className={styles.grid2}>{section.fields.map(renderField)}</div>

                      {section.toggles && (
                        <>
                          <p className={styles.subhead}>Notification channels</p>
                          <div className={styles.toggleList}>
                            {section.toggles.map((toggle) => (
                              <label className={styles.toggleRow} key={toggle.key}>
                                <span className={styles.toggleCopy}>
                                  <strong>{toggle.label}</strong>
                                  <span>{toggle.note}</span>
                                </span>
                                <input
                                  type="checkbox"
                                  checked={Boolean(getValue(draft, toggle.key))}
                                  onChange={(event) => updateDraft(toggle.key, event.target.checked)}
                                />
                              </label>
                            ))}
                          </div>
                        </>
                      )}

                      {sectionError && <p className={styles.error}>{sectionError}</p>}

                      <div className={styles.formActions}>
                        <button type="submit" className={styles.primaryButton} disabled={saving}>
                          {saving ? "Saving…" : "Save changes"}
                        </button>
                        <button type="button" className={styles.ghostButton} onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })}

            {/* Security is its own shape: a password form plus linked providers. */}
            <div
              className={`${styles.sectionBlock} ${openSection === SECURITY_SECTION.id ? styles.sectionBlockOpen : ""}`}
            >
              <button
                type="button"
                className={styles.row}
                onClick={() => toggleSection(SECURITY_SECTION.id)}
                aria-expanded={openSection === SECURITY_SECTION.id}
              >
                <span className={styles.rowIcon}><PortalIcon name={SECURITY_SECTION.icon} size={16} /></span>

                <span className={styles.copy}>
                  <strong>{SECURITY_SECTION.title}</strong>
                  <span>{SECURITY_SECTION.subtitle}</span>
                </span>

                <span className={styles.meta}>
                  {providerCount} sign-in method{providerCount === 1 ? "" : "s"}
                </span>

                <span className={`${styles.status} ${providerCount > 0 ? styles.good : styles.neutral}`}>
                  {providerCount > 0 ? "Protected" : "Review"}
                </span>

                <span className={`${styles.chevron} ${openSection === SECURITY_SECTION.id ? styles.chevronOpen : ""}`}>
                  <PortalIcon name="arrow" size={14} />
                </span>
              </button>

              {openSection === SECURITY_SECTION.id && (
                <form className={styles.editPanel} onSubmit={handleSavePassword}>
                  <p className={styles.subhead}>Linked sign-in methods</p>
                  <div className={styles.providerList}>
                    {[
                      { key: "password", label: "Email & password", on: Boolean(providers.password) },
                      { key: "google", label: "Google", on: Boolean(providers.google) },
                      { key: "facebook", label: "Facebook", on: Boolean(providers.facebook) },
                    ].map((provider) => (
                      <div className={styles.providerRow} key={provider.key}>
                        <strong>{provider.label}</strong>
                        <span className={`${styles.providerPill} ${provider.on ? styles.providerOn : styles.providerOff}`}>
                          {provider.on ? "Connected" : "Not linked"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className={styles.subhead}>Change password</p>
                  <div className={styles.grid2}>
                    <label className={styles.field}>
                      <span>Current password</span>
                      <div className={styles.passwordField}>
                        <input
                          type={showCurrent ? "text" : "password"}
                          autoComplete="current-password"
                          value={currentPassword}
                          onChange={(event) => {
                            setCurrentPassword(event.target.value);
                            setSectionError(null);
                          }}
                        />
                        <button
                          type="button"
                          className={styles.passwordToggle}
                          onClick={() => setShowCurrent((value) => !value)}
                          aria-label={showCurrent ? "Hide password" : "Show password"}
                        >
                          <PortalIcon name={showCurrent ? "eye" : "eyeOff"} size={16} />
                        </button>
                      </div>
                    </label>

                    <label className={styles.field}>
                      <span>New password</span>
                      <div className={styles.passwordField}>
                        <input
                          type={showNew ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="At least 8 characters"
                          value={newPassword}
                          onChange={(event) => {
                            setNewPassword(event.target.value);
                            setSectionError(null);
                          }}
                        />
                        <button
                          type="button"
                          className={styles.passwordToggle}
                          onClick={() => setShowNew((value) => !value)}
                          aria-label={showNew ? "Hide password" : "Show password"}
                        >
                          <PortalIcon name={showNew ? "eye" : "eyeOff"} size={16} />
                        </button>
                      </div>
                    </label>

                    <label className={styles.field}>
                      <span>Confirm new password</span>
                      <div className={styles.passwordField}>
                        <input
                          type={showConfirm ? "text" : "password"}
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(event) => {
                            setConfirmPassword(event.target.value);
                            setSectionError(null);
                          }}
                        />
                        <button
                          type="button"
                          className={styles.passwordToggle}
                          onClick={() => setShowConfirm((value) => !value)}
                          aria-label={showConfirm ? "Hide password" : "Show password"}
                        >
                          <PortalIcon name={showConfirm ? "eye" : "eyeOff"} size={16} />
                        </button>
                      </div>
                    </label>
                  </div>

                  {sectionError && <p className={styles.error}>{sectionError}</p>}

                  <div className={styles.formActions}>
                    <button type="submit" className={styles.primaryButton} disabled={saving}>
                      {saving ? "Saving…" : "Update password"}
                    </button>
                    <button type="button" className={styles.ghostButton} onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

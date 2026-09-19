"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  API_ORIGIN,
  PROFESSIONAL_KINDS,
  type ApiResult,
  type Category,
  type ProfessionalApplication,
} from "@/lib/api";
import styles from "./apply.module.css";

/**
 * The first step, and the only one a client can reach.
 *
 * Kept deliberately short. Everything that needs care — registration numbers, bank
 * details — comes after, on a page where the applicant can see what is still
 * outstanding. Asking for a PAN before somebody has decided to apply loses people who
 * would have finished.
 */
export function ApplicationForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<string>(PROFESSIONAL_KINDS[0].value);
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [city, setCity] = useState("");
  const [chosen, setChosen] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(slug: string) {
    setChosen((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
    );
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${API_ORIGIN}/pro/apply`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          kind,
          displayName,
          ...(headline.trim() ? { headline } : {}),
          ...(city.trim() ? { city } : {}),
          categories: chosen,
        }),
      });
      const result = (await response.json()) as ApiResult<ProfessionalApplication>;

      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push("/pro/application");
      router.refresh();
    } catch {
      setError("Could not reach Lawxygen. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const ready = displayName.trim().length >= 2 && chosen.length > 0;

  return (
    <div className={styles.form}>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <label className={styles.field}>
        <span className={styles.label}>You are a</span>
        <select className={styles.input} value={kind} onChange={(e) => setKind(e.target.value)}>
          {PROFESSIONAL_KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Name clients will see</span>
        <input
          className={styles.input}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Meera Iyer, FCA"
          maxLength={120}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>
          What you do <span className={styles.optional}>optional</span>
        </span>
        <input
          className={styles.input}
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="GST, annual compliance and audit support"
          maxLength={160}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>
          City <span className={styles.optional}>optional</span>
        </span>
        <input
          className={styles.input}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          maxLength={80}
        />
      </label>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>Work you can take</legend>
        {/* This is the eligibility query, in the applicant's words: a matter is only
            ever offered to somebody qualified in its category. */}
        <p className={styles.help}>
          You will only ever be offered matters in the categories you pick. You can change this
          later.
        </p>
        <div className={styles.checks}>
          {categories.map((category) => (
            <label key={category.slug} className={styles.check}>
              <input
                type="checkbox"
                checked={chosen.includes(category.slug)}
                onChange={() => {
                  toggle(category.slug);
                }}
              />
              <span>{category.label}</span>
              <span className={styles.count}>{category.serviceCount}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        className={styles.primary}
        onClick={() => void submit()}
        disabled={busy || !ready}
      >
        {busy ? "Creating your application…" : "Start my application"}
      </button>
      <p className={styles.help}>
        Nothing is submitted for review yet. You will add your registration number and payout
        details next, and send it when you are ready.
      </p>
    </div>
  );
}

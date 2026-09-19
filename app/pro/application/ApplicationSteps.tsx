"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, type ApiResult, type ProfessionalApplication } from "@/lib/api";
import styles from "../pro.module.css";

/**
 * Everything after applying: registration numbers, bank details, and sending it in.
 *
 * One client component rather than three, because each action re-reads the whole
 * application from the server afterwards — the readiness checklist and `submittable`
 * are computed there, and recomputing them here would be two implementations of the
 * same rule that can disagree.
 */

async function post<T>(
  path: string,
  body: unknown,
  method: "POST" | "PUT" | "DELETE" = "POST",
): Promise<ApiResult<T>> {
  const response = await fetch(`${API_ORIGIN}${path}`, {
    method,
    headers: { "content-type": "application/json" },
    credentials: "include",
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return (await response.json()) as ApiResult<T>;
}

export function ApplicationSteps({ application }: { application: ProfessionalApplication }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editable = application.status === "draft" || application.status === "rejected";

  // Credential fields
  const [body, setBody] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  // Payout fields. Never pre-filled from the server, because the server does not send
  // them back — an existing identity shows as a masked summary instead.
  const [pan, setPan] = useState("");
  const [gstin, setGstin] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountHolderName, setAccountHolderName] = useState(application.displayName);

  async function run(work: () => Promise<ApiResult<unknown>>) {
    setBusy(true);
    setError(null);
    try {
      const result = await work();
      if (!result.ok) {
        setError(result.message);
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Could not reach Lawxygen. Check your connection and try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      {/* ---------------------------------------------------------- credentials */}

      <section className={styles.panel}>
        <h2 className={styles.sectionTitle}>Registration</h2>
        <p className={styles.help}>
          We check this against the public register — ICAI, ICSI or your Bar Council — so it has to
          match your entry there exactly. No documents to upload.
        </p>

        {application.credentials.length > 0 && (
          <ul className={styles.rows}>
            {application.credentials.map((credential) => (
              <li key={credential.id} className={styles.row}>
                <div>
                  <strong>{credential.body}</strong> · {credential.registrationNumber}
                  <span className={styles.rowStatus}>{credential.status}</span>
                  {credential.reviewNote && (
                    <div className={styles.rowError}>{credential.reviewNote}</div>
                  )}
                </div>
                {editable && (
                  <button
                    type="button"
                    className={styles.secondary}
                    disabled={busy}
                    onClick={() =>
                      void run(() =>
                        post(`/pro/application/credentials/${credential.id}`, undefined, "DELETE"),
                      )
                    }
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {editable && (
          <div className={styles.inline}>
            <input
              className={styles.input}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="ICAI, ICSI, or Bar Council of Maharashtra"
              aria-label="Issuing body"
              maxLength={80}
            />
            <input
              className={styles.input}
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="Membership or enrolment number"
              aria-label="Registration number"
              maxLength={40}
            />
            <button
              type="button"
              className={styles.secondary}
              disabled={busy || body.trim().length < 2 || registrationNumber.trim().length < 3}
              onClick={() =>
                void run(async () => {
                  const result = await post("/pro/application/credentials", {
                    body,
                    registrationNumber,
                  });
                  if (result.ok) {
                    setBody("");
                    setRegistrationNumber("");
                  }
                  return result;
                })
              }
            >
              Add
            </button>
          </div>
        )}
      </section>

      {/* -------------------------------------------------------------- payouts */}

      <section className={styles.panel}>
        <h2 className={styles.sectionTitle}>Getting paid</h2>

        {application.payout ? (
          <div className={styles.summary}>
            <div>
              <span className={styles.label}>Account</span>
              ••••{application.payout.accountLast4} · {application.payout.ifsc}
            </div>
            <div>
              <span className={styles.label}>Name on the account</span>
              {application.payout.accountHolderName}
            </div>
            <div>
              <span className={styles.label}>PAN</span>
              {application.payout.panMasked}
            </div>
            <div>
              <span className={styles.label}>GSTIN</span>
              {application.payout.gstinSet ? "On file" : "Not provided"}
            </div>
            <p className={styles.help}>
              {/* Said plainly: these never come back out, even to them. */}
              Your PAN and account number are encrypted and are never shown again, here or to our
              staff. Re-enter them below to change them.
            </p>
          </div>
        ) : (
          <p className={styles.help}>
            Tax is withheld at source before you are paid, so we need a PAN. Without these you can
            be verified but not paid.
          </p>
        )}

        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.label}>PAN</span>
            <input
              className={styles.input}
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength={10}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>
              GSTIN <span className={styles.optional}>optional</span>
            </span>
            <input
              className={styles.input}
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="27ABCDE1234F1Z5"
              maxLength={15}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Account number</span>
            <input
              className={styles.input}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              maxLength={20}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>IFSC</span>
            <input
              className={styles.input}
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              placeholder="HDFC0001234"
              maxLength={11}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Name on the account</span>
            <input
              className={styles.input}
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              maxLength={120}
            />
          </label>
        </div>

        <button
          type="button"
          className={styles.secondary}
          disabled={
            busy ||
            pan.length !== 10 ||
            accountNumber.length < 6 ||
            ifsc.length !== 11 ||
            accountHolderName.trim().length < 2
          }
          onClick={() =>
            void run(async () => {
              const result = await post(
                "/pro/application/payout-identity",
                {
                  pan,
                  ...(gstin ? { gstin } : {}),
                  accountNumber,
                  ifsc,
                  accountHolderName,
                },
                "PUT",
              );
              if (result.ok) {
                setPan("");
                setGstin("");
                setAccountNumber("");
                setIfsc("");
              }
              return result;
            })
          }
        >
          {application.payout ? "Replace these details" : "Save payout details"}
        </button>
      </section>

      {/* --------------------------------------------------------------- submit */}

      {application.status === "pending_review" ? (
        <div className={styles.panel}>
          <h2 className={styles.sectionTitle}>With us for review</h2>
          <p className={styles.help}>
            We are checking your registration against the public register. Withdraw it if you need
            to change something.
          </p>
          <button
            type="button"
            className={styles.secondary}
            disabled={busy}
            onClick={() => void run(() => post("/pro/application/withdraw", undefined))}
          >
            Withdraw and edit
          </button>
        </div>
      ) : (
        editable && (
          <div className={styles.panel}>
            <button
              type="button"
              className={styles.primary}
              disabled={busy || !application.submittable}
              onClick={() => void run(() => post("/pro/application/submit", undefined))}
            >
              {application.status === "rejected" ? "Resubmit for review" : "Send for review"}
            </button>
            {!application.submittable && (
              <p className={styles.help}>Finish the outstanding items above first.</p>
            )}
          </div>
        )
      )}
    </>
  );
}

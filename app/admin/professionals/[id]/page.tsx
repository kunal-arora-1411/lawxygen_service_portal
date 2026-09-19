import Link from "next/link";
import { api, type ProfessionalApplication } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import { ProfessionalActions } from "../ProfessionalActions";
import styles from "../../admin.module.css";

/**
 * Reviewing one application.
 *
 * The decision being made here is narrow: does this registration number belong to this
 * person on the public register. Everything on the page serves that, and the payout
 * details appear only as presence and last four digits — nobody reviewing an
 * application needs an account number, and field encryption exists so that not even
 * this screen can show one.
 */

export const dynamic = "force-dynamic";

const REGISTER_HINT: Record<string, string> = {
  chartered_accountant: "Check against the ICAI member search.",
  company_secretary: "Check against the ICSI member directory.",
  advocate: "Check against the relevant State Bar Council roll.",
};

export default async function AdminProfessionalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await api.call<ProfessionalApplication>(`/admin/professionals/${id}`, {
    cookie: await forwardedCookie(),
  });

  if (!result.ok) {
    return (
      <div className={styles.empty}>
        <strong>That application could not be loaded.</strong>
        {result.message}
      </div>
    );
  }

  const a = result.data;

  return (
    <>
      <Link href="/admin/professionals" className={styles.ghost}>
        ← All professionals
      </Link>

      <h1 className={styles.title}>{a.displayName}</h1>
      <p className={styles.sub}>
        {a.headline ?? "No description given"}
        {a.city ? ` · ${a.city}` : ""}
      </p>

      <div className={styles.more}>
        <ProfessionalActions
          professional={{ id: a.id, displayName: a.displayName, status: a.status }}
        />
      </div>

      <h2 className={styles.sectionTitle}>Registration</h2>
      <p className={styles.sub}>{REGISTER_HINT[a.kind]}</p>

      <div className={styles.tableWrap}>
        {a.credentials.length === 0 ? (
          <div className={styles.empty}>No registration submitted.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Body</th>
                <th>Number</th>
                <th>Status</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {a.credentials.map((c) => (
                <tr key={c.id}>
                  <td className={styles.serviceName}>{c.body}</td>
                  <td className={styles.numeric}>{c.registrationNumber}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        c.status === "verified"
                          ? styles.live
                          : c.status === "rejected"
                            ? styles.alert
                            : styles.pending
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className={styles.muted}>{c.reviewNote ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className={styles.sectionTitle} style={{ marginTop: 28 }}>
        Assignment
      </h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.serviceName}>Status</td>
              <td>
                <span
                  className={`${styles.badge} ${
                    a.status === "verified"
                      ? styles.live
                      : a.status === "pending_review"
                        ? styles.pending
                        : a.status === "draft"
                          ? styles.draft
                          : styles.alert
                  }`}
                >
                  {a.status.replace(/_/g, " ")}
                </span>
              </td>
            </tr>
            <tr>
              <td className={styles.serviceName}>Available</td>
              {/* Theirs to set, not ours — separate from status on purpose. */}
              <td className={styles.muted}>{a.available ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className={styles.serviceName}>Matters at once</td>
              <td className={styles.numeric}>{a.concurrentCapacity}</td>
            </tr>
            <tr>
              <td className={styles.serviceName}>Categories</td>
              <td className={styles.muted}>
                {a.categories.length > 0
                  ? a.categories.map((c) => c.label).join(", ")
                  : "None — cannot be assigned anything"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className={styles.sectionTitle} style={{ marginTop: 28 }}>
        Payout details
      </h2>
      <div className={styles.tableWrap}>
        {a.payout ? (
          <table className={styles.table}>
            <tbody>
              <tr>
                <td className={styles.serviceName}>Account</td>
                <td className={styles.numeric}>
                  ••••{a.payout.accountLast4} · {a.payout.ifsc}
                </td>
              </tr>
              <tr>
                <td className={styles.serviceName}>Name on the account</td>
                <td className={styles.muted}>{a.payout.accountHolderName}</td>
              </tr>
              <tr>
                <td className={styles.serviceName}>PAN</td>
                <td className={styles.numeric}>{a.payout.panMasked}</td>
              </tr>
              <tr>
                <td className={styles.serviceName}>GSTIN</td>
                <td className={styles.muted}>{a.payout.gstinSet ? "On file" : "Not provided"}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className={styles.empty}>
            No payout details. They can be verified, but they cannot be paid — and the eligibility
            query excludes them until this exists.
          </div>
        )}
      </div>
    </>
  );
}

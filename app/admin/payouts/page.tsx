import { api, formatPrice, type PayableBalance, type PayoutBatch } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import { DraftBatchButton, ReleaseButton } from "./PayoutActions";
import styles from "../admin.module.css";

/**
 * Paying professionals.
 *
 * Two lists: who is owed right now, and the batches already drafted or released.
 * Drafting snapshots the first into a batch; releasing sends the money.
 */

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const cookie = await forwardedCookie();

  const [payableResult, batchesResult] = await Promise.all([
    api.call<PayableBalance[]>("/admin/payouts/payable", { cookie }),
    api.call<PayoutBatch[]>("/admin/payouts", { cookie }),
  ]);

  const payable = payableResult.ok ? payableResult.data : [];
  const batches = batchesResult.ok ? batchesResult.data : [];
  const outstanding = payable.reduce((sum, p) => sum + p.amountPaise, 0);
  const draft = batches.find((b) => b.status === "draft");

  return (
    <>
      <h1 className={styles.title}>Payouts</h1>
      <p className={styles.sub}>
        Amounts are already net of withholding — TDS is deducted at capture, not here. Drafting
        snapshots what is owed; releasing sends it.
      </p>

      {/* Not configured is the normal state until the account exists, and a deployed
          environment refuses to transfer rather than pretending. Worth saying here. */}
      <div className={styles.banner}>
        <strong>Transfers are not wired up.</strong>
        RazorpayX needs a business account that does not exist yet. Locally a release is simulated
        and logged; in any other environment it refuses rather than marking payouts paid with no
        money moving.
      </div>

      <h2 className={styles.sectionTitle}>Owed right now</h2>

      {payable.length === 0 ? (
        <div className={styles.empty}>
          Nobody is owed enough to pay out. A professional appears here once a matter they hold has
          been paid for and they have a payout identity on file.
        </div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Professional</th>
                  <th>Account</th>
                  <th>TDS withheld</th>
                  <th>To pay</th>
                </tr>
              </thead>
              <tbody>
                {payable.map((row) => (
                  <tr key={row.professionalId}>
                    <td className={styles.serviceName}>{row.displayName}</td>
                    {/* Last four only — the number itself is encrypted at rest and
                        never needs decrypting to identify an account. */}
                    <td className={styles.muted}>••••{row.accountLast4}</td>
                    <td className={styles.numeric}>{formatPrice(row.tdsPaise)}</td>
                    <td className={styles.numeric}>
                      <strong>{formatPrice(row.amountPaise)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.more}>
            {draft ? (
              <span className={styles.muted}>
                Batch {draft.reference} is already drafted. Release or cancel it first.
              </span>
            ) : (
              <DraftBatchButton total={outstanding} count={payable.length} />
            )}
          </div>
        </>
      )}

      <h2 className={styles.sectionTitle} style={{ marginTop: 32 }}>
        Batches
      </h2>

      <div className={styles.tableWrap}>
        {batches.length === 0 ? (
          <div className={styles.empty}>No batches yet.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Professionals</th>
                <th>Total</th>
                <th>Status</th>
                <th>Released</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.reference}>
                  <td className={styles.numeric}>{batch.reference}</td>
                  <td className={styles.numeric}>{batch.payoutCount}</td>
                  <td className={styles.numeric}>{formatPrice(batch.totalPaise)}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        batch.status === "released"
                          ? styles.live
                          : batch.status === "draft"
                            ? styles.pending
                            : styles.draft
                      }`}
                    >
                      {batch.status}
                    </span>
                  </td>
                  <td className={styles.muted}>
                    {batch.releasedAt
                      ? new Date(batch.releasedAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td>
                    {batch.status === "draft" && (
                      <ReleaseButton
                        reference={batch.reference}
                        total={batch.totalPaise}
                        count={batch.payoutCount}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

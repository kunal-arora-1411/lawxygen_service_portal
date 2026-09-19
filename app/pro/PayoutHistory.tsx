import { formatPrice, type PayoutHistoryRow } from "@/lib/api";
import styles from "./pro.module.css";

/**
 * What has been paid, and what was withheld from it.
 *
 * The withholding section is shown per row rather than as a single figure at the top,
 * because the rate and even the governing section can change — each payout records
 * what was applied at the time, and that is what a TDS certificate has to reflect.
 */
export function PayoutHistory({ payouts }: { payouts: PayoutHistoryRow[] }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Payouts</h2>
      <div className={styles.payouts}>
        {payouts.length === 0 ? (
          <div className={styles.payoutEmpty}>
            No payouts yet. Earnings are settled in batches; what you are owed shows above.
          </div>
        ) : (
          <table className={styles.payoutTable}>
            <thead>
              <tr>
                <th>Batch</th>
                <th>Paid</th>
                <th>Amount</th>
                <th>TDS withheld</th>
                <th>To account</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.reference + payout.createdAt}>
                  <td className={styles.num}>{payout.reference}</td>
                  <td className={styles.dim}>
                    {payout.paidAt
                      ? new Date(payout.paidAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className={styles.num}>
                    <strong>{formatPrice(payout.amountPaise)}</strong>
                  </td>
                  <td className={styles.num}>
                    {formatPrice(payout.tdsPaise)}
                    {payout.tdsSection && (
                      <span className={styles.dim}> &middot; &sect;{payout.tdsSection}</span>
                    )}
                  </td>
                  <td className={styles.dim}>
                    {payout.accountLast4 ? `••••${payout.accountLast4}` : "—"}
                  </td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        payout.status === "paid"
                          ? styles.toneDone
                          : payout.status === "failed"
                            ? styles.toneNew
                            : styles.toneActive
                      }`}
                    >
                      {payout.status}
                    </span>
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

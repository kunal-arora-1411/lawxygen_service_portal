import { api, formatPrice, type ReconciliationException, type ReconciliationRun } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import { RunButton } from "./RunButton";
import styles from "../admin.module.css";

/**
 * Has the gateway told us everything?
 *
 * Every other safeguard in the payment path protects against a webhook that arrived
 * and was mishandled. This screen is about the one that never arrived at all — the
 * client is charged, the order sits unpaid, nobody is assigned, and from inside the
 * system that is indistinguishable from a quiet afternoon.
 */

export const dynamic = "force-dynamic";

/** Said as a sentence, because "unknown_order" is not a thing an admin should decode. */
function describe(exception: ReconciliationException): string {
  const id = String(exception.providerPaymentId ?? "");
  switch (exception.kind) {
    case "missing_capture":
      return exception.repaired === true
        ? `${id} was captured but never reached us. Applied — the order is paid, invoiced and in the assignment queue.`
        : `${id} was captured but never reached us, and could not be applied. Needs a look.`;
    case "unknown_order":
      return `${id} is a payment against a gateway order this system did not create. Nothing to attach it to.`;
    case "amount_mismatch":
      return `${id}: the gateway says ${formatPrice(Number(exception.gatewayPaise))}, we recorded ${formatPrice(
        Number(exception.recordedPaise),
      )}. Left alone deliberately — one of the two is wrong.`;
    case "refund_not_recorded":
      return `${id} was refunded at the gateway, not through here. ${formatPrice(
        Number(exception.refundedPaise),
      )} is missing from the ledger.`;
    case "unknown_to_gateway":
      return `${id} is captured here but the gateway does not report it. This one is serious.`;
    case "ledger_imbalance":
      return `The ledger is out by ${formatPrice(Math.abs(Number(exception.imbalancePaise)))}. Debits and credits should never disagree.`;
    default:
      return exception.kind;
  }
}

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminReconciliationPage() {
  const result = await api.call<ReconciliationRun[]>("/admin/reconciliation", {
    cookie: await forwardedCookie(),
  });
  const runs = result.ok ? result.data : [];
  const latest = runs[0];

  return (
    <>
      <h1 className={styles.title}>Reconciliation</h1>
      <p className={styles.sub}>
        Asks Razorpay what it thinks happened and compares. A capture we missed is applied
        automatically; anything where the two sides disagree about an amount is recorded and left
        for a person.
      </p>

      <div className={styles.banner}>
        <strong>Runs every six hours over a 48-hour window.</strong>
        The overlap is free, because repairs go through the same idempotent path a webhook takes.
        Until the gateway account exists, every run will record itself as failed — which is the
        honest state of affairs, not a bug.
      </div>

      <RunButton />

      {latest && latest.status === "failed" && (
        <div className={styles.empty} style={{ marginTop: 20 }}>
          <strong>The last run did not complete.</strong>
          <div className={styles.muted}>{latest.failureReason}</div>
        </div>
      )}

      <h2 className={styles.sectionTitle} style={{ marginTop: 28 }}>
        Needs attention
      </h2>

      {!latest || latest.exceptions.length === 0 ? (
        <div className={styles.empty}>
          {latest
            ? "Nothing outstanding from the last run."
            : "No run yet. The first scheduled one lands within six hours."}
        </div>
      ) : (
        <ul className={styles.list}>
          {latest.exceptions.map((exception, index) => (
            <li key={`${exception.kind}-${String(index)}`} className={styles.listItem}>
              {describe(exception)}
            </li>
          ))}
        </ul>
      )}

      <h2 className={styles.sectionTitle} style={{ marginTop: 32 }}>
        Runs
      </h2>

      <div className={styles.tableWrap}>
        {runs.length === 0 ? (
          <div className={styles.empty}>No runs recorded.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>When</th>
                <th>Window</th>
                <th>At the gateway</th>
                <th>Matched</th>
                <th>Repaired</th>
                <th>Exceptions</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id}>
                  <td className={styles.muted}>{when(run.startedAt)}</td>
                  <td className={styles.muted}>
                    {when(run.windowStart)} → {when(run.windowEnd)}
                  </td>
                  <td className={styles.numeric}>{run.gatewayCount}</td>
                  <td className={styles.numeric}>{run.matchedCount}</td>
                  <td className={styles.numeric}>{run.repairedCount}</td>
                  <td className={styles.numeric}>{run.exceptions.length}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        run.status === "clean"
                          ? styles.live
                          : run.status === "failed"
                            ? styles.alert
                            : styles.pending
                      }`}
                    >
                      {run.status}
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

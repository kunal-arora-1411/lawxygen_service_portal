import Link from "next/link";
import { api, formatPrice, type AdminOrder, type Page } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import { ReassignButton } from "./ReassignButton";
import { RefundButton } from "./RefundButton";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

/**
 * Admin sees the real status, not the client-facing label.
 *
 * The client is shown "Matching you with a professional" for every unstaffed state on
 * purpose. Operations needs the opposite: `awaiting_assignment` and
 * `assignment_escalated` mean different things and call for different action.
 */
const NEEDS_ATTENTION = new Set(["awaiting_assignment", "assignment_escalated"]);

/** Mirrors the backend's list. An order outside it has nothing to give back. */
const REFUNDABLE = new Set([
  "paid",
  "awaiting_assignment",
  "assigned",
  "assignment_escalated",
  "in_progress",
  "awaiting_client",
  "completed",
  "cancelled",
]);

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; cursor?: string }>;
}) {
  const { status, cursor } = await searchParams;

  const query = new URLSearchParams({ limit: "40" });
  if (status) query.set("status", status);
  if (cursor) query.set("cursor", cursor);

  const result = await api.call<Page<AdminOrder>>(`/admin/orders?${query.toString()}`, {
    cookie: await forwardedCookie(),
  });

  const orders = result.ok ? result.data.items : [];
  const nextCursor = result.ok ? result.data.nextCursor : null;

  return (
    <>
      <h1 className={styles.title}>Orders</h1>
      <p className={styles.sub}>Internal status, not the label the client sees.</p>

      <form className={styles.controls} action="/admin/orders" method="get">
        <select
          className={styles.select}
          name="status"
          defaultValue={status ?? ""}
          aria-label="Status"
        >
          <option value="">All statuses</option>
          <option value="awaiting_assignment">Awaiting a professional</option>
          <option value="assignment_escalated">Escalated</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In progress</option>
          <option value="payment_pending">Payment pending</option>
          <option value="payment_failed">Payment failed</option>
          <option value="completed">Completed</option>
          <option value="refunded">Refunded</option>
        </select>
        <button type="submit" className={styles.button}>
          Filter
        </button>
      </form>

      <div className={styles.tableWrap}>
        {orders.length === 0 ? (
          <div className={styles.empty}>No orders{status ? " with that status" : " yet"}.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Service</th>
                <th>Client</th>
                <th>Professional</th>
                <th>Value</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.reference}>
                  <td className={styles.numeric}>{order.reference}</td>
                  <td>
                    <div className={styles.serviceName}>{order.serviceTitle}</div>
                    <div className={styles.serviceMeta}>{order.categorySlug}</div>
                  </td>
                  <td>
                    <div>{order.clientName ?? "—"}</div>
                    <div className={styles.serviceMeta}>{order.clientEmail}</div>
                  </td>
                  <td className={order.professionalName ? undefined : styles.muted}>
                    {order.professionalName ?? "Unassigned"}
                    {order.acknowledgeOverdue && (
                      <div className={styles.rowError}>Acknowledgement overdue</div>
                    )}
                  </td>
                  <td className={styles.numeric}>
                    {formatPrice(order.pricePaise, order.currency)}
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        NEEDS_ATTENTION.has(order.status) ? styles.alert : styles.active
                      }`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td>
                    {order.professionalName && <ReassignButton reference={order.reference} />}
                    {REFUNDABLE.has(order.status) && (
                      <RefundButton
                        reference={order.reference}
                        pricePaise={order.pricePaise}
                        currency={order.currency}
                        professionalName={order.professionalName}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {nextCursor && (
        <div className={styles.more}>
          <Link
            href={`/admin/orders?${new URLSearchParams({
              ...(status ? { status } : {}),
              cursor: nextCursor,
            }).toString()}`}
            className={styles.ghost}
          >
            Show more
          </Link>
        </div>
      )}
    </>
  );
}

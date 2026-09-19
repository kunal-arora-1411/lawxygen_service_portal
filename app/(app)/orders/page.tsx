import Link from "next/link";
import { api, formatPrice, ORDER_LABELS, orderTone, type Order, type Page } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const result = await api.call<Page<Order>>("/orders?limit=50", {
    cookie: await forwardedCookie(),
  });
  const orders = result.ok ? result.data.items : [];

  return (
    <>
      <h1 className={styles.title}>My orders</h1>
      <p className={styles.sub}>Every service you have started, newest first.</p>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <strong>No orders yet.</strong>
          When you buy a service it appears here, and you can follow it from payment through to
          completion.
          <div>
            <Link href="/services" className={styles.browse}>
              Browse services
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => {
            const retryable =
              order.status === "payment_pending" || order.status === "payment_failed";

            return (
              <div key={order.reference} className={styles.row}>
                <div className={styles.main}>
                  <p className={styles.name}>{order.serviceTitle}</p>
                  <div className={styles.meta}>
                    <span className={styles.reference}>{order.reference}</span>
                    {" · "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <span className={styles.price}>
                  {formatPrice(order.pricePaise, order.currency)}
                </span>

                {/*
                  The label, not the status. `payment_failed` reads as "Payment pending"
                  and every unstaffed state reads as "Matching you with a professional" —
                  the platform's internal difficulty is not the client's to interpret.
                */}
                <span className={`${styles.status} ${styles[orderTone(order.status)]}`}>
                  {ORDER_LABELS[order.status]}
                </span>

                {retryable && (
                  <Link href={`/checkout?order=${order.reference}`} className={styles.pay}>
                    Pay now
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

import Link from "next/link";
import { api, formatPrice, type Order, type Service } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import { PayButton } from "./PayButton";
import styles from "./page.module.css";

/**
 * Checkout for one service.
 *
 * Reached two ways: a fresh purchase carrying `category` and `service` — which is also
 * the shape of the deep link from the marketing site — or `order` to resume one that
 * was left unpaid.
 *
 * **Both** category and service are required for a fresh purchase. 22 slugs exist in
 * two categories at once, always a filing that is also a consultation, so the slug
 * alone would be ambiguous about which product is being bought.
 */

export const dynamic = "force-dynamic";

type Search = { category?: string; service?: string; order?: string };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { category, service, order } = await searchParams;
  const cookie = await forwardedCookie();

  if (order) {
    const result = await api.call<Order>(`/orders/${order}`, { cookie });
    if (!result.ok) return <NotAvailable message="That order could not be found." />;
    return <Checkout order={result.data} />;
  }

  if (!category || !service) {
    return <NotAvailable message="No service was selected." />;
  }

  const result = await api.call<Service>(`/catalogue/services/${category}/${service}`, { cookie });
  if (!result.ok) {
    return <NotAvailable message="That service is not available to buy right now." />;
  }

  return <Checkout service={result.data} />;
}

function Checkout({ service, order }: { service?: Service; order?: Order }) {
  const title = service?.title ?? order?.serviceTitle ?? "";
  const price = service?.pricePaise ?? order?.pricePaise ?? 0;
  const currency = service?.currency ?? order?.currency ?? "INR";
  const turnaround = service?.turnaroundDays ?? order?.turnaroundDays ?? null;
  const consultation = (service?.fulfilmentType ?? order?.fulfilmentType) === "consultation";

  return (
    <div className={styles.wrap}>
      <Link href="/services" className={styles.back}>
        ← Back to services
      </Link>

      <div className={styles.card}>
        <div className={styles.badges}>
          {service && <span className={styles.badge}>{service.categoryLabel}</span>}
          {order && <span className={styles.badge}>{order.reference}</span>}
          {consultation && (
            <span className={`${styles.badge} ${styles.consultation}`}>Consultation</span>
          )}
        </div>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.summary}>
          {service?.summary ??
            (consultation
              ? "Time with a qualified professional, assigned as soon as you pay."
              : "Handled end to end by a qualified professional, assigned as soon as you pay.")}
        </p>

        <div className={styles.lines}>
          <div className={styles.line}>
            <span className={styles.lineLabel}>Service</span>
            <span>{formatPrice(price, currency)}</span>
          </div>
          {turnaround !== null && (
            <div className={styles.line}>
              <span className={styles.lineLabel}>Expected turnaround</span>
              <span>
                about {turnaround} day{turnaround === 1 ? "" : "s"}
              </span>
            </div>
          )}
          <div className={`${styles.line} ${styles.total}`}>
            <span>Total</span>
            <span>{formatPrice(price, currency)}</span>
          </div>
          {/* Prices are GST-inclusive, per Indian consumer convention — the invoice
              breaks the tax out, so saying so here avoids a surprise at that point. */}
          <div className={styles.gstNote}>
            Inclusive of GST. A tax invoice is issued on payment.
          </div>
        </div>

        <PayButton
          category={service?.categorySlug}
          service={service?.slug}
          existingReference={order?.reference}
        />
      </div>
    </div>
  );
}

function NotAvailable({ message }: { message: string }) {
  return (
    <div className={styles.missing}>
      <strong>{message}</strong>
      <Link href="/services">Browse all services</Link>
    </div>
  );
}

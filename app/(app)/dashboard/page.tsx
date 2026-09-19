import Link from "next/link";
import { FeaturedRow } from "@/components/FeaturedRow";
import { ServiceRow } from "@/components/ServiceRow";
import { api, type Order, type Page, type Service } from "@/lib/api";
import { currentUser, forwardedCookie } from "@/lib/session";
import styles from "./page.module.css";

/**
 * The client home.
 *
 * Greeting, then the three rows: what you have used before, what is new, and what you
 * might need. Everything is fetched server-side in one pass — a dashboard that renders
 * four spinners and fills in over a second is worse than one that arrives whole.
 */

export const dynamic = "force-dynamic";

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** IST, not the server's zone — the audience is in India and the server may not be. */
function istHour(): number {
  const now = new Date();
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }).format(now),
  );
}

export default async function DashboardPage() {
  const cookie = await forwardedCookie();
  const user = await currentUser();

  const [ordersResult, featuredResult, popularResult] = await Promise.all([
    api.call<Page<Order>>("/orders?limit=12", { cookie }),
    api.call<Page<Service>>("/catalogue/services?featured=true&limit=6", { cookie }),
    api.call<Page<Service>>("/catalogue/services?limit=12", { cookie }),
  ]);

  const orders = ordersResult.ok ? ordersResult.data.items : [];
  const featured = featuredResult.ok ? featuredResult.data.items : [];
  const popular = popularResult.ok ? popularResult.data.items : [];

  // "Previously used" is derived from paid orders, most recent first, de-duplicated —
  // buying the same service twice should not fill the row with one entry.
  const seen = new Set<string>();
  const previous: Service[] = [];
  for (const order of orders) {
    const key = `${order.categorySlug}/${order.serviceSlug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const match = popular.find(
      (s) => s.slug === order.serviceSlug && s.categorySlug === order.categorySlug,
    );
    if (match) previous.push(match);
  }

  /**
   * "Services you might need" is a curated pairing map in the plan — company
   * registration leads to GST registration leads to annual compliance. That map is
   * admin-owned data and does not exist yet, so this falls back to the rest of the
   * catalogue rather than inventing a recommendation it cannot justify.
   */
  const suggestions = popular.filter((s) => !seen.has(`${s.categorySlug}/${s.slug}`)).slice(0, 8);

  const active = orders.filter(
    (o) => !["completed", "cancelled", "refunded"].includes(o.status),
  ).length;
  const awaitingPayment = orders.filter(
    (o) => o.status === "payment_pending" || o.status === "payment_failed",
  ).length;

  const nothingPriced = popular.length === 0 && featured.length === 0;

  return (
    <>
      <h1 className={styles.greeting}>
        {greetingFor(istHour())}
        {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </h1>
      <p className={styles.greetingSub}>
        {orders.length === 0
          ? "Pick a service to get started — a qualified professional is assigned as soon as you pay."
          : "Here is where your matters stand."}
      </p>

      {orders.length > 0 && (
        <div className={styles.tiles}>
          <div className={styles.tile}>
            <div className={styles.tileValue}>{active}</div>
            <div className={styles.tileLabel}>Active matters</div>
          </div>
          <div className={styles.tile}>
            <div className={styles.tileValue}>{awaitingPayment}</div>
            <div className={styles.tileLabel}>Awaiting payment</div>
          </div>
          <div className={styles.tile}>
            <div className={styles.tileValue}>{orders.length}</div>
            <div className={styles.tileLabel}>Total orders</div>
          </div>
        </div>
      )}

      {nothingPriced && (
        <div className={styles.notice}>
          <strong>No services are on sale yet.</strong>
          The catalogue is loaded but nothing has been priced, so there is nothing to buy. An
          administrator needs to set prices before this page has anything to show.
        </div>
      )}

      <ServiceRow
        title="Previously used services"
        seeAllHref="/orders"
        services={previous}
        empty={
          <>
            <strong>Nothing here yet.</strong>
            Once you have bought a service it will appear here for quick reordering. In the
            meantime, <Link href="/services">browse all services</Link>.
          </>
        }
      />

      <FeaturedRow services={featured} />

      <ServiceRow
        title="Services you might need"
        subtitle="Based on what other businesses at your stage commonly file."
        seeAllHref="/services"
        services={suggestions}
        empty={
          <>
            <strong>Nothing to suggest yet.</strong>
            Suggestions appear once the catalogue has priced services.
          </>
        }
      />
    </>
  );
}

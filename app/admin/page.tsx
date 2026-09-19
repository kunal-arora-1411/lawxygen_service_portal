import Link from "next/link";
import { api, formatPrice, type AdminOverview } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const result = await api.call<AdminOverview>("/admin/overview", {
    cookie: await forwardedCookie(),
  });

  if (!result.ok) {
    return <p className={styles.sub}>Could not load the overview: {result.message}</p>;
  }

  const { orders, revenuePaise, professionals, catalogue, queue } = result.data;

  return (
    <>
      <h1 className={styles.title}>Overview</h1>
      <p className={styles.sub}>How the marketplace is running right now.</p>

      {/*
        The two states that stop the platform working at all, surfaced first. A
        marketplace with nothing priced has nothing to sell; one with no available
        professional parks every order it takes.
      */}
      {catalogue.live === 0 && (
        <div className={styles.banner}>
          <strong>Nothing is on sale.</strong>
          All {catalogue.total} services are loaded but none is priced, so clients cannot buy
          anything. <Link href="/admin/services">Price the catalogue</Link>.
        </div>
      )}

      {catalogue.live > 0 && professionals.available === 0 && (
        <div className={styles.banner}>
          <strong>No professional is available.</strong>
          Services are on sale, but every order paid for now will park in the queue until someone
          qualified is verified and available.{" "}
          <Link href="/admin/professionals">Review professionals</Link>.
        </div>
      )}

      <h2 className={styles.sectionTitle}>Orders</h2>
      <div className={styles.tiles}>
        <Tile value={orders.today} label="Today" />
        <Tile value={orders.total} label="All time" />
        <Tile value={queue.awaiting} label="Awaiting a professional" warn={queue.awaiting > 0} />
        <Tile value={queue.escalated} label="Escalated" warn={queue.escalated > 0} />
      </div>

      <h2 className={styles.sectionTitle}>Revenue</h2>
      <div className={styles.tiles}>
        <Tile value={formatPrice(revenuePaise.today)} label="Today" />
        <Tile value={formatPrice(revenuePaise.allTime)} label="All time" />
      </div>
      <p className={styles.sub}>
        Counts orders that were actually paid for, not orders created — an abandoned checkout is not
        income.
      </p>

      <h2 className={styles.sectionTitle}>Supply</h2>
      <div className={styles.tiles}>
        <Tile value={professionals.available} label="Available now" />
        <Tile value={professionals.verified} label="Verified" />
        <Tile
          value={professionals.pendingReview}
          label="Awaiting review"
          warn={professionals.pendingReview > 0}
        />
      </div>

      <h2 className={styles.sectionTitle}>Catalogue</h2>
      <div className={styles.tiles}>
        <Tile value={catalogue.live} label="On sale" />
        <Tile value={catalogue.priced} label="Priced" />
        <Tile value={catalogue.total} label="Total services" />
        <Tile value={catalogue.featured} label="In “New in Lawxygen”" />
      </div>
    </>
  );
}

function Tile({ value, label, warn }: { value: number | string; label: string; warn?: boolean }) {
  return (
    <div className={`${styles.tile} ${warn ? styles.warn : ""}`}>
      <div className={styles.tileValue}>{value}</div>
      <div className={styles.tileLabel}>{label}</div>
    </div>
  );
}

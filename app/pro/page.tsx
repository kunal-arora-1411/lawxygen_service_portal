import {
  api,
  formatPrice,
  isOpenMatter,
  type Earnings,
  type Matter,
  type ProLoad,
} from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import { AvailabilityToggle } from "./AvailabilityToggle";
import { MatterCard } from "./MatterCard";
import styles from "./pro.module.css";

/**
 * The professional's home: what needs doing, what is in flight, and what is owed.
 *
 * Matters needing confirmation are separated out and shown first. Everything else is
 * secondary — an unconfirmed matter is the one state with a clock on it, and letting
 * it slide past the deadline means admin takes it back.
 */

export const dynamic = "force-dynamic";

export default async function ProPage() {
  const cookie = await forwardedCookie();

  const [mattersResult, loadResult, earningsResult] = await Promise.all([
    api.call<Matter[]>("/pro/matters", { cookie }),
    api.call<ProLoad>("/pro/load", { cookie }),
    api.call<Earnings>("/pro/earnings", { cookie }),
  ]);

  // An account with the professional role but no professional record — an admin
  // looking at this page, most often. Say so rather than rendering empty tiles.
  if (!mattersResult.ok) {
    return (
      <div className={styles.empty}>
        <strong>This account is not set up as a professional.</strong>
        {mattersResult.message}
      </div>
    );
  }

  const matters = mattersResult.data;
  const load = loadResult.ok
    ? loadResult.data
    : { open: 0, capacity: 0, available: false, status: "draft" as const };
  const earnings = earningsResult.ok
    ? earningsResult.data
    : { pendingPaise: 0, paidPaise: 0, matters: { completed: 0, open: 0 } };

  const needsConfirming = matters.filter((m) => m.status === "assigned");
  const active = matters.filter((m) => isOpenMatter(m.status) && m.status !== "assigned");
  const closed = matters.filter((m) => !isOpenMatter(m.status));

  return (
    <>
      <h1 className={styles.title}>Your matters</h1>
      <p className={styles.sub}>
        Matters are assigned to you automatically when a client pays. Confirm each one so the client
        and admin know it is picked up.
      </p>

      <AvailabilityToggle available={load.available} open={load.open} capacity={load.capacity} />

      <div className={styles.tiles}>
        <Tile value={needsConfirming.length} label="Awaiting your confirmation" />
        <Tile value={`${String(load.open)} / ${String(load.capacity)}`} label="Slots in use" />
        <Tile value={formatPrice(earnings.pendingPaise)} label="Earned, not yet paid out" />
        <Tile value={earnings.matters.completed} label="Completed" />
      </div>

      {matters.length === 0 && (
        <div className={styles.empty}>
          <strong>Nothing assigned yet.</strong>
          When a client pays for a service in one of your categories, it appears here within seconds
          — provided you are available and under capacity.
        </div>
      )}

      {needsConfirming.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Needs your confirmation</h2>
          <div className={styles.matters}>
            {needsConfirming.map((matter) => (
              <MatterCard
                key={matter.assignmentId}
                matter={matter}
                overdue={matter.acknowledgeOverdue}
              />
            ))}
          </div>
        </>
      )}

      {active.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>In hand</h2>
          <div className={styles.matters}>
            {active.map((matter) => (
              <MatterCard key={matter.assignmentId} matter={matter} overdue={false} />
            ))}
          </div>
        </>
      )}

      {closed.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Closed</h2>
          <div className={styles.matters}>
            {closed.map((matter) => (
              <MatterCard key={matter.assignmentId} matter={matter} overdue={false} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function Tile({ value, label }: { value: number | string; label: string }) {
  return (
    <div className={styles.tile}>
      <div className={styles.tileValue}>{value}</div>
      <div className={styles.tileLabel}>{label}</div>
    </div>
  );
}

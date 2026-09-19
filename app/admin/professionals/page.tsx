import Link from "next/link";
import { api, type AdminProfessional } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import { ProfessionalActions } from "./ProfessionalActions";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<AdminProfessional["status"], string> = {
  verified: "live",
  pending_review: "pending",
  draft: "draft",
  suspended: "alert",
  rejected: "alert",
};

export default async function AdminProfessionalsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const query = status ? `?status=${status}` : "";

  const result = await api.call<AdminProfessional[]>(`/admin/professionals${query}`, {
    cookie: await forwardedCookie(),
  });
  const professionals = result.ok ? result.data : [];

  return (
    <>
      <h1 className={styles.title}>Professionals</h1>
      <p className={styles.sub}>
        Only verified, available professionals with a payout identity receive work.
      </p>

      <form className={styles.controls} action="/admin/professionals" method="get">
        <select
          className={styles.select}
          name="status"
          defaultValue={status ?? ""}
          aria-label="Status"
        >
          <option value="">All statuses</option>
          <option value="pending_review">Awaiting review</option>
          <option value="verified">Verified</option>
          <option value="suspended">Suspended</option>
          <option value="draft">Draft</option>
        </select>
        <button type="submit" className={styles.button}>
          Filter
        </button>
      </form>

      <div className={styles.tableWrap}>
        {professionals.length === 0 ? (
          <div className={styles.empty}>
            No professionals{status ? " with that status" : " yet"}. Until at least one is verified
            and available, every paid order will park in the queue.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Professional</th>
                <th>Categories</th>
                <th>Load</th>
                <th>Status</th>
                <th>Eligible</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {professionals.map((professional) => {
                // Exactly the conditions the assignment engine applies, restated so
                // "why is this person getting no work" is answerable at a glance.
                const eligible =
                  professional.status === "verified" &&
                  professional.available &&
                  professional.hasPayoutIdentity &&
                  professional.categories.length > 0;

                const blocker = !professional.hasPayoutIdentity
                  ? "No payout identity"
                  : professional.categories.length === 0
                    ? "No categories"
                    : !professional.available
                      ? "Unavailable"
                      : professional.status !== "verified"
                        ? "Not verified"
                        : null;

                return (
                  <tr key={professional.id}>
                    <td>
                      <div className={styles.serviceName}>{professional.displayName}</div>
                      <div className={styles.serviceMeta}>
                        {professional.email ?? professional.phone ?? "—"}
                      </div>
                    </td>
                    <td className={styles.muted}>
                      {professional.categories.length ? professional.categories.join(", ") : "—"}
                    </td>
                    <td className={styles.numeric}>
                      {professional.openMatters} / {professional.concurrentCapacity}
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${styles[STATUS_TONE[professional.status]] ?? ""}`}
                      >
                        {professional.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      {eligible ? (
                        <span className={`${styles.badge} ${styles.live}`}>Yes</span>
                      ) : (
                        <span className={`${styles.badge} ${styles.draft}`} title={blocker ?? ""}>
                          {blocker}
                        </span>
                      )}
                    </td>
                    <td>
                      {/* The list decides; the detail page is where you check the
                          registration number against the register before deciding. */}
                      <Link
                        href={`/admin/professionals/${professional.id}`}
                        className={styles.ghost}
                      >
                        Review
                      </Link>
                      <ProfessionalActions professional={professional} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

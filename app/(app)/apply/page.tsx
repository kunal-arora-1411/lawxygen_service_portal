import { redirect } from "next/navigation";
import { api, type Category, type ProfessionalApplication } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import { ApplicationForm } from "./ApplicationForm";
import styles from "./apply.module.css";

/**
 * Joining the supply side.
 *
 * Lives in the client shell rather than under /pro, because the /pro layout sends
 * clients away — and until somebody has applied, a client is exactly what they are.
 * Everything after this sits under /pro, by which point applying has granted the role.
 *
 * Anyone who has already applied goes to their application instead of being offered a
 * second one.
 */

export const dynamic = "force-dynamic";

export default async function ApplyPage() {
  const cookie = await forwardedCookie();

  const [existing, categoriesResult] = await Promise.all([
    api.call<ProfessionalApplication>("/pro/application", { cookie }),
    api.call<Category[]>("/catalogue/categories", { cookie }),
  ]);

  if (existing.ok) redirect("/pro/application");

  return (
    <>
      <h1 className={styles.title}>Work with Lawxygen</h1>
      <p className={styles.sub}>
        Clients pay up front and a matter is assigned automatically — no bidding, no chasing
        invoices. We take a commission and pay out the rest in batches.
      </p>

      <ApplicationForm categories={categoriesResult.ok ? categoriesResult.data : []} />
    </>
  );
}

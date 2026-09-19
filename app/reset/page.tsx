import { Suspense } from "react";
import { ResetForm } from "./ResetForm";
import styles from "../login/page.module.css";

/**
 * The page an emailed reset link lands on.
 *
 * `force-dynamic` because the token is in the query string and nothing about this
 * should ever be cached — by us, or by anything between us and the browser.
 */

export const dynamic = "force-dynamic";

export default function ResetPage() {
  return (
    <div className={styles.page}>
      {/* useSearchParams needs a boundary. */}
      <Suspense fallback={<div className={styles.card}>Loading…</div>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}

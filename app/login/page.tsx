import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      {/* useSearchParams needs a boundary, and the form is the whole page anyway. */}
      <Suspense fallback={<div className={styles.card}>Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

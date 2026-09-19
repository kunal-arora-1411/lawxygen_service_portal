import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import styles from "./pro.module.css";

/**
 * The professional's surface.
 *
 * Admins are let through as well as professionals — an admin looking at this needs to
 * be able to, and the API still refuses anything that requires an actual professional
 * record, so nothing leaks either way.
 */
export default async function ProLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/pro");
  if (user.role === "client") redirect("/dashboard");

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link href="/pro" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            LX
          </span>
          Lawxygen
          <span className={styles.roleBadge}>Professional</span>
        </Link>
        <div className={styles.spacer} />
        <span className={styles.who}>{user.name ?? user.email}</span>
        <Link href="/dashboard" className={styles.exit}>
          Client portal →
        </Link>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  );
}

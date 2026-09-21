"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminShell.module.css";

/**
 * The operations frame.
 *
 * Deliberately a different colour from the client portal. Someone with an admin role
 * can see both, and "which side am I on" should never be a question — the actions here
 * change other people's money.
 */
export function AdminShell({
  children,
  pending,
  escalated,
}: {
  children: React.ReactNode;
  pending: number;
  escalated: number;
}) {
  const pathname = usePathname();

  const items = [
    { href: "/admin", label: "Overview", badge: 0 },
    { href: "/admin/services", label: "Catalogue", badge: 0 },
    { href: "/admin/professionals", label: "Professionals", badge: pending },
    { href: "/admin/orders", label: "Orders", badge: escalated },
    { href: "/admin/payouts", label: "Payouts", badge: 0 },
    { href: "/admin/conversations", label: "Conversations", badge: 0 },
    { href: "/admin/whatsapp", label: "Templates", badge: 0 },
    { href: "/admin/reconciliation", label: "Reconciliation", badge: 0 },
  ];

  return (
    <div className={styles.shell}>
      <aside className={styles.rail}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            LX
          </span>
          <span className={styles.wordmark}>Lawxygen</span>
          <span className={styles.opsBadge}>Ops</span>
        </div>

        <nav className={styles.nav} aria-label="Admin">
          {items.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navItem}
                aria-current={active ? "page" : undefined}
              >
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className={styles.pill}>
                    {item.badge}
                    <span className="visually-hidden"> needing attention</span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={styles.foot}>
          Every action here is recorded against your account.
          <Link href="/dashboard" className={styles.exit}>
            ← Back to the client portal
          </Link>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}

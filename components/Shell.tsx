"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { API_ORIGIN, type SessionUser } from "@/lib/api";
import { useRailCollapsed } from "@/lib/client-state";
import styles from "./Shell.module.css";

/**
 * The application frame: mark top-left, collapsible rail beneath it, profile top-right.
 *
 * The collapsed state persists per viewer in localStorage. That is a per-viewer
 * convenience and nothing else depends on it, so a private window or blocked storage
 * simply means the rail starts expanded — every read and write is wrapped, because a
 * throwing accessor here would take the whole shell down.
 */

const NAV = [
  {
    group: "Services",
    items: [
      { href: "/dashboard", label: "Home", icon: "◉" },
      { href: "/services", label: "All services", icon: "▤" },
    ],
  },
  {
    group: "Your account",
    items: [
      { href: "/orders", label: "My orders", icon: "❏" },
      // The supply side has to be findable from the demand side, or the only
      // professionals who ever apply are the ones sent a direct link.
      { href: "/apply", label: "Work with us", icon: "◈" },
    ],
  },
  // Invoices and Profile are deliberately absent until those pages exist. A nav that
  // links to a 404 is worse than one that is short.
] as const;

function initials(user: SessionUser): string {
  const source = user.name?.trim() || user.email || "?";
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Shell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useRailCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={styles.shell} data-collapsed={collapsed} data-mobile-open={mobileOpen}>
      {mobileOpen && (
        <button
          type="button"
          className={styles.scrim}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={styles.rail}>
        <Link href="/dashboard" className={styles.brand} aria-label="Lawxygen home">
          <span className={styles.mark} aria-hidden="true">
            LX
          </span>
          <span className={styles.wordmark}>Lawxygen</span>
        </Link>

        <button
          type="button"
          className={styles.collapseToggle}
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand menu" : "Collapse menu"}
        >
          <span aria-hidden="true">{collapsed ? "»" : "«"}</span>
          <span className={styles.toggleLabel}>Collapse</span>
        </button>

        <nav className={styles.nav} aria-label="Main">
          {NAV.map((section) => (
            <div key={section.group}>
              <div className={styles.navGroup}>{section.group}</div>
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.navItem}
                    aria-current={active ? "page" : undefined}
                    // Collapsed hides the label, so the icon needs its own name.
                    title={collapsed ? item.label : undefined}
                    // Closed here rather than in an effect on pathname: the drawer
                    // covers the destination, and this is the moment it should go.
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className={styles.navIcon} aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className={styles.navLabel}>{item.label}</span>
                    {collapsed && <span className="visually-hidden">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <ProfileMenu user={user} />
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

function ProfileMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    // Escape as well as click-away: a menu a keyboard user cannot dismiss is a trap.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function signOut() {
    // Straight to the API: the session cookie is its to clear, not the portal's.
    await fetch(`${API_ORIGIN}/auth/logout`, { method: "POST", credentials: "include" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className={styles.profile} ref={container}>
      <button
        type="button"
        className={styles.profileButton}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className={styles.avatar} aria-hidden="true">
          {initials(user)}
        </span>
        <span className={styles.profileName}>{user.name ?? user.email ?? "Account"}</span>
        <span aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <div className={styles.menuHeader}>
            <div>{user.name ?? "Your account"}</div>
            <div className={styles.menuEmail}>{user.email ?? user.phone}</div>
          </div>
          <Link href="/orders" className={styles.menuItem} role="menuitem">
            My orders
          </Link>
          <button
            type="button"
            className={`${styles.menuItem} ${styles.danger}`}
            role="menuitem"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

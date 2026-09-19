"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { PortalIcon, PortalIconName } from "./PortalIcons";
import styles from "./PortalShell.module.css";

type NavItem = { href: string; label: string; icon: PortalIconName; badge?: string };

type Props = {
  mode: "user" | "admin";
  children: ReactNode;
};

const userNav: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/dashboard/services", label: "My services", icon: "services", badge: "3" },
  { href: "/dashboard/compliance", label: "Compliance", icon: "compliance", badge: "2" },
  { href: "/dashboard/appointments", label: "Appointments", icon: "appointments" },
  { href: "/dashboard/documents", label: "Documents", icon: "documents" },
  { href: "/dashboard/messages", label: "Messages", icon: "messages", badge: "4" },
  { href: "/dashboard/profile", label: "Profile", icon: "profile" },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "Overview", icon: "overview" },
  { href: "/admin/requests", label: "Service requests", icon: "requests", badge: "18" },
  { href: "/admin/users", label: "Users", icon: "users" },
  { href: "/admin/appointments", label: "Appointments", icon: "appointments", badge: "7" },
  { href: "/admin/professionals", label: "Professionals", icon: "professionals" },
  { href: "/admin/services", label: "Service catalogue", icon: "services" },
  { href: "/admin/support", label: "Support queue", icon: "support", badge: "5" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

function isRouteActive(pathname: string, href: string) {
  if (href === "/dashboard" || href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PortalShell({ mode, children }: Props) {
  const pathname = usePathname();
  const [mobileNav, setMobileNav] = useState(false);
  const nav = mode === "admin" ? adminNav : userNav;
  const title = mode === "admin" ? "LAWXYGEN Control" : "Client workspace";
  const profileLabel = mode === "admin" ? "Admin workspace" : "My account";

  const activeLabel = useMemo(
    () => nav.find((item) => isRouteActive(pathname, item.href))?.label ?? "Overview",
    [nav, pathname],
  );

  useEffect(() => {
    setMobileNav(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("lawx-portal-nav-open", mobileNav);
    return () => document.documentElement.classList.remove("lawx-portal-nav-open");
  }, [mobileNav]);

  return (
    <div className={`${styles.shell} ${mode === "admin" ? styles.adminShell : ""}`}>
      <aside className={`${styles.sidebar} ${mobileNav ? styles.sidebarOpen : ""}`}>
        <div className={styles.brandRow}>
          <Link href="/" className={styles.brand} aria-label="LAWXYGEN home">
            <Image src="/lawxygen-logo-clean.png" alt="LAWXYGEN" width={150} height={105} priority />
          </Link>
          <button className={styles.mobileClose} type="button" onClick={() => setMobileNav(false)}>×</button>
        </div>

        <div className={styles.workspaceMeta}>
          <span>{mode === "admin" ? "OPERATIONS" : "WORKSPACE"}</span>
          <strong>{title}</strong>
        </div>

        <nav className={styles.nav} aria-label={`${mode} portal navigation`}>
          {nav.map((item) => {
            const active = isRouteActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}>
                <i><PortalIcon name={item.icon} /></i>
                <span>{item.label}</span>
                {item.badge ? <b>{item.badge}</b> : null}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFoot}>
          <div className={styles.helpCard}>
            <i><PortalIcon name={mode === "admin" ? "activity" : "support"} size={20} /></i>
            <div>
              <strong>{mode === "admin" ? "Operations centre" : "Need help?"}</strong>
              <span>{mode === "admin" ? "Review system activity and queues." : "Our team can help with your matter."}</span>
            </div>
            <PortalIcon name="arrow" size={16} />
          </div>
          <Link href="/" className={styles.exitLink}><PortalIcon name="logout" /><span>Back to website</span></Link>
        </div>
      </aside>

      <button className={`${styles.mobileBackdrop} ${mobileNav ? styles.mobileBackdropOpen : ""}`} type="button" aria-label="Close navigation" onClick={() => setMobileNav(false)} />

      <section className={styles.mainArea}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.menuButton} type="button" onClick={() => setMobileNav(true)} aria-label="Open navigation"><PortalIcon name="menu" /></button>
            <div className={styles.crumb}>
              <span>{mode === "admin" ? "Admin" : "Workspace"}</span>
              <strong>{activeLabel}</strong>
            </div>
          </div>

          <div className={styles.topbarActions}>
            <label className={styles.searchBox}>
              <PortalIcon name="search" />
              <input type="search" placeholder={mode === "admin" ? "Search users, requests..." : "Search services, documents..."} />
              <kbd>⌘ K</kbd>
            </label>
            <button type="button" className={styles.iconButton} aria-label="Notifications"><PortalIcon name="bell" /><span /></button>
            <button type="button" className={styles.profileButton}>
              <span className={styles.avatar}>{mode === "admin" ? "A" : "YK"}</span>
              <span className={styles.profileText}><strong>{profileLabel}</strong><small>{mode === "admin" ? "Administrator" : "LAWXYGEN client"}</small></span>
              <span className={styles.chevron}>⌄</span>
            </button>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </section>
    </div>
  );
}

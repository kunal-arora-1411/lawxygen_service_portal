import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { PortalIcon, PortalIconName } from "./PortalIcons";
import { useAuth } from "@/context/AuthContext";
import { getServiceMatter } from "@/services/serviceApi";
import { getAdminServiceMatterStats, getCurrentAdmin } from "@/services/adminApi";
import apiService from "@/api/ApiService";
import { AccountSettingsModal } from "@/components/auth/AccountSettingsModal";
import styles from "./PortalShell.module.css";

type CurrentAccount = { name?: string; email?: string } | null;

function getInitials(name?: string, fallback = "U") {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type NavItem = { href: string; label: string; icon: PortalIconName; badge?: string };

type Props = {
  mode: "user" | "admin";
  children: ReactNode;
};

function isRouteActive(pathname: string, href: string) {
  if (href === "/dashboard" || href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PortalShell({ mode, children }: Props) {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileNav, setMobileNav] = useState(false);
  const [activeServicesCount, setActiveServicesCount] = useState<number | null>(null);
  const [unassignedRequestsCount, setUnassignedRequestsCount] = useState<number | null>(null);
  const [adminAccount, setAdminAccount] = useState<CurrentAccount>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Client sessions already live in AuthContext; only the admin portal needs
  // its own lookup, since it authenticates against a separate cookie pair.
  const currentAccount: CurrentAccount = mode === "admin" ? adminAccount : user;

  useEffect(() => {
    if (mode !== "admin") return;

    getCurrentAdmin()
      .then((admin) => setAdminAccount(admin))
      .catch((error) => console.error("Failed to load current admin:", error));
  }, [mode]);

  useEffect(() => {
    if (!profileMenuOpen) return;

    const onClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    setProfileMenuOpen(false);

    if (mode === "admin") {
      try {
        await apiService.call("adminLogout");
      } catch (error) {
        console.error("Logout request failed:", error);
      } finally {
        setAdminAccount(null);
        navigate("/");
      }
      return;
    }

    await logout();
    navigate("/");
  };

  useEffect(() => {
    if (mode !== "user") return;

    getServiceMatter()
      .then((matters) => setActiveServicesCount(matters?.length ?? 0))
      .catch((error) => console.error("Failed to load services count:", error));
  }, [mode]);

  useEffect(() => {
    if (mode !== "admin") return;

    getAdminServiceMatterStats()
      .then((stats) => setUnassignedRequestsCount(stats.unassigned))
      .catch((error) => console.error("Failed to load service request stats:", error));
  }, [mode]);

  const userNav: NavItem[] = useMemo(
    () => [
      { href: "/dashboard", label: "Overview", icon: "overview" },
      { href: "/dashboard/services", label: "My services", icon: "services", badge: activeServicesCount != null ? String(activeServicesCount) : undefined },
      { href: "/dashboard/compliance", label: "Compliance", icon: "compliance", badge: "2" },
      { href: "/dashboard/appointments", label: "Appointments", icon: "appointments" },
      { href: "/dashboard/documents", label: "Documents", icon: "documents" },
      { href: "/dashboard/messages", label: "Messages", icon: "messages", badge: "4" },
      { href: "/dashboard/profile", label: "Profile", icon: "profile" },
    ],
    [activeServicesCount],
  );

  const adminNav: NavItem[] = useMemo(
    () => [
      { href: "/admin", label: "Overview", icon: "overview" },
      { href: "/admin/requests", label: "Service requests", icon: "requests", badge: unassignedRequestsCount != null ? String(unassignedRequestsCount) : undefined },
      { href: "/admin/users", label: "Users", icon: "users" },
      { href: "/admin/appointments", label: "Appointments", icon: "appointments", badge: "7" },
      { href: "/admin/professionals", label: "Professionals", icon: "professionals" },
      { href: "/admin/services", label: "Service catalogue", icon: "services" },
      { href: "/admin/support", label: "Support queue", icon: "support", badge: "5" },
      { href: "/admin/settings", label: "Settings", icon: "settings" },
    ],
    [unassignedRequestsCount],
  );

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
          <Link to="/" className={styles.brand} aria-label="LAWXYGEN home">
            <img src="/lawxygen-logo-clean.png" alt="LAWXYGEN" width={150} height={105} />
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
              <Link key={item.href} to={item.href} className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}>
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
          <Link to="/" className={styles.exitLink}><PortalIcon name="logout" /><span>Back to website</span></Link>
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
            <div className={styles.profileMenu} ref={profileMenuRef}>
              <button
                type="button"
                className={styles.profileButton}
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
                onClick={() => setProfileMenuOpen((value) => !value)}
              >
                <span className={styles.avatar}>{getInitials(currentAccount?.name, mode === "admin" ? "A" : "U")}</span>
                <span className={styles.profileText}><strong>{currentAccount?.name || profileLabel}</strong><small>{mode === "admin" ? "Administrator" : "LAWXYGEN client"}</small></span>
                <span className={styles.chevron}>⌄</span>
              </button>

              {profileMenuOpen && (
                <div className={styles.profileDropdown} role="menu">
                  <div className={styles.profileDropdownHead}>
                    <strong>{currentAccount?.name || profileLabel}</strong>
                    {currentAccount?.email && <span>{currentAccount.email}</span>}
                  </div>

                  {mode === "user" && (
                    <button
                      type="button"
                      role="menuitem"
                      className={styles.profileDropdownItem}
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setSettingsOpen(true);
                      }}
                    >
                      <PortalIcon name="settings" size={16} />
                      <span>Settings</span>
                    </button>
                  )}

                  <button
                    type="button"
                    role="menuitem"
                    className={`${styles.profileDropdownItem} ${styles.profileDropdownLogout}`}
                    onClick={handleLogout}
                  >
                    <PortalIcon name="logout" size={16} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </section>

      {mode === "user" && <AccountSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

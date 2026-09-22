import { useCallback, useEffect, useState } from "react";
import { ServiceMegaMenu } from "./ServiceMegaMenu";
import { Link } from "react-router-dom";
import { LoginModal } from "@/components/auth/LoginModal";
import { useUserId } from "@/hooks/useUserId";

type MobileIconName =
  | "services"
  | "business"
  | "compliance"
  | "brand"
  | "lawyer"
  | "expert"
  | "ai";

function MobileIcon({ name }: { name: MobileIconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "services") {
    return (
      <svg {...common}>
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
      </svg>
    );
  }

  if (name === "business") {
    return (
      <svg {...common}>
        <path d="M4 20V8l8-4 8 4v12" />
        <path d="M8 20v-6h8v6M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    );
  }

  if (name === "compliance") {
    return (
      <svg {...common}>
        <path d="M12 3l7 3v5c0 4.7-2.8 8.4-7 10-4.2-1.6-7-5.3-7-10V6l7-3z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  }

  if (name === "brand") {
    return (
      <svg {...common}>
        <path d="M12 3l2.2 4.8L19 10l-4.8 2.2L12 17l-2.2-4.8L5 10l4.8-2.2L12 3z" />
        <path d="M18 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
      </svg>
    );
  }

  if (name === "lawyer") {
    return (
      <svg {...common}>
        <path d="M12 4v16M7 7h10M5 7l-3 6h6L5 7zM19 7l-3 6h6l-3-6zM8 20h8" />
      </svg>
    );
  }

  if (name === "expert") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 21c.5-4 3-6 7-6s6.5 2 7 6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z" />
      <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function Header() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviceQuery, setServiceQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const userId = useUserId();

  const closeServices = useCallback(() => {
    setServicesOpen(false);
  }, []);

  const openServices = useCallback((query = "") => {
    setServiceQuery(query);
    setMobileOpen(false);
    setServicesOpen(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);

    const onOpenServices = (event: Event) => {
      const custom = event as CustomEvent<{ query?: string }>;
      openServices(custom.detail?.query ?? "");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("lawxygen:open-services", onOpenServices);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("lawxygen:open-services", onOpenServices);
    };
  }, [openServices]);

  useEffect(() => {
    document.documentElement.classList.toggle("lawx-mobile-nav-open", mobileOpen);

    return () => {
      document.documentElement.classList.remove("lawx-mobile-nav-open");
    };
  }, [mobileOpen]);

  return (
    <>
      <header className={`lawx-final-header ${scrolled ? "scrolled" : ""}`}>
        <div className="lawx-final-nav">
          <a href="/" className="lawx-final-brand" aria-label="LAWXYGEN home">
            <img
              src="/lawxygen-logo-transparent.png"
              alt="LAWXYGEN"
              width={180}
              height={130}
              className="lawx-final-logo"
            />
          </a>

          <nav className="lawx-final-links" aria-label="Primary navigation">
            <button type="button" onClick={() => openServices()}>
              Services <span>+</span>
            </button>
            <Link to="/services/business-setup">Business</Link>
            <Link to="/services/tax-compliance">Compliance</Link>
            <Link to="/services/talk-lawyer">Find a Lawyer</Link>
            <Link to="/services">Resources</Link>
          </nav>

          <div className="lawx-final-actions">
            <button
              type="button"
              className="lawx-final-search"
              onClick={() => openServices()}
              aria-label="Search services"
            >
              <SearchIcon />
            </button>

            {userId ? (
              <Link
                to={`/dashboard/${userId}`}
                className="lawx-final-login lawx-final-profile"
                aria-label="My account"
              >
                <ProfileIcon />
              </Link>
            ) : (
              <button
                type="button"
                className="lawx-final-login"
                onClick={() => setLoginOpen(true)}
              >
                Login
              </button>
            )}

            <Link to="/services/talk-lawyer/online-lawyer-consultation" className="lawx-final-consult">
              Consult <span>↗</span>
            </Link>

            <button
              type="button"
              className={`lawx-final-menu ${mobileOpen ? "active" : ""}`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <aside
        className={`lawx-mobile-drawer ${mobileOpen ? "active" : ""}`}
        data-lenis-prevent
        aria-hidden={!mobileOpen}
      >
        <div className="lawx-mobile-drawer-head">
          <a href="/" className="lawx-mobile-brand" onClick={() => setMobileOpen(false)}>
            <img
              src="/lawxygen-logo-transparent.png"
              alt="LAWXYGEN"
              width={155}
              height={112}
              className="lawx-mobile-logo"
            />
          </a>

          {userId ? (
            <Link
              to={`/dashboard/${userId}`}
              className="lawx-mobile-login lawx-final-profile"
              aria-label="My account"
              onClick={() => setMobileOpen(false)}
            >
              <ProfileIcon />
            </Link>
          ) : (
            <button
              type="button"
              className="lawx-mobile-login"
              onClick={() => {
                setMobileOpen(false);
                setLoginOpen(true);
              }}
            >
              Login
            </button>
          )}

          <button
            type="button"
            className="lawx-mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <button type="button" className="lawx-mobile-location">
          <span className="lawx-india-flag">🇮🇳</span>
          <span>
            <strong>India</strong>
            <small>Location / language</small>
          </span>
          <b>›</b>
        </button>

        <div className="lawx-mobile-group">
          <span className="lawx-mobile-label">LEGAL & BUSINESS</span>

          <button type="button" onClick={() => openServices()}>
            <i><MobileIcon name="services" /></i>
            <span>Explore Services</span>
            <b>›</b>
          </button>

          <Link to="/services/business-setup" onClick={() => setMobileOpen(false)}>
            <i><MobileIcon name="business" /></i>
            <span>Start a Business</span>
            <b>›</b>
          </Link>

          <Link to="/services/tax-compliance" onClick={() => setMobileOpen(false)}>
            <i><MobileIcon name="compliance" /></i>
            <span>Tax & Compliance</span>
            <b>›</b>
          </Link>

          <button type="button" onClick={() => openServices("Trademark")}>
            <i><MobileIcon name="brand" /></i>
            <span>IP & Trademarks</span>
            <b>›</b>
          </button>

          <Link to="/services/talk-lawyer" onClick={() => setMobileOpen(false)}>
            <i><MobileIcon name="lawyer" /></i>
            <span>Find a Lawyer</span>
            <b>›</b>
          </Link>

          <Link to="/services/talk-lawyer" onClick={() => setMobileOpen(false)}>
            <i><MobileIcon name="expert" /></i>
            <span>Find a Lawyer</span>
            <b>›</b>
          </Link>
        </div>

        <div className="lawx-mobile-rule" />

        <div className="lawx-mobile-group compact">
          <span className="lawx-mobile-label">LAWXYGEN</span>
          <Link to="/services" onClick={() => setMobileOpen(false)}>
            <span>Resources</span>
            <b>›</b>
          </Link>
          <Link to="/services/talk-lawyer/online-lawyer-consultation" onClick={() => setMobileOpen(false)}>
            <span>Contact</span>
            <b>›</b>
          </Link>
        </div>

        <div className="lawx-mobile-bottom">
          <Link to="/services/talk-lawyer" className="lawx-mobile-find" onClick={() => setMobileOpen(false)}>
            <i><MobileIcon name="lawyer" /></i>
            Find a Lawyer
          </Link>

          <Link to="/services/talk-lawyer/online-lawyer-consultation" onClick={() => setMobileOpen(false)}>
            Get Started <span>→</span>
          </Link>
        </div>
      </aside>

      <ServiceMegaMenu
        open={servicesOpen}
        initialQuery={serviceQuery}
        onClose={closeServices}
      />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </>
  );
}

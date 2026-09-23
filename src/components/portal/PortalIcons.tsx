export type PortalIconName =
  | "overview"
  | "services"
  | "compliance"
  | "appointments"
  | "documents"
  | "messages"
  | "profile"
  | "requests"
  | "users"
  | "professionals"
  | "support"
  | "settings"
  | "search"
  | "bell"
  | "arrow"
  | "calendar"
  | "clock"
  | "check"
  | "file"
  | "shield"
  | "wallet"
  | "activity"
  | "plus"
  | "menu"
  | "logout"
  | "edit"
  | "trash"
  | "close"
  | "eye"
  | "eyeOff"
  | "location";

export function PortalIcon({ name, size = 18 }: { name: PortalIconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "overview":
      return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>;
    case "services":
      return <svg {...common}><path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5M8 17h3"/></svg>;
    case "compliance":
      return <svg {...common}><path d="M12 3l7 3v5c0 4.6-2.7 8.3-7 10-4.3-1.7-7-5.4-7-10V6l7-3z"/><path d="m9 12 2 2 4-5"/></svg>;
    case "appointments":
    case "calendar":
      return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/><path d="M8 14h3M13 14h3M8 17h3"/></svg>;
    case "documents":
    case "file":
      return <svg {...common}><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h5"/></svg>;
    case "messages":
      return <svg {...common}><path d="M4 5h16v12H8l-4 4z"/><path d="M8 9h8M8 13h5"/></svg>;
    case "profile":
    case "users":
      return <svg {...common}><circle cx="12" cy="8" r="3.5"/><path d="M5 21c.6-4.1 3.2-6.2 7-6.2s6.4 2.1 7 6.2"/></svg>;
    case "professionals":
      return <svg {...common}><circle cx="9" cy="8" r="3"/><path d="M3 20c.5-3.8 2.6-5.8 6-5.8 2.4 0 4.2 1 5.2 2.8"/><circle cx="17" cy="10" r="2.3"/><path d="M14.4 20c.4-2.6 1.9-4 4.6-4 1 0 1.9.2 2.6.7"/></svg>;
    case "requests":
      return <svg {...common}><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/><circle cx="18" cy="18" r="3" fill="currentColor" stroke="none"/></svg>;
    case "support":
      return <svg {...common}><path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M4 12h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2zM20 12h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2z"/><path d="M17 19c-1.2 1.3-2.8 2-5 2"/></svg>;
    case "settings":
      return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1A7.2 7.2 0 0 0 15 6l-.3-2.6h-4L10.4 6a7.2 7.2 0 0 0-1.5.9l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7.2 7.2 0 0 0 1.5.9l.3 2.6h4l.3-2.6a7.2 7.2 0 0 0 1.5-.9l2.4 1 2-3.5-2-1.5a7 7 0 0 0 .1-1z"/></svg>;
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg>;
    case "bell":
      return <svg {...common}><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 20h4"/></svg>;
    case "arrow":
      return <svg {...common}><path d="M5 12h14M14 7l5 5-5 5"/></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "check":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>;
    case "shield":
      return <svg {...common}><path d="M12 3l7 3v5c0 4.6-2.7 8.3-7 10-4.3-1.7-7-5.4-7-10V6l7-3z"/></svg>;
    case "wallet":
      return <svg {...common}><path d="M4 6h14a2 2 0 0 1 2 2v10H4z"/><path d="M4 6V5a2 2 0 0 1 2-2h10v3M15 11h6v4h-6z"/></svg>;
    case "activity":
      return <svg {...common}><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>;
    case "plus":
      return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case "menu":
      return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case "logout":
      return <svg {...common}><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"/></svg>;
    case "edit":
      return <svg {...common}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
    case "trash":
      return <svg {...common}><path d="M4 7h16"/><path d="M9 7V4h6v3M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/></svg>;
    case "close":
      return <svg {...common}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "eye":
      return <svg {...common}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "eyeOff":
      return <svg {...common}><path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M6.5 6.7C4 8.3 2 12 2 12s3.6 7 10 7c1.8 0 3.4-.5 4.7-1.3M9.9 4.2A9.7 9.7 0 0 1 12 4c6.4 0 10 8 10 8a17 17 0 0 1-2.9 4.1"/></svg>;
    case "location":
      return <svg {...common}><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>;
    default:
      return null;
  }
}

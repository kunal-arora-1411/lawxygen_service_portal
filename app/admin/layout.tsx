import { ReactNode } from "react";
import { PortalShell } from "@/components/portal/PortalShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <PortalShell mode="admin">{children}</PortalShell>;
}

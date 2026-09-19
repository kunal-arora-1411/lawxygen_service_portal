import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { api, type AdminOverview } from "@/lib/api";
import { forwardedCookie, requireUser } from "@/lib/session";

/**
 * Admin is its own route group, outside the client shell.
 *
 * The role check here produces a clean redirect rather than a wall of forbidden
 * errors. It is not the boundary: every admin endpoint re-checks the role server-side,
 * so bypassing this gets nothing.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/admin");
  if (user.role !== "admin" && user.role !== "superadmin") redirect("/dashboard");

  // Badge counts live in the rail, so they are fetched once here rather than by each
  // page that happens to want them.
  const overview = await api.call<AdminOverview>("/admin/overview", {
    cookie: await forwardedCookie(),
  });

  return (
    <AdminShell
      pending={overview.ok ? overview.data.professionals.pendingReview : 0}
      escalated={overview.ok ? overview.data.queue.escalated : 0}
    >
      {children}
    </AdminShell>
  );
}

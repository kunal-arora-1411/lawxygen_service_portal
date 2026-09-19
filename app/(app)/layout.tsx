import { Shell } from "@/components/Shell";
import { requireUser } from "@/lib/session";

/**
 * Everything in this group is behind a session.
 *
 * The check is server-side and runs before any page in the group renders. It is a
 * convenience, not the security boundary — the API re-checks authorization inside
 * every handler, so a request that skipped this still gets nothing.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <Shell user={user}>{children}</Shell>;
}

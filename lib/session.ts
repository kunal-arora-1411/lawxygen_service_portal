import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, type SessionUser } from "./api";

/**
 * Reading the signed-in user, server-side.
 *
 * The session cookie belongs to the API's host, so a server component has to forward
 * it explicitly — unlike the browser, `fetch` here starts with no cookie jar. Getting
 * this wrong renders every page as though nobody is signed in, which looks like a
 * login bug rather than a missing header.
 */
export async function forwardedCookie(): Promise<string> {
  const jar = await cookies();
  return jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export async function currentUser(): Promise<SessionUser | null> {
  const result = await api.call<{ user: SessionUser; impersonated: boolean }>("/auth/me", {
    cookie: await forwardedCookie(),
  });
  return result.ok ? result.data.user : null;
}

/**
 * For pages that require a client.
 *
 * Carries the attempted path through login so the CTA a visitor clicked on the
 * marketing site survives signing in — landing them on a generic dashboard after they
 * asked for a specific service is how you lose the purchase.
 */
export async function requireUser(next?: string): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  return user;
}

import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

/**
 * Every route carries an optional trailing `/:userId` segment (see App.tsx).
 * Falls back to the "userId" cookie set at login so components still resolve
 * an id on routes visited before the URL has been synced (see UserIdSync).
 */
export function useUserId(): string | undefined {
  const { userId } = useParams<{ userId?: string }>();
  return userId ?? Cookies.get("userId");
}

export function useIsLoggedIn(): boolean {
  return Boolean(useUserId());
}

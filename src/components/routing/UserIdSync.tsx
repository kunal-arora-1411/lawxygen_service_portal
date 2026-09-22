import { ReactNode } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import Cookies from "js-cookie";

type Props = {
  children: ReactNode;
};

/**
 * Every generated route ends in an optional "/:userId" segment. If a link
 * (or a manually typed URL) lands on a route without that segment while a
 * "userId" cookie exists from a previous login, redirect once to append it,
 * so useParams().userId stays available everywhere without having to update
 * every <Link>/navigate() call across the app.
 */
export function UserIdSync({ children }: Props) {
  const { userId } = useParams<{ userId?: string }>();
  const location = useLocation();
  const cookieUserId = Cookies.get("userId");

  if (!userId && cookieUserId) {
    const base = location.pathname === "/" ? "" : location.pathname.replace(/\/$/, "");
    return <Navigate to={`${base}/${cookieUserId}${location.search}`} replace />;
  }

  return <>{children}</>;
}

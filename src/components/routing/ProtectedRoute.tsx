import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type Props = {
  children: ReactNode;
};

/**
 * Gates a route on the backend session rather than on anything the browser
 * can be told to believe. Because that session is resolved by an async call
 * (see AuthContext), there is a brief "loading" state on a cold load — render
 * a placeholder for it instead of falling through, otherwise every refresh of
 * a dashboard page would flash a redirect before the answer arrives.
 */
export function ProtectedRoute({ children }: Props) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <main
        style={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          padding: "80px 24px",
          color: "#5b6472",
        }}
      >
        Loading your workspace…
      </main>
    );
  }

  if (status === "unauthenticated") {
    // "from" lets a future login flow send the visitor back where they aimed.
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import apiService from "@/api/ApiService";

export type AuthUser = {
  _id?: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  isLoggedIn: boolean;
  /** Seed the session straight from a login response, so no extra /me call. */
  setUser: (user: AuthUser | null) => void;
  /** Re-read the session from the backend (e.g. after a profile update). */
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * The session lives in httpOnly cookies issued by the backend, so the only
 * way to know whether a visitor is logged in is to ask the server: a 200 from
 * /api/client/users/me means yes, a 401 means no. That answer is fetched once
 * at boot and kept in memory — nothing about the session is mirrored into a
 * JS-readable cookie or into the URL, where it could be read or forged.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const setSession = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser);
    setStatus(nextUser ? "authenticated" : "unauthenticated");
  }, []);

  const refresh = useCallback(async () => {
    try {
      const response = await apiService.call(
        "getCurrentUser",
        {},
        {
          // A logged-out visitor's /me call is *expected* to 401. Without this
          // flag ApiService would read that as an expired session and send the
          // browser to "/" — which, on the home page, is an endless reload.
          skipSessionExpiredRedirect: true,
        },
      );

      setSession(response.data?.user ?? response.data ?? null);
    } catch {
      setSession(null);
    }
  }, [setSession]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await apiService.call("logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // The backend clears its own cookies; drop the in-memory copy either
      // way so the UI can't keep showing a session the server has ended.
      setSession(null);
    }
  }, [setSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isLoggedIn: status === "authenticated",
      setUser: setSession,
      refresh,
      logout,
    }),
    [user, status, setSession, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth() must be used inside an <AuthProvider>.");
  }

  return context;
}

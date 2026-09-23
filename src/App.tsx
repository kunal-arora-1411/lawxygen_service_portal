import type { ComponentType } from "react";
import { Routes, Route } from "react-router-dom";

import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PortalShell } from "@/components/portal/PortalShell";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";

type PageModule = { default: ComponentType };

const pageModules = import.meta.glob<PageModule>("./app/**/page.tsx", { eager: true });

function toRoutePath(filePath: string) {
  const trimmed = filePath.replace(/^\.\/app/, "").replace(/\/page\.tsx$/, "");
  // Folder segments named "[param]" (Next.js-style, kept because Windows
  // disallows ":" in filenames) become react-router ":param" segments.
  const withParams = trimmed.replace(/\[([^\]]+)\]/g, ":$1");
  return withParams === "" ? "/" : withParams;
}

const routes = Object.entries(pageModules)
  .map(([filePath, mod]) => ({
    path: toRoutePath(filePath),
    Component: mod.default,
  }))
  .filter((route) => Boolean(route.Component));

function NotFound() {
  return (
    <main style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: "80px 24px" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Page not found</h1>
        <a href="/" style={{ color: "#2f80ed" }}>Back to home</a>
      </div>
    </main>
  );
}

export function App() {
  return (
    <>
      <SmoothScroll />
      <Routes>
        {routes.map(({ path, Component }) => {
          // /admin is deliberately left ungated here: admin sessions use a
          // separate cookie/refresh pair (see adminApi) and the app has no
          // admin login page to redirect to yet, so each admin view degrades
          // to its own "Not available" state instead.
          const element =
            path.startsWith("/admin") ? (
              <PortalShell mode="admin">
                <Component />
              </PortalShell>
            ) : path.startsWith("/dashboard") ? (
              <ProtectedRoute>
                <PortalShell mode="user">
                  <Component />
                </PortalShell>
              </ProtectedRoute>
            ) : (
              <Component />
            );

          return <Route key={path} path={path} element={element} />;
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
import type { ComponentType } from "react";
import { Routes, Route } from "react-router-dom";

import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PortalShell } from "@/components/portal/PortalShell";

type PageModule = { default: ComponentType };

const pageModules = import.meta.glob<PageModule>("./app/**/page.tsx", { eager: true });

function toRoutePath(filePath: string) {
  const trimmed = filePath.replace(/^\.\/app/, "").replace(/\/page\.tsx$/, "");
  return trimmed === "" ? "/" : trimmed;
}

const routes = Object.entries(pageModules)
  .map(([filePath, mod]) => ({
    path: toRoutePath(filePath),
    Component: mod.default,
  }))
  .filter((route) => Boolean(route.Component));

  console.log("routes", routes)

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
          const element =
            path.startsWith("/admin") ? (
              <PortalShell mode="admin">
                <Component />
              </PortalShell>
            ) : path.startsWith("/dashboard") ? (
              <PortalShell mode="user">
                <Component />
              </PortalShell>
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

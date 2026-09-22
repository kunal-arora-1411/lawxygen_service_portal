import type { ComponentType } from "react";
import { Routes, Route } from "react-router-dom";

import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PortalShell } from "@/components/portal/PortalShell";
import { UserIdSync } from "@/components/routing/UserIdSync";

type PageModule = { default: ComponentType };

const pageModules = import.meta.glob<PageModule>("./app/**/page.tsx", { eager: true });

function toRoutePath(filePath: string) {
  const trimmed = filePath.replace(/^\.\/app/, "").replace(/\/page\.tsx$/, "");
  // Folder segments named "[param]" (Next.js-style, kept because Windows
  // disallows ":" in filenames) become react-router ":param" segments.
  const withParams = trimmed.replace(/\[([^\]]+)\]/g, ":$1");
  return withParams === "" ? "/" : withParams;
}

// Every page gets an optional trailing "/:userId" segment so that, once a
// user logs in (see LoginModal), useParams().userId resolves on any route.
function withUserIdSegment(path: string) {
  return path === "/" ? "/:userId?" : `${path}/:userId?`;
}

// Service category listing pages ("/services/<category>") don't read a
// userId param, and an optional trailing segment there would be ambiguous
// with the dynamic "/services/:categorySlug/:slug" detail route (both can
// match a 3-segment URL). Skip the suffix — and the resulting auto-redirect
// — only for these, so the detail route is the sole match for a service URL.
function isServiceCategoryListing(path: string) {
  const segments = path.split("/").filter(Boolean);
  return segments.length === 2 && segments[0] === "services";
}

const routes = Object.entries(pageModules)
  .map(([filePath, mod]) => {
    const basePath = toRoutePath(filePath);
    const skipUserIdSync = isServiceCategoryListing(basePath);
    return {
      path: skipUserIdSync ? basePath : withUserIdSegment(basePath),
      Component: mod.default,
      skipUserIdSync,
    };
  })
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
        {routes.map(({ path, Component, skipUserIdSync }) => {
          const page =
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

          const element = skipUserIdSync ? page : <UserIdSync>{page}</UserIdSync>;

          return <Route key={path} path={path} element={element} />;
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

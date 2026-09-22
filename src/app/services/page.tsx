import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { getServices, type ServiceRecord } from "@/services/serviceApi";

type CategoryGroup = {
  slug: string;
  label: string;
  count: number;
};

function groupByCategory(services: ServiceRecord[]): CategoryGroup[] {
  const groups = new Map<string, CategoryGroup>();
  for (const service of services) {
    const existing = groups.get(service.categorySlug);
    if (existing) {
      existing.count += 1;
    } else {
      groups.set(service.categorySlug, {
        slug: service.categorySlug,
        label: service.category,
        count: 1,
      });
    }
  }
  return Array.from(groups.values());
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    getServices()
      .then((data) => {
        if (cancelled) return;
        setServices(data);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(() => groupByCategory(services), [services]);

  return (
    <>
      <Header />
      <main style={{ padding: "120px 24px 80px", background: "#edf5fb", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto" }}>
          <p style={{ letterSpacing: ".15em", fontSize: 11, fontWeight: 800, color: "#2f80ed" }}>
            LAWXYGEN SERVICES
          </p>
          <h1
            style={{
              fontFamily: "var(--v3-display)",
              fontSize: "clamp(48px,7vw,92px)",
              lineHeight: 0.95,
              letterSpacing: "-.04em",
              margin: "14px 0 28px",
            }}
          >
            Find the right service.
          </h1>
          {status === "error" && (
            <p style={{ color: "#647f99" }}>
              We couldn't load the service catalogue right now. Please try again shortly.
            </p>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: 12,
            }}
          >
            {groups.map((group) => (
              <Link
                key={group.slug}
                to={`/services/${group.slug}`}
                style={{
                  padding: 22,
                  border: "1px solid rgba(24,69,112,.12)",
                  borderRadius: 18,
                  background: "rgba(255,255,255,.8)",
                  color: "#123d63",
                }}
              >
                <strong style={{ display: "block", fontSize: 18 }}>{group.label}</strong>
                <span style={{ display: "block", marginTop: 6, color: "#6b849d", fontSize: 13 }}>
                  {group.count} services
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

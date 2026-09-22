import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { serviceCatalog } from "@/data/serviceCatalog";
import { getServicesByCategory, type ServiceRecord } from "@/services/serviceApi";
import styles from "./ServiceCategoryPage.module.css";

type Status = "loading" | "success" | "error";

export function ServiceCategoryPage({ slug }: { slug: string }) {
  const fallbackGroup = serviceCatalog.find((x) => x.slug === slug) ?? serviceCatalog[0];
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    getServicesByCategory(slug)
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
  }, [slug]);

  const label = services[0]?.category ?? fallbackGroup.label;

  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.crumb}>
            <Link to="/">Home</Link>
            <span>•</span>
            <Link to="/services">Services</Link>
            <span>•</span>
            <b>{label}</b>
          </div>
          <section className={styles.hero}>
            <span>{label} · LAWXYGEN</span>
            <h1>Explore {label.toLowerCase()}.</h1>
            <p>
              Browse the services in this category and open the detailed LAWXYGEN
              service page for the workflow, preparation checklist and expert path.
            </p>
          </section>
          <section className={styles.list}>
            <div className={styles.listHead}>
              <span>Service catalogue</span>
              <strong>
                {status === "loading" ? "Loading…" : `${services.length} services`}
              </strong>
            </div>
            {status === "error" && (
              <p>We couldn't load this category right now. Please try again shortly.</p>
            )}
            <div className={styles.grid}>
              {services.map((service, i) => (
                <Link to={`/services/${slug}/${service.slug}`} key={service.slug}>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                  <span>{service.title}</span>
                  <b>↗</b>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

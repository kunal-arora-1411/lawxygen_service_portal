import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import { getServiceBySlug, type ServiceRecord } from "@/services/serviceApi";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import styles from "./page.module.css";

type Status = "loading" | "success" | "not-found" | "error";

function StatusScreen({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          padding: "140px 24px 80px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <h1 style={{ fontSize: 28, marginBottom: 10 }}>{title}</h1>
          <p style={{ color: "#647f99", marginBottom: 20 }}>{message}</p>
          <Link to="/services" style={{ color: "#2f80ed", fontWeight: 700 }}>
            Back to services
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function Page() {
  const { slug } = useParams<{ categorySlug: string; slug: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [service, setService] = useState<ServiceRecord | null>(null);

  useEffect(() => {
    if (!slug) {
      setStatus("not-found");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    getServiceBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setStatus("not-found");
        } else {
          setService(data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useDocumentMeta(
    service ? `${service.title} | LAWXYGEN` : undefined,
    service?.summary
  );

  if (status === "loading") {
    return (
      <StatusScreen
        title="Loading service…"
        message="Fetching the latest details for this service."
      />
    );
  }

  if (status === "not-found") {
    return (
      <StatusScreen
        title="Service not found"
        message="This service may have moved or no longer exists."
      />
    );
  }

  if (status === "error") {
    return (
      <StatusScreen
        title="Something went wrong"
        message="We couldn't load this service right now. Please try again shortly."
      />
    );
  }

  return <ServicePageTemplate data={service} styles={styles} />;
}

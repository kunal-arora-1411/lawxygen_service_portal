import { useCallback, useEffect, useState } from "react";
import { PortalIcon } from "@/components/portal/PortalIcons";
import { PortalEmptyState } from "@/components/portal/PortalEmptyState";
import { AdminServiceForm } from "@/components/portal/AdminServiceForm";
import {
  getAdminServices,
  getAdminServiceStats,
  createAdminService,
  updateAdminService,
  publishAdminService,
  deleteAdminService,
} from "@/services/adminApi";
import { ServiceRecord } from "@/services/serviceApi";
import { formatRelativeTime } from "@/utils/portalFormat";
import styles from "./ServiceCatalogue.module.css";

type View = "list" | "create" | "edit";

function extractErrorMessage(error: any, fallback: string) {
  if (error?.response?.status === 409) return "A service with this slug already exists.";
  return error?.response?.data?.message || fallback;
}

export default function Page() {
  const [view, setView] = useState<View>("list");
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);

  const [services, setServices] = useState<ServiceRecord[] | null>(null);
  const [servicesUnavailable, setServicesUnavailable] = useState(false);
  const [stats, setStats] = useState<{
    totalPages: number;
    categories: number;
    published: number;
    brokenLinks: number;
  } | null>(null);
  const [statsUnavailable, setStatsUnavailable] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searching, setSearching] = useState(false);

  // Debounce: wait for a pause in typing before hitting the API, instead of
  // firing a request on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(handle);
  }, [searchInput]);

  const loadServices = useCallback((search: string) => {
    setSearching(true);

    return getAdminServices({ limit: 100, search: search || undefined })
      .then((result) => {
        setServices(result.items ?? []);
        setServicesUnavailable(false);
      })
      .catch((error) => {
        console.error("Failed to load services:", error);
        setServicesUnavailable(true);
      })
      .finally(() => setSearching(false));
  }, []);

  const loadStats = useCallback(() => {
    return getAdminServiceStats()
      .then((data) => setStats(data))
      .catch((error) => {
        console.error("Failed to load service stats:", error);
        setStatsUnavailable(true);
      });
  }, []);

  useEffect(() => {
    loadServices(debouncedSearch);
  }, [debouncedSearch, loadServices]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const openCreate = () => {
    setEditingService(null);
    setFormError(null);
    setView("create");
  };

  const openEdit = (service: ServiceRecord) => {
    setEditingService(service);
    setFormError(null);
    setView("edit");
  };

  const closeForm = () => {
    setView("list");
    setFormError(null);
  };

  const handleSubmit = (payload: Omit<ServiceRecord, "_id">) => {
    setSubmitting(true);
    setFormError(null);

    const action = view === "edit" && editingService
      ? updateAdminService(editingService._id, payload)
      : createAdminService(payload);

    action
      .then(() => {
        setView("list");
        return Promise.all([loadServices(debouncedSearch), loadStats()]);
      })
      .catch((error) => {
        console.error("Failed to save service:", error);
        setFormError(extractErrorMessage(error, "Couldn't save this service. Please try again."));
      })
      .finally(() => setSubmitting(false));
  };

  const handlePublishToggle = (service: ServiceRecord) => {
    setMutatingId(service._id);
    publishAdminService(service._id, !service.isActive)
      .then(() => Promise.all([loadServices(debouncedSearch), loadStats()]))
      .catch((error) => {
        console.error("Failed to update publish status:", error);
        window.alert("Couldn't update the publish status. Please try again.");
      })
      .finally(() => setMutatingId(null));
  };

  const handleDelete = (service: ServiceRecord) => {
    if (!window.confirm(`Delete "${service.title}"? This can't be undone.`)) return;

    setMutatingId(service._id);
    deleteAdminService(service._id)
      .then(() => Promise.all([loadServices(debouncedSearch), loadStats()]))
      .catch((error) => {
        console.error("Failed to delete service:", error);
        window.alert("Couldn't delete this service. Please try again.");
      })
      .finally(() => setMutatingId(null));
  };

  if (view !== "list") {
    return (
      <div className={styles.page}>
        <AdminServiceForm
          initial={editingService ?? undefined}
          submitting={submitting}
          errorMessage={formError}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </div>
    );
  }

  const metrics = [
    {
      label: "Service pages",
      value: stats ? String(stats.totalPages) : "—",
      note: !stats ? (statsUnavailable ? "Not available" : "Loading…") : "Published routes",
      icon: "services" as const,
    },
    {
      label: "Categories",
      value: stats ? String(stats.categories) : "—",
      note: !stats ? (statsUnavailable ? "Not available" : "Loading…") : "Primary catalogue",
      icon: "overview" as const,
    },
    {
      label: "Published",
      value: stats ? String(stats.published) : "—",
      note: !stats ? (statsUnavailable ? "Not available" : "Loading…") : "Live on the site",
      icon: "check" as const,
    },
    {
      label: "Broken links",
      value: stats ? String(stats.brokenLinks) : "—",
      note: !stats ? (statsUnavailable ? "Not available" : "Loading…") : "Catalogue health",
      icon: "shield" as const,
    },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.head}>
        <div>
          <span>CATALOGUE</span>
          <h1>Service catalogue</h1>
          <p>Manage LAWXYGEN&rsquo;s complete service library and publishing status.</p>
        </div>
        <button type="button" className={styles.primary} onClick={openCreate}>
          <PortalIcon name="plus" size={15} /> New service
        </button>
      </section>

      <section className={styles.metrics}>
        {metrics.map((item) => (
          <article key={item.label}>
            <i><PortalIcon name={item.icon} /></i>
            <div><strong>{item.value}</strong><span>{item.label}</span><small>{item.note}</small></div>
          </article>
        ))}
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <strong>All services</strong>
            <span>
              {services
                ? `${services.length} service${services.length === 1 ? "" : "s"}${searching ? " · Searching…" : ""}`
                : "Everything in the catalogue"}
            </span>
          </div>

          <label className={styles.searchBox}>
            <PortalIcon name="search" size={14} />
            <input
              type="search"
              placeholder="Search services..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </label>
        </div>

        <div className={styles.rows}>
          {services && services.length > 0 && services.map((service) => {
            const updatedAt = (service as Record<string, unknown>).updatedAt as string | undefined;
            const isMutating = mutatingId === service._id;

            return (
              <div className={styles.row} key={service._id}>
                <div className={styles.copy}>
                  <strong>{service.title}</strong>
                  <span>{service.category}{service.price ? ` · ₹${service.price}` : ""}</span>
                </div>
                <span className={styles.meta}>{updatedAt ? `Updated ${formatRelativeTime(updatedAt)}` : "—"}</span>
                <span className={`${styles.status} ${service.isActive ? styles.good : styles.neutral}`}>
                  {service.isActive ? "Published" : "Draft"}
                </span>
                <div className={styles.actions}>
                  <button type="button" onClick={() => openEdit(service)} aria-label={`Edit ${service.title}`}>
                    <PortalIcon name="edit" size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePublishToggle(service)}
                    disabled={isMutating}
                    aria-label={service.isActive ? `Unpublish ${service.title}` : `Publish ${service.title}`}
                  >
                    <PortalIcon name={service.isActive ? "close" : "check"} size={14} />
                  </button>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => handleDelete(service)}
                    disabled={isMutating}
                    aria-label={`Delete ${service.title}`}
                  >
                    <PortalIcon name="trash" size={14} />
                  </button>
                </div>
              </div>
            );
          })}
          {services && services.length === 0 && debouncedSearch && (
            <PortalEmptyState icon="search" title="No matching services" note={`No services found for “${debouncedSearch}”.`} />
          )}
          {services && services.length === 0 && !debouncedSearch && (
            <PortalEmptyState icon="services" title="No services yet" note="Add your first service to the catalogue." />
          )}
          {servicesUnavailable && (
            <PortalEmptyState icon="services" title="Not available" note="We couldn't load the service catalogue right now." />
          )}
        </div>
      </section>
    </div>
  );
}

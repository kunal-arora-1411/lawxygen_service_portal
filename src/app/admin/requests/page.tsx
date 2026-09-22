import { useEffect, useState } from "react";
import { PortalSectionPage } from "@/components/portal/PortalSectionPage";
import { getAdminServiceMatters, getAdminServiceMatterStats, AdminServiceMatterStats } from "@/services/adminApi";
import { ServiceMatterRecord } from "@/services/serviceApi";
import { formatStatusLabel, formatRelativeTime } from "@/utils/portalFormat";

function clientName(client: unknown): string {
  if (client && typeof client === "object" && "name" in client) {
    return String((client as { name: unknown }).name);
  }
  return "Client";
}

function shortRequestId(matterId: string) {
  return `LX-${matterId.slice(-6).toUpperCase()}`;
}

export default function Page() {
  const [matters, setMatters] = useState<ServiceMatterRecord[] | null>(null);
  const [mattersUnavailable, setMattersUnavailable] = useState(false);
  const [stats, setStats] = useState<AdminServiceMatterStats | null>(null);
  const [statsUnavailable, setStatsUnavailable] = useState(false);

  useEffect(() => {
    getAdminServiceMatters({ limit: 50 })
      .then((result) => setMatters(result.items ?? []))
      .catch((error) => {
        console.error("Failed to load service requests:", error);
        setMattersUnavailable(true);
      });

    getAdminServiceMatterStats()
      .then((data) => setStats(data))
      .catch((error) => {
        console.error("Failed to load service request stats:", error);
        setStatsUnavailable(true);
      });
  }, []);

  const metrics = [
    {
      label: "Active",
      value: stats ? String(stats.active) : "—",
      note: !stats ? (statsUnavailable ? "Not available" : "Loading…") : "Across all services",
      icon: "requests" as const,
    },
    {
      label: "Unassigned",
      value: stats ? String(stats.unassigned) : "—",
      note: !stats ? (statsUnavailable ? "Not available" : "Loading…") : "Needs owner",
      icon: "activity" as const,
    },
    {
      label: "Due today",
      value: stats ? String(stats.dueToday) : "—",
      note: !stats ? (statsUnavailable ? "Not available" : "Loading…") : "Operational queue",
      icon: "clock" as const,
    },
    {
      label: "Within SLA",
      value: stats ? `${stats.withinSlaPercent}%` : "—",
      note: !stats ? (statsUnavailable ? "Not available" : "Loading…") : "Last 7 days",
      icon: "check" as const,
    },
  ];

  const rows = (matters ?? []).map((matter) => {
    const title = matter.service?.title ?? matter.serviceSnapshot?.title ?? "Service matter";
    const lastEvent = matter.actionRequired && matter.actionMessage
      ? matter.actionMessage
      : matter.currentStepTitle || formatStatusLabel(matter.status);

    return {
      title: `${shortRequestId(matter._id)} · ${title}`,
      subtitle: `${clientName(matter.client)} · ${lastEvent}`,
      meta: formatRelativeTime(matter.updatedAt),
      status: matter.actionRequired ? "Action needed" : formatStatusLabel(matter.status),
      tone: (matter.actionRequired
        ? "warn"
        : matter.status === "PAYMENT_PENDING" || matter.status === "PAID"
          ? "neutral"
          : "good") as "warn" | "good" | "neutral",
    };
  });

  return (
    <PortalSectionPage
      eyebrow="OPERATIONS"
      title="Service requests"
      description="Assign, review and move client requests through delivery."
      metrics={metrics}
      rows={rows}
      emptyIcon="requests"
      emptyTitle={mattersUnavailable ? "Not available" : "No service requests yet"}
      emptyNote={mattersUnavailable ? "We couldn't load service requests right now." : "New client requests will show up here."}
    />
  );
}

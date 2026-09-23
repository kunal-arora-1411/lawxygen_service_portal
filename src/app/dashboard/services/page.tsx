import { useEffect, useState } from "react";
import { PortalSectionPage } from "@/components/portal/PortalSectionPage";
import { getServiceMatter, ServiceMatterRecord } from "@/services/serviceApi";
import { formatStatusLabel, formatRelativeTime } from "@/utils/portalFormat";

function professionalId(professional: unknown): string | null {
  if (professional && typeof professional === "object" && "_id" in professional) {
    return String((professional as { _id: unknown })._id);
  }
  return typeof professional === "string" ? professional : null;
}

export default function Page() {
  const [matters, setMatters] = useState<ServiceMatterRecord[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    getServiceMatter()
      .then((data) => setMatters(data ?? []))
      .catch((error) => {
        console.error("Failed to load service matters:", error);
        setUnavailable(true);
      });
  }, []);

  const loaded = matters !== null;
  const needsAction = matters?.filter((matter) => matter.actionRequired) ?? [];
  const stepsCompleted = matters?.reduce((sum, matter) => sum + matter.currentStep, 0) ?? 0;
  const expertsAssigned = new Set(
    (matters ?? [])
      .map((matter) => professionalId(matter.professional))
      .filter((id): id is string => Boolean(id))
  ).size;

  const metrics = [
    {
      label: "Active services",
      value: loaded ? String(matters!.length) : "—",
      note: !loaded
        ? unavailable ? "Not available" : "Loading…"
        : needsAction.length > 0
          ? `${needsAction.length} need${needsAction.length === 1 ? "s" : ""} attention`
          : "All up to date",
      icon: "services" as const,
    },
    {
      label: "Needs action",
      value: loaded ? String(needsAction.length) : "—",
      note: !loaded
        ? unavailable ? "Not available" : "Loading…"
        : needsAction[0]?.actionMessage ?? "Nothing pending",
      icon: "activity" as const,
    },
    {
      label: "Steps completed",
      value: loaded ? String(stepsCompleted) : "—",
      note: "Across active matters",
      icon: "check" as const,
    },
    {
      label: "Experts assigned",
      value: loaded ? String(expertsAssigned) : "—",
      note: "LAWXYGEN team",
      icon: "professionals" as const,
    },
  ];

  const rows = (matters ?? []).map((matter) => ({
    title: matter.service?.title ?? matter.serviceSnapshot?.title ?? "Service matter",
    subtitle: matter.actionRequired && matter.actionMessage
      ? matter.actionMessage
      : `${matter.currentStepTitle} · Step ${matter.currentStep + 1} of ${matter.totalSteps}`,
    meta: `Updated ${formatRelativeTime(matter.updatedAt)}`,
    status: matter.actionRequired ? "Action needed" : formatStatusLabel(matter.status),
    tone: (matter.actionRequired ? "warn" : matter.status === "COMPLETED" ? "good" : "neutral") as "warn" | "good" | "neutral",
  }));

  return (
    <PortalSectionPage
      eyebrow="MY SERVICES"
      title="My services"
      description="Track every LAWXYGEN service from intake to completion."
      metrics={metrics}
      rows={rows}
      primaryLabel="Explore services"
      primaryHref="/services"
      emptyIcon="services"
      emptyTitle={unavailable ? "Not available" : "No active services yet"}
      emptyNote={unavailable ? "We couldn't load your services right now." : "Explore services to get started on your first matter."}
    />
  );
}

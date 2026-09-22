import { useEffect, useState } from "react";
import { PortalSectionPage } from "@/components/portal/PortalSectionPage";
import { getAdminUsers, getAdminUserStats, AdminUserListItem } from "@/services/adminApi";
import { formatShortDate } from "@/utils/portalFormat";

function isRecent(iso: string, days: number) {
  const diffMs = Date.now() - new Date(iso).getTime();
  return diffMs >= 0 && diffMs <= days * 86400000;
}

export default function Page() {
  const [users, setUsers] = useState<AdminUserListItem[] | null>(null);
  const [usersUnavailable, setUsersUnavailable] = useState(false);
  const [stats, setStats] = useState<{
    registered: number;
    newThisMonth: number;
    activeMatters: number;
    verifiedPercent: number;
  } | null>(null);
  const [statsUnavailable, setStatsUnavailable] = useState(false);

  useEffect(() => {
    getAdminUsers({ limit: 50 })
      .then((result) => setUsers(result.items ?? []))
      .catch((error) => {
        console.error("Failed to load users:", error);
        setUsersUnavailable(true);
      });

    getAdminUserStats()
      .then((data) => setStats(data))
      .catch((error) => {
        console.error("Failed to load user stats:", error);
        setStatsUnavailable(true);
      });
  }, []);

  const metrics = [
    {
      label: "Registered",
      value: stats ? stats.registered.toLocaleString() : "—",
      note: !stats ? (statsUnavailable ? "Not available" : "Loading…") : "All client accounts",
      icon: "users" as const,
    },
    {
      label: "New this month",
      value: stats ? String(stats.newThisMonth) : "—",
      note: !stats ? (statsUnavailable ? "Not available" : "Loading…") : "Growing client base",
      icon: "plus" as const,
    },
    {
      label: "Active matters",
      value: stats ? String(stats.activeMatters) : "—",
      note: !stats ? (statsUnavailable ? "Not available" : "Loading…") : "Current workload",
      icon: "requests" as const,
    },
    {
      label: "Verified",
      value: stats ? `${stats.verifiedPercent}%` : "—",
      note: !stats ? (statsUnavailable ? "Not available" : "Loading…") : "Contact verification",
      icon: "check" as const,
    },
  ];

  const rows = (users ?? []).map((user) => {
    const servicesLabel = `${user.activeMattersCount} active service${user.activeMattersCount === 1 ? "" : "s"}`;
    const isNew = user.status === "active" && isRecent(user.joinedAt, 30);

    return {
      title: user.name,
      subtitle: user.location ? `${servicesLabel} · ${user.location}` : servicesLabel,
      meta: `Joined ${formatShortDate(user.joinedAt)}`,
      status: isNew ? "New" : user.status === "active" ? "Active" : "Inactive",
      tone: (isNew ? "neutral" : user.status === "active" ? "good" : "neutral") as "good" | "neutral" | "warn",
    };
  });

  return (
    <PortalSectionPage
      eyebrow="CLIENTS"
      title="Users"
      description="View client accounts, profiles and active legal work."
      metrics={metrics}
      rows={rows}
      emptyIcon="users"
      emptyTitle={usersUnavailable ? "Not available" : "No users yet"}
      emptyNote={usersUnavailable ? "We couldn't load users right now." : "Registered clients will show up here."}
    />
  );
}

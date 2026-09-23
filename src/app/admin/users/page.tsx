import { FormEvent, useCallback, useEffect, useState } from "react";
import { PortalIcon } from "@/components/portal/PortalIcons";
import { PortalEmptyState } from "@/components/portal/PortalEmptyState";
import {
  getAdminUsers,
  getAdminUserStats,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
  promoteAdminUserToProfessional,
  AdminUserListItem,
  AdminUserDetail,
} from "@/services/adminApi";
import { formatShortDate } from "@/utils/portalFormat";
import styles from "./UserDirectory.module.css";

type View = "list" | "detail";

function isRecent(iso: string, days: number) {
  const diffMs = Date.now() - new Date(iso).getTime();
  return diffMs >= 0 && diffMs <= days * 86400000;
}

function extractErrorMessage(error: any, fallback: string) {
  return error?.response?.data?.message || fallback;
}

export default function Page() {
  const [view, setView] = useState<View>("list");

  const [users, setUsers] = useState<AdminUserListItem[] | null>(null);
  const [usersUnavailable, setUsersUnavailable] = useState(false);
  const [stats, setStats] = useState<{
    registered: number;
    newThisMonth: number;
    activeMatters: number;
    verifiedPercent: number;
  } | null>(null);
  const [statsUnavailable, setStatsUnavailable] = useState(false);

  const [selectedUser, setSelectedUser] = useState<AdminUserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const loadUsers = useCallback(() => {
    return getAdminUsers({ limit: 50 })
      .then((result) => {
        setUsers(result.items ?? []);
        setUsersUnavailable(false);
      })
      .catch((error) => {
        console.error("Failed to load users:", error);
        setUsersUnavailable(true);
      });
  }, []);

  const loadStats = useCallback(() => {
    return getAdminUserStats()
      .then((data) => setStats(data))
      .catch((error) => {
        console.error("Failed to load user stats:", error);
        setStatsUnavailable(true);
      });
  }, []);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [loadUsers, loadStats]);

  const openDetail = (user: AdminUserListItem) => {
    setView("detail");
    setSelectedUser(null);
    setDetailError(null);
    setDetailLoading(true);

    getAdminUserById(user._id)
      .then((detail) => {
        setSelectedUser(detail);
        setName(detail.name ?? "");
        setPhone(detail.phone ?? "");
      })
      .catch((error) => {
        console.error("Failed to load user:", error);
        setDetailError("Couldn't load this user's details.");
      })
      .finally(() => setDetailLoading(false));
  };

  const closeDetail = () => {
    setView("list");
    setSelectedUser(null);
    setDetailError(null);
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedUser) return;

    setSaving(true);
    setDetailError(null);

    updateAdminUser(selectedUser._id, { name: name.trim(), phone: phone.trim() || undefined })
      .then((updated) => {
        setSelectedUser((prev) => (prev ? { ...prev, ...updated } : prev));
        return Promise.all([loadUsers(), loadStats()]);
      })
      .catch((error) => {
        setDetailError(extractErrorMessage(error, "Couldn't save this user. Please try again."));
      })
      .finally(() => setSaving(false));
  };

  const handlePromote = () => {
    if (!selectedUser) return;
    if (!window.confirm(`Make ${selectedUser.name} a professional? They'll be moved to the professionals directory.`)) return;

    setPromoting(true);

    promoteAdminUserToProfessional(selectedUser._id)
      .then(() => {
        closeDetail();
        return Promise.all([loadUsers(), loadStats()]);
      })
      .catch((error) => {
        console.error("Failed to promote user:", error);
        window.alert("Couldn't promote this user. Please try again.");
      })
      .finally(() => setPromoting(false));
  };

  const handleDelete = (user: AdminUserListItem) => {
    if (!window.confirm(`Remove ${user.name}? This can't be undone.`)) return;

    setMutatingId(user._id);

    deleteAdminUser(user._id)
      .then(() => Promise.all([loadUsers(), loadStats()]))
      .catch((error) => {
        console.error("Failed to delete user:", error);
        window.alert("Couldn't remove this user. Please try again.");
      })
      .finally(() => setMutatingId(null));
  };

  if (view === "detail") {
    const isProfessional = selectedUser?.role === "professional";

    return (
      <div className={styles.page}>
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.formHead}>
            <div>
              <strong>{selectedUser?.name ?? "User details"}</strong>
              <span>{selectedUser?.email ?? (detailLoading ? "Loading…" : "")}</span>
            </div>
            <div className={styles.formHeadActions}>
              <button type="button" className={styles.ghostButton} onClick={closeDetail}>
                Back
              </button>
              <button
                type="button"
                className={styles.promoteButton}
                onClick={handlePromote}
                disabled={promoting || detailLoading || !selectedUser || isProfessional}
              >
                {isProfessional ? "Already a professional" : promoting ? "Promoting…" : "Make this user a professional"}
              </button>
              <button type="submit" className={styles.primaryButton} disabled={saving || detailLoading || !selectedUser}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>

          {detailError && <p className={styles.formError}>{detailError}</p>}

          {detailLoading && <p className={styles.loadingNote}>Loading user details…</p>}

          {!detailLoading && selectedUser && (
            <>
              <section className={styles.section}>
                <h2>Profile</h2>
                <div className={styles.grid2}>
                  <label>
                    Full name
                    <input required value={name} onChange={(event) => setName(event.target.value)} />
                  </label>
                  <label>
                    Email address
                    <input value={selectedUser.email ?? "—"} disabled />
                  </label>
                  <label>
                    Phone number
                    <input value={phone} placeholder="Add a phone number" onChange={(event) => setPhone(event.target.value)} />
                  </label>
                  <label>
                    Location
                    <input value={selectedUser.location ?? "—"} disabled />
                  </label>
                  <label className={styles.toggleField}>
                    <span>Verified</span>
                    <span>{selectedUser.verified ? "Yes" : "No"}</span>
                  </label>
                  <label className={styles.toggleField}>
                    <span>Status</span>
                    <span>{selectedUser.status === "active" ? "Active" : "Inactive"}</span>
                  </label>
                </div>
              </section>

              <section className={styles.section}>
                <h2>Service matters ({selectedUser.matterCount})</h2>
                {selectedUser.matters.length === 0 ? (
                  <p className={styles.emptyHint}>No service matters yet.</p>
                ) : (
                  <div className={styles.matterList}>
                    {selectedUser.matters.map((matter) => (
                      <div className={styles.matterRow} key={matter._id}>
                        <strong>{matter.serviceSnapshot?.title ?? matter.service?.title ?? "Untitled service"}</strong>
                        <span>{matter.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </form>
      </div>
    );
  }

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

  return (
    <div className={styles.page}>
      <section className={styles.head}>
        <div>
          <span>CLIENTS</span>
          <h1>Users</h1>
          <p>View client accounts, profiles and active legal work.</p>
        </div>
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
            <strong>All users</strong>
            <span>{users ? `${users.length} user${users.length === 1 ? "" : "s"}` : "Everything in the client directory"}</span>
          </div>
        </div>

        <div className={styles.rows}>
          {users && users.length > 0 && users.map((user) => {
            const servicesLabel = `${user.activeMattersCount} active service${user.activeMattersCount === 1 ? "" : "s"}`;
            const isNew = user.status === "active" && isRecent(user.joinedAt, 30);
            const isMutating = mutatingId === user._id;

            return (
              <div className={styles.row} key={user._id}>
                <div className={styles.copy}>
                  <strong>{user.name}</strong>
                  <span>{user.location ? `${servicesLabel} · ${user.location}` : servicesLabel}</span>
                </div>
                <span className={styles.meta}>Joined {formatShortDate(user.joinedAt)}</span>
                <span className={`${styles.status} ${isNew ? styles.neutral : user.status === "active" ? styles.good : styles.neutral}`}>
                  {isNew ? "New" : user.status === "active" ? "Active" : "Inactive"}
                </span>
                <div className={styles.actions}>
                  <button type="button" onClick={() => openDetail(user)} disabled={isMutating} aria-label={`Open ${user.name}`}>
                    <PortalIcon name="edit" size={14} />
                  </button>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => handleDelete(user)}
                    disabled={isMutating}
                    aria-label={`Remove ${user.name}`}
                  >
                    <PortalIcon name="trash" size={14} />
                  </button>
                </div>
              </div>
            );
          })}
          {users && users.length === 0 && (
            <PortalEmptyState icon="users" title="No users yet" note="Registered clients will show up here." />
          )}
          {usersUnavailable && (
            <PortalEmptyState icon="users" title="Not available" note="We couldn't load users right now." />
          )}
        </div>
      </section>
    </div>
  );
}

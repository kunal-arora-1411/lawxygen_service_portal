import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { PortalIcon } from "./PortalIcons";
import { PortalEmptyState } from "./PortalEmptyState";
import styles from "./PortalOverview.module.css";
import apiService from "@/api/ApiService";
import { useUserId } from "@/hooks/useUserId";
import { getServiceMatter, ServiceMatterRecord } from "@/services/serviceApi";
import {
  getClientDashboardStats,
  getClientDashboardActivity,
  getAppointments,
  getCompliance,
  ClientDashboardStats,
  DashboardActivityItem,
  AppointmentRecord,
  ComplianceItem,
} from "@/services/portalApi";
import {
  formatStatusLabel,
  formatShortDate,
  formatTime,
  formatRelativeDay,
  formatRelativeTime,
} from "@/utils/portalFormat";

function modeLabel(mode: AppointmentRecord["mode"]) {
  switch (mode) {
    case "video": return "Video consultation";
    case "phone": return "Phone consultation";
    case "in_person": return "In-person consultation";
    default: return "Consultation";
  }
}

function activityIcon(type: DashboardActivityItem["type"]) {
  switch (type) {
    case "document": return "documents";
    case "appointment": return "calendar";
    case "service_matter": return "check";
    default: return "activity";
  }
}

export function UserDashboardOverview() {
  const userId = useUserId();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [matters, setMatters] = useState<ServiceMatterRecord[] | null>(null);
  const [mattersUnavailable, setMattersUnavailable] = useState(false);

  const [stats, setStats] = useState<ClientDashboardStats | null>(null);
  const [statsUnavailable, setStatsUnavailable] = useState(false);

  const [nextAppointment, setNextAppointment] = useState<AppointmentRecord | null>(null);
  const [appointmentsUnavailable, setAppointmentsUnavailable] = useState(false);

  const [compliance, setCompliance] = useState<ComplianceItem[] | null>(null);
  const [complianceUnavailable, setComplianceUnavailable] = useState(false);

  const [activity, setActivity] = useState<DashboardActivityItem[] | null>(null);
  const [activityUnavailable, setActivityUnavailable] = useState(false);

  useEffect(() => {
    if (!userId) return;

    apiService
      .call("getCurrentUser")
      .then((response) => setCurrentUser(response.data?.user ?? response.data))
      .catch((error) => {
        if (error?.response?.status === 401) {
          // Stale/invalid session: the "userId" cookie doesn't match a real
          // backend session, so drop it and send the visitor back to log in.
          Cookies.remove("userId");
          navigate("/");
          return;
        }

        console.error("Failed to load current user:", error);
      });
  }, [userId, navigate]);

  useEffect(() => {
    if (!userId) return;

    getServiceMatter()
      .then((data) => setMatters(data ?? []))
      .catch((error) => {
        console.error("Failed to load service matters:", error);
        setMattersUnavailable(true);
      });

    getClientDashboardStats()
      .then((data) => setStats(data))
      .catch((error) => {
        console.error("Failed to load dashboard stats:", error);
        setStatsUnavailable(true);
      });

    getAppointments({ upcoming: true })
      .then((data) => {
        const sorted = [...(data ?? [])].sort(
          (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        );
        setNextAppointment(sorted[0] ?? null);
      })
      .catch((error) => {
        console.error("Failed to load appointments:", error);
        setAppointmentsUnavailable(true);
      });

    getCompliance()
      .then((data) => {
        const upcoming = (data ?? [])
          .filter((item) => item.status !== "completed")
          .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
          .slice(0, 3);
        setCompliance(upcoming);
      })
      .catch((error) => {
        console.error("Failed to load compliance calendar:", error);
        setComplianceUnavailable(true);
      });

    getClientDashboardActivity()
      .then((data) => setActivity((data ?? []).slice(0, 5)))
      .catch((error) => {
        console.error("Failed to load recent activity:", error);
        setActivityUnavailable(true);
      });
  }, [userId]);

  const statCards = [
    {
      icon: "services" as const,
      value: stats ? String(stats.activeServices) : "—",
      label: "Active services",
      note: !stats
        ? statsUnavailable ? "Not available" : "Loading…"
        : stats.servicesNeedingAction > 0
          ? `${stats.servicesNeedingAction} need${stats.servicesNeedingAction === 1 ? "s" : ""} your attention`
          : "All caught up",
    },
    {
      icon: "compliance" as const,
      value: stats ? String(stats.upcomingCompliance) : "—",
      label: "Upcoming deadlines",
      note: !stats
        ? statsUnavailable ? "Not available" : "Loading…"
        : stats.nextComplianceDueInDays == null
          ? "Nothing due"
          : stats.nextComplianceDueInDays === 0
            ? "Due today"
            : `Next in ${stats.nextComplianceDueInDays} day${stats.nextComplianceDueInDays === 1 ? "" : "s"}`,
    },
    {
      icon: "appointments" as const,
      value: stats ? String(stats.appointmentsBooked) : "—",
      label: "Consultations booked",
      note: !stats
        ? statsUnavailable ? "Not available" : "Loading…"
        : stats.nextAppointmentAt
          ? `${formatRelativeDay(stats.nextAppointmentAt)} · ${formatTime(stats.nextAppointmentAt)}`
          : "None scheduled",
    },
    {
      icon: "documents" as const,
      value: stats ? String(stats.documentsCount) : "—",
      label: "Documents in vault",
      note: !stats
        ? statsUnavailable ? "Not available" : "Loading…"
        : stats.documentsUploadedThisWeek > 0
          ? `${stats.documentsUploadedThisWeek} uploaded this week`
          : "No uploads this week",
    },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>LAWXYGEN CLIENT WORKSPACE</span>
          <h1>{currentUser?.name ? `Welcome back, ${currentUser.name.split(" ")[0]}.` : "Your legal work, in one calm place."}</h1>
          <p>Track services, deadlines, documents and consultations without switching between emails, chats and separate portals.</p>
          <div className={styles.heroActions}>
            <Link to="/services" className={styles.primaryButton}>Explore services <PortalIcon name="arrow" size={15} /></Link>
            <Link to="/services/talk-lawyer" className={styles.secondaryButton}>Talk to an expert <PortalIcon name="arrow" size={15} /></Link>
          </div>
        </div>
        <div className={styles.heroOrb}><div><PortalIcon name="shield" size={30} /></div></div>
      </section>

      <section className={styles.statsGrid}>
        {statCards.map((card) => (
          <article key={card.label} className={styles.statCard}>
            <div className={styles.statTop}><span className={styles.statIcon}><PortalIcon name={card.icon} /></span><span className={styles.statChange}>Live</span></div>
            <div><strong>{card.value}</strong><small style={{display:"block", marginTop:4}}>{card.label}</small></div>
            <small>{card.note}</small>
          </article>
        ))}
      </section>

      <section className={styles.twoCol}>
        <article className={styles.panel}>
          <div className={styles.panelHead}><div className={styles.panelTitle}><strong>My active matters</strong><span>Every service with its current status and next action.</span></div><Link to="/dashboard/services" className={styles.textLink}>View all <PortalIcon name="arrow" size={14}/></Link></div>
          <div className={styles.matterList}>
            {matters && matters.length > 0 && matters.map((matter, i) => {
              const title = matter.service?.title ?? matter.serviceSnapshot?.title ?? "Service matter";
              const note = matter.actionRequired && matter.actionMessage
                ? matter.actionMessage
                : `${matter.currentStepTitle} · Step ${matter.currentStep + 1} of ${matter.totalSteps}`;

              return (
                <div key={matter._id} className={styles.matter}>
                  <span className={styles.matterIndex}>{String(i + 1).padStart(2, "0")}</span>
                  <div className={styles.matterCopy}><strong>{title}</strong><span>{note}</span><div className={styles.progress}><span style={{width:`${matter.progress}%`}} /></div></div>
                  <span className={`${styles.status} ${matter.actionRequired ? styles.statusWarning : ""}`}>{matter.actionRequired ? "Action needed" : formatStatusLabel(matter.status)}</span>
                </div>
              );
            })}
            {matters && matters.length === 0 && (
              <PortalEmptyState icon="services" title="No active matters yet" note="Explore services to get started on your first matter." />
            )}
            {mattersUnavailable && (
              <PortalEmptyState icon="services" title="Not available" note="We couldn't load your matters right now." />
            )}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHead}><div className={styles.panelTitle}><strong>Next consultation</strong><span>Your upcoming expert session.</span></div><PortalIcon name="calendar" size={18}/></div>
          {nextAppointment ? (
            <div className={styles.appointmentCard}>
              <div className={styles.appointmentDate}>
                <div className={styles.dateTile}>
                  <span>{new Date(nextAppointment.scheduledAt).toLocaleDateString(undefined, { month: "short" }).toUpperCase()}</span>
                  <strong>{new Date(nextAppointment.scheduledAt).getDate()}</strong>
                </div>
                <div>
                  <strong>{nextAppointment.topic}</strong>
                  <small>{nextAppointment.professional?.name ?? "LAWXYGEN Expert"} · {modeLabel(nextAppointment.mode)}</small>
                </div>
              </div>
              <div className={styles.appointmentMeta}>
                <div className={styles.metaRow}><PortalIcon name="clock" size={15}/> {formatTime(nextAppointment.scheduledAt)} · {nextAppointment.durationMinutes} minutes</div>
                <div className={styles.metaRow}><PortalIcon name="shield" size={15}/> Secure browser consultation</div>
              </div>
              <div className={styles.appointmentActions}>
                {nextAppointment.joinUrl ? (
                  <a href={nextAppointment.joinUrl} target="_blank" rel="noreferrer" className={styles.joinButton} style={{display:"grid", placeItems:"center", textDecoration:"none"}}>Open appointment</a>
                ) : (
                  <button className={styles.joinButton} disabled style={{opacity:.5, cursor:"not-allowed"}}>Open appointment</button>
                )}
                <button className={styles.rescheduleButton}>Reschedule</button>
              </div>
            </div>
          ) : (
            <PortalEmptyState
              icon="calendar"
              title={appointmentsUnavailable ? "Not available" : "No upcoming consultation"}
              note={appointmentsUnavailable ? "We couldn't load your appointments right now." : "Book a session with an expert to see it here."}
            />
          )}
        </article>
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHead}><div className={styles.panelTitle}><strong>Compliance calendar</strong><span>Deadlines that need visibility.</span></div><Link to="/dashboard/compliance" className={styles.textLink}>Full calendar <PortalIcon name="arrow" size={14}/></Link></div>
          <div className={styles.deadlineList}>
            {compliance && compliance.length > 0 && compliance.map((item) => (
              <div className={styles.deadline} key={item._id}>
                <span className={styles.deadlineIcon}><PortalIcon name="calendar" size={16}/></span>
                <div className={styles.deadlineCopy}><strong>{item.title}</strong><span>{item.description}</span></div>
                <time>{formatShortDate(item.dueAt)}</time>
              </div>
            ))}
            {compliance && compliance.length === 0 && (
              <PortalEmptyState icon="compliance" title="No upcoming deadlines" note="You're all caught up on compliance." />
            )}
            {complianceUnavailable && (
              <PortalEmptyState icon="compliance" title="Not available" note="We couldn't load your compliance calendar." />
            )}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHead}><div className={styles.panelTitle}><strong>Recent activity</strong><span>A clear audit trail of your workspace.</span></div><PortalIcon name="activity" size={18}/></div>
          <div className={styles.activityList}>
            {activity && activity.length > 0 && activity.map((item, i) => (
              <div className={styles.activity} key={`${item.type}-${item.occurredAt}-${i}`}>
                <span className={styles.activityIcon}><PortalIcon name={activityIcon(item.type)} size={16}/></span>
                <div className={styles.activityCopy}><strong>{item.title}</strong><span>{item.description} · {formatRelativeTime(item.occurredAt)}</span></div>
              </div>
            ))}
            {activity && activity.length === 0 && (
              <PortalEmptyState icon="activity" title="No recent activity" note="Updates on your matters will show up here." />
            )}
            {activityUnavailable && (
              <PortalEmptyState icon="activity" title="Not available" note="We couldn't load recent activity." />
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

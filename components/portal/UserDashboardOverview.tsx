import Link from "next/link";
import { PortalIcon } from "./PortalIcons";
import styles from "./PortalOverview.module.css";

const matters = [
  { index: "01", name: "Private Limited Company Registration", note: "Application review · 7 of 10 steps complete", progress: 72, status: "In progress" },
  { index: "02", name: "Trademark Registration", note: "Documents required · upload signed authorisation", progress: 38, status: "Action needed", warning: true },
  { index: "03", name: "GST Registration", note: "Filed successfully · department review", progress: 86, status: "Under review" },
];

export function UserDashboardOverview() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>LAWXYGEN CLIENT WORKSPACE</span>
          <h1>Your legal work, in one calm place.</h1>
          <p>Track services, deadlines, documents and consultations without switching between emails, chats and separate portals.</p>
          <div className={styles.heroActions}>
            <Link href="/services" className={styles.primaryButton}>Explore services <PortalIcon name="arrow" size={15} /></Link>
            <Link href="/services/talk-lawyer" className={styles.secondaryButton}>Talk to an expert <PortalIcon name="arrow" size={15} /></Link>
          </div>
        </div>
        <div className={styles.heroOrb}><div><PortalIcon name="shield" size={30} /></div></div>
      </section>

      <section className={styles.statsGrid}>
        {[
          ["services", "3", "Active services", "1 needs your attention"],
          ["compliance", "2", "Upcoming deadlines", "Next in 6 days"],
          ["appointments", "1", "Consultation booked", "Tomorrow · 11:30 AM"],
          ["documents", "12", "Documents in vault", "2 uploaded this week"],
        ].map(([icon, value, label, note]) => (
          <article key={label} className={styles.statCard}>
            <div className={styles.statTop}><span className={styles.statIcon}><PortalIcon name={icon as any} /></span><span className={styles.statChange}>Live</span></div>
            <div><strong>{value}</strong><small style={{display:"block", marginTop:4}}>{label}</small></div>
            <small>{note}</small>
          </article>
        ))}
      </section>

      <section className={styles.twoCol}>
        <article className={styles.panel}>
          <div className={styles.panelHead}><div className={styles.panelTitle}><strong>My active matters</strong><span>Every service with its current status and next action.</span></div><Link href="/dashboard/services" className={styles.textLink}>View all <PortalIcon name="arrow" size={14}/></Link></div>
          <div className={styles.matterList}>
            {matters.map((matter) => <div key={matter.name} className={styles.matter}>
              <span className={styles.matterIndex}>{matter.index}</span>
              <div className={styles.matterCopy}><strong>{matter.name}</strong><span>{matter.note}</span><div className={styles.progress}><span style={{width:`${matter.progress}%`}} /></div></div>
              <span className={`${styles.status} ${matter.warning ? styles.statusWarning : ""}`}>{matter.status}</span>
            </div>)}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHead}><div className={styles.panelTitle}><strong>Next consultation</strong><span>Your upcoming expert session.</span></div><PortalIcon name="calendar" size={18}/></div>
          <div className={styles.appointmentCard}>
            <div className={styles.appointmentDate}><div className={styles.dateTile}><span>AUG</span><strong>18</strong></div><div><strong>Corporate legal consultation</strong><small>LAWXYGEN Expert · Video consultation</small></div></div>
            <div className={styles.appointmentMeta}><div className={styles.metaRow}><PortalIcon name="clock" size={15}/> 11:30 AM · 30 minutes</div><div className={styles.metaRow}><PortalIcon name="shield" size={15}/> Secure browser consultation</div></div>
            <div className={styles.appointmentActions}><button className={styles.joinButton}>Open appointment</button><button className={styles.rescheduleButton}>Reschedule</button></div>
          </div>
        </article>
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHead}><div className={styles.panelTitle}><strong>Compliance calendar</strong><span>Deadlines that need visibility.</span></div><Link href="/dashboard/compliance" className={styles.textLink}>Full calendar <PortalIcon name="arrow" size={14}/></Link></div>
          <div className={styles.deadlineList}>
            {[
              ["GST return filing", "GSTR-3B · July period", "23 Aug"],
              ["Trademark document", "Authorisation upload requested", "20 Aug"],
              ["Company compliance", "Director KYC reminder", "31 Aug"],
            ].map(([a,b,c]) => <div className={styles.deadline} key={a}><span className={styles.deadlineIcon}><PortalIcon name="calendar" size={16}/></span><div className={styles.deadlineCopy}><strong>{a}</strong><span>{b}</span></div><time>{c}</time></div>)}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHead}><div className={styles.panelTitle}><strong>Recent activity</strong><span>A clear audit trail of your workspace.</span></div><PortalIcon name="activity" size={18}/></div>
          <div className={styles.activityList}>
            {[
              ["documents", "Document verified", "PAN card verified for company registration · 2h ago"],
              ["messages", "New message", "Your assigned expert shared an update · 5h ago"],
              ["check", "GST application filed", "Submission acknowledgement added · Yesterday"],
            ].map(([icon,a,b]) => <div className={styles.activity} key={a}><span className={styles.activityIcon}><PortalIcon name={icon as any} size={16}/></span><div className={styles.activityCopy}><strong>{a}</strong><span>{b}</span></div></div>)}
          </div>
        </article>
      </section>
    </div>
  );
}

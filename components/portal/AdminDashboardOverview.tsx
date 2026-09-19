import Link from "next/link";
import { PortalIcon } from "./PortalIcons";
import styles from "./PortalOverview.module.css";

const requestRows = [
  ["LX-48291", "Private Limited Company", "Aarav Sharma", "Docs review", "12 min ago"],
  ["LX-48290", "Trademark Registration", "Nisha Jain", "Action needed", "24 min ago"],
  ["LX-48288", "GST Registration", "Rohan Mehta", "Assigned", "41 min ago"],
  ["LX-48284", "Online Lawyer Consultation", "Mira Kapoor", "Booked", "1 hr ago"],
];

export function AdminDashboardOverview() {
  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <span className={styles.eyebrow}>LAWXYGEN OPERATIONS</span>
        <h1>Run the platform without losing the details.</h1>
        <p>Requests, users, professionals, appointments and the service catalogue stay visible in one operational workspace.</p>
        <div className={styles.heroActions}><Link href="/admin/requests" className={styles.primaryButton}>Open request queue <PortalIcon name="arrow" size={15}/></Link><Link href="/admin/services" className={styles.secondaryButton}>Manage 259 services <PortalIcon name="arrow" size={15}/></Link></div>
      </div>
      <div className={styles.heroOrb}><div><PortalIcon name="activity" size={30}/></div></div>
    </section>

    <section className={styles.statsGrid}>
      {[
        ["users","1,284","Registered clients","+32 this week"],
        ["requests","146","Active requests","18 unassigned"],
        ["appointments","27","Appointments today","7 upcoming"],
        ["services","259","Published services","10 categories"],
      ].map(([icon,value,label,note]) => <article key={label} className={styles.statCard}><div className={styles.statTop}><span className={styles.statIcon}><PortalIcon name={icon as any}/></span><span className={styles.statChange}>Live</span></div><div><strong>{value}</strong><small style={{display:"block", marginTop:4}}>{label}</small></div><small>{note}</small></article>)}
    </section>

    <section className={styles.twoCol}>
      <article className={styles.panel}>
        <div className={styles.panelHead}><div className={styles.panelTitle}><strong>Request operations</strong><span>Latest service activity across LAWXYGEN.</span></div><Link href="/admin/requests" className={styles.textLink}>Open queue <PortalIcon name="arrow" size={14}/></Link></div>
        <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Request</th><th>Service</th><th>Client</th><th>Status</th><th>Updated</th></tr></thead><tbody>{requestRows.map((row,index)=><tr key={row[0]}><td><strong>{row[0]}</strong></td><td>{row[1]}</td><td>{row[2]}</td><td><span className={`${styles.dotStatus} ${index===1?styles.dotAmber:""}`}>{row[3]}</span></td><td>{row[4]}</td></tr>)}</tbody></table></div>
      </article>

      <article className={styles.panel}>
        <div className={styles.panelHead}><div className={styles.panelTitle}><strong>Weekly workload</strong><span>New requests by day.</span></div><span className={styles.statChange}>+12.4%</span></div>
        <div className={styles.barChart}>{[[55,"M"],[72,"T"],[46,"W"],[84,"T"],[68,"F"],[42,"S"],[60,"S"]].map(([h,l])=><div className={styles.bar} key={l as string} style={{height:`${h}%`}}><span>{l}</span></div>)}</div>
      </article>
    </section>

    <section className={styles.bottomGrid}>
      <article className={styles.panel}><div className={styles.panelHead}><div className={styles.panelTitle}><strong>Needs attention</strong><span>Items that can block client progress.</span></div><PortalIcon name="bell" size={18}/></div><div className={styles.deadlineList}>{[
        ["18 unassigned requests","Assign an owner to keep SLA healthy","Now"],
        ["7 document reviews pending","Verification queue requires action","Today"],
        ["3 professionals unavailable","Consultation capacity reduced","Today"],
      ].map(([a,b,c])=><div className={styles.deadline} key={a}><span className={styles.deadlineIcon}><PortalIcon name="activity" size={16}/></span><div className={styles.deadlineCopy}><strong>{a}</strong><span>{b}</span></div><time>{c}</time></div>)}</div></article>
      <article className={styles.panel}><div className={styles.panelHead}><div className={styles.panelTitle}><strong>Platform pulse</strong><span>Operational health at a glance.</span></div><span className={styles.statChange}>Healthy</span></div><div className={styles.activityList}>{[
        ["check","Service catalogue","259 service routes published"],
        ["shield","Client workspace","Authentication integration pending"],
        ["support","Support queue","5 conversations waiting"],
      ].map(([i,a,b])=><div className={styles.activity} key={a}><span className={styles.activityIcon}><PortalIcon name={i as any} size={16}/></span><div className={styles.activityCopy}><strong>{a}</strong><span>{b}</span></div></div>)}</div></article>
    </section>
  </div>;
}

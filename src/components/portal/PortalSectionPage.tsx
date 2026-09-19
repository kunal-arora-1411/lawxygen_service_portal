import Link from "next/link";
import { PortalIcon, PortalIconName } from "./PortalIcons";
import styles from "./PortalSectionPage.module.css";

type Metric = { label: string; value: string; note: string; icon: PortalIconName };
type Row = { title: string; subtitle: string; meta: string; status: string; tone?: "good" | "warn" | "neutral" };

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  metrics: Metric[];
  rows: Row[];
  primaryLabel?: string;
  primaryHref?: string;
};

export function PortalSectionPage({ eyebrow, title, description, metrics, rows, primaryLabel, primaryHref }: Props) {
  return <div className={styles.page}>
    <section className={styles.head}>
      <div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
      {primaryLabel && primaryHref ? <Link href={primaryHref} className={styles.primary}>{primaryLabel}<PortalIcon name="arrow" size={15}/></Link> : null}
    </section>
    <section className={styles.metrics}>{metrics.map((item)=><article key={item.label}><i><PortalIcon name={item.icon}/></i><div><strong>{item.value}</strong><span>{item.label}</span><small>{item.note}</small></div></article>)}</section>
    <section className={styles.panel}>
      <div className={styles.panelHead}><div><strong>Workspace</strong><span>Everything relevant to this section.</span></div><label><PortalIcon name="search" size={15}/><input placeholder="Search" /></label></div>
      <div className={styles.rows}>{rows.map((row,index)=><div className={styles.row} key={`${row.title}-${index}`}><span className={styles.index}>{String(index+1).padStart(2,"0")}</span><div className={styles.copy}><strong>{row.title}</strong><span>{row.subtitle}</span></div><span className={styles.meta}>{row.meta}</span><span className={`${styles.status} ${row.tone === "warn" ? styles.warn : row.tone === "good" ? styles.good : ""}`}>{row.status}</span><button aria-label={`Open ${row.title}`}><PortalIcon name="arrow" size={15}/></button></div>)}</div>
    </section>
  </div>;
}

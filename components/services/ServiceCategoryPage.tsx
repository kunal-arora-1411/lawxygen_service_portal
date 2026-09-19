import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { serviceCatalog } from "@/data/serviceCatalog";
import { serviceHref } from "@/lib/serviceRoutes";
import styles from "./ServiceCategoryPage.module.css";

export function ServiceCategoryPage({ slug }:{slug:string}){
 const group=serviceCatalog.find(x=>x.slug===slug) ?? serviceCatalog[0];
 return <><Header/><main className={styles.page}><div className={styles.wrap}><div className={styles.crumb}><Link href="/">Home</Link><span>•</span><Link href="/services">Services</Link><span>•</span><b>{group.label}</b></div><section className={styles.hero}><span>{group.label} · LAWXYGEN</span><h1>Explore {group.label.toLowerCase()}.</h1><p>Browse the services in this category and open the detailed LAWXYGEN service page for the workflow, preparation checklist and expert path.</p></section><section className={styles.list}><div className={styles.listHead}><span>Service catalogue</span><strong>{group.services.length} services</strong></div><div className={styles.grid}>{group.services.map((s,i)=><Link href={serviceHref(group.slug,s)} key={s}><small>{String(i+1).padStart(2,'0')}</small><span>{s}</span><b>↗</b></Link>)}</div></section></div></main><Footer/></>;
}

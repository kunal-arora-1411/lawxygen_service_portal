import Link from "next/link";
import type { CSSProperties } from "react";
import { serviceCatalog } from "@/data/serviceCatalog";
import styles from "./ServicePageExperience.module.css";

type ServiceProps = {
  category: string;
  categorySlug: string;
  accent: string;
  title: string;
  serviceSlug: string;
  pageIndex: number;
};

type Mode = "editorial" | "timeline" | "split" | "grid" | "spotlight" | "tool";

const modeNames: Mode[] = ["editorial", "timeline", "split", "grid", "spotlight", "tool"];

const serviceKeywords: Record<string, string> = {
  "Registration": "setup and registration",
  "Filing": "filing and compliance support",
  "Application": "application support",
  "Advisory": "expert advisory support",
  "Consultation": "specialist consultation",
  "Agreement": "document drafting and review",
  "Drafting": "professional drafting",
  "Calculator": "guided calculation",
  "Search": "search and assessment",
  "Renewal": "renewal support",
  "Audit": "review and audit support",
  "Certificate": "certificate and application support",
  "License": "licence and regulatory support",
  "Dispute": "dispute support",
};

function pickMode(title: string, pageIndex: number): Mode {
  if (/Calculator|Finder|Tool$/i.test(title)) return "tool";
  return modeNames[pageIndex % modeNames.length];
}

function describe(title: string, category: string) {
  const key = Object.keys(serviceKeywords).find((k) => title.includes(k));
  const serviceType = key ? serviceKeywords[key] : "structured professional support";
  return `${title} is presented through a clear, guided LAWXYGEN workflow with practical next actions, document readiness, process visibility and expert support. The service experience is designed around ${serviceType} for ${category.toLowerCase()} needs.`;
}

function servicePath(categorySlug: string, service: string) {
  return `/services/${categorySlug}/${service.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

function related(categorySlug: string, title: string) {
  const group = serviceCatalog.find((g) => g.slug === categorySlug) ?? serviceCatalog[0];
  return group.services.filter((item) => item !== title).slice(0, 5).map((item) => ({
    title: item,
    href: servicePath(categorySlug, item),
  }));
}

function Documents({ title, category }: { title: string; category: string }) {
  const docs = [
    "Identity and contact details relevant to the applicant or business",
    "Service-specific supporting records and existing registrations, where applicable",
    "Address or establishment proof when the service requires it",
    "Authorisations, declarations or signed documents requested during the workflow",
  ];
  return <div className={styles.documentGrid}>{docs.map((item, i) => <div className={styles.document} key={item}><span>0{i + 1}</span><strong>{item}</strong><p>Final requirements can vary by case and are confirmed before filing or submission.</p></div>)}</div>;
}

function FAQ({ title }: { title: string }) {
  const qs = [
    `What is ${title}?`,
    `Who should consider ${title}?`,
    `What information should I keep ready?`,
    `Can LAWXYGEN help me through the complete process?`,
  ];
  return <div className={styles.faqList}>{qs.map((q) => <details key={q}><summary>{q}</summary><p>LAWXYGEN can explain the workflow, help organise the required information and route you to the appropriate professional support where the service requires a filing, review or consultation.</p></details>)}</div>;
}

export function ServicePageExperience({ category, categorySlug, accent, title, serviceSlug, pageIndex }: ServiceProps) {
  const mode = pickMode(title, pageIndex);
  const relatedItems = related(categorySlug, title);
  const intro = describe(title, category);
  const steps = [
    "Understand the requirement and confirm the appropriate service path",
    "Collect the relevant information and supporting documents",
    "Prepare, review and validate the submission-ready details",
    "Complete the applicable filing, registration, drafting or review step",
    "Track follow-up actions and keep the next compliance or legal step visible",
  ];

  return <main className={`${styles.page} ${styles[mode]}`} style={{ ["--accent" as string]: accent } as CSSProperties}>
    <div className={styles.ambient} />
    <div className={styles.shell}>
      <div className={styles.breadcrumb}><Link href="/">Home</Link><span>/</span><Link href="/services">Services</Link><span>/</span><span>{category}</span></div>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span style={{ background: accent }} />{category}</div>
          <h1>{title}</h1>
          <p>{intro}</p>
          <div className={styles.heroActions}>
            <Link className={styles.primary} href="#start">Get started <span>↗</span></Link>
            <Link className={styles.secondary} href="#process">See process</Link>
          </div>
          <div className={styles.metaLine}><span>LAWXYGEN SERVICE DESK</span><span>Online support</span><span>Expert assistance available</span></div>
        </div>
        <div className={styles.workspace} id="start">
          <div className={styles.workspaceTop}><span>REGISTER + DASHBOARD</span><b>{String((pageIndex % 99) + 1).padStart(2, "0")}</b></div>
          <h2>Your next action, organised.</h2>
          <div className={styles.status}><span>Service</span><strong>{title}</strong></div>
          <div className={styles.status}><span>Status</span><strong>Ready to start</strong></div>
          <div className={styles.status}><span>Next</span><strong>Review requirements</strong></div>
          <button className={styles.deskButton}>Login to track service</button>
        </div>
      </section>

      <nav className={styles.pageNav} aria-label="Service sections"><a href="#overview">Overview</a><a href="#eligibility">Eligibility</a><a href="#documents">Documents</a><a href="#process">Process</a><a href="#faq">FAQ</a></nav>

      <section className={styles.section} id="overview">
        <div className={styles.sectionLead}><span>01</span><h2>What this service covers</h2></div>
        <div className={styles.overviewGrid}><div><p className={styles.lead}>{intro}</p><p>Good service delivery starts with clarity. This page keeps the most important information close to the action so users can understand the requirement before they begin.</p></div><div className={styles.factPanel}><div><span>Category</span><strong>{category}</strong></div><div><span>Service mode</span><strong>Online workflow</strong></div><div><span>Support</span><strong>Expert assisted</strong></div></div></div>
      </section>

      <section className={styles.section} id="eligibility">
        <div className={styles.sectionLead}><span>02</span><h2>Eligibility & readiness</h2></div>
        <div className={styles.checkList}>{[
          "The request matches the service scope",
          "Applicant or business details are available",
          "Required records can be provided when requested",
          "Any required authorisation is available before submission",
        ].map((x, i) => <div className={styles.check} key={x}><span>{i < 9 ? `0${i + 1}` : i + 1}</span><strong>{x}</strong><em>Check</em></div>)}</div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLead}><span>03</span><h2>Expert walkthrough</h2></div>
        <div className={styles.videoCard}><div className={styles.videoGlyph}>▶</div><div><span>LAWXYGEN EXPERT TUTORIAL</span><h3>Understand the service before you submit.</h3><p>A dedicated tutorial slot is ready for a future LAWXYGEN expert video covering this service from the first question to the final next step.</p></div><button type="button">Watch when available</button></div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLead}><span>04</span><h2>Benefits at a glance</h2></div>
        <div className={styles.benefitGrid}>{[
          ["Clarity","Know what happens next"],["Structure","Keep information in the right order"],["Support","Get routed to the right professional"],["Visibility","See progress and pending actions"],
        ].map(([a,b],i)=><article className={styles.benefit} key={a}><span>0{i+1}</span><strong>{a}</strong><p>{b}</p></article>)}</div>
      </section>

      <section className={styles.section} id="documents">
        <div className={styles.sectionLead}><span>05</span><h2>Documents & information</h2></div>
        <Documents title={title} category={category}/>
      </section>

      <section className={styles.section} id="process">
        <div className={styles.sectionLead}><span>06</span><h2>How the process works</h2></div>
        <div className={styles.process}>{steps.map((step,i)=><div className={styles.processStep} key={step}><span>{String(i+1).padStart(2,"0")}</span><div><strong>{step}</strong><p>LAWXYGEN keeps this stage focused so the user can complete one clear action at a time.</p></div></div>)}</div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLead}><span>07</span><h2>Pricing & next step</h2></div>
        <div className={styles.pricing}><div><span>LAWXYGEN SERVICE</span><h3>Simple start. Clear scope.</h3><p>Final professional fees, government charges and case-specific costs should be confirmed against the approved LAWXYGEN pricing for this service.</p></div><div className={styles.priceCard}><small>Quote</small><strong>Request pricing</strong><Link href="#start">Get a service quote ↗</Link></div></div>
      </section>

      <section className={styles.relatedSection}><div><span className={styles.kicker}>EXPLORE MORE</span><h2>Related LAWXYGEN services</h2></div><div className={styles.relatedRow}>{relatedItems.map((item)=><Link key={item.title} href={item.href}><span>{item.title}</span><b>↗</b></Link>)}</div></section>

      <section className={styles.help}><div><span className={styles.kicker}>NEED HELP?</span><h2>Talk to the right expert before you proceed.</h2><p>Tell us what you need and LAWXYGEN can guide you to the appropriate service or professional.</p></div><Link className={styles.primary} href="/services/talk-lawyer">Talk to an expert <span>↗</span></Link></section>

      <section className={styles.section} id="faq"><div className={styles.sectionLead}><span>08</span><h2>Frequently asked questions</h2></div><FAQ title={title}/></section>

      <footer className={styles.serviceFooter}><div><strong>LAWXYGEN</strong><span>Legal, tax & business services</span></div><Link href="/services">Browse all services ↗</Link></footer>
    </div>
  </main>;
}

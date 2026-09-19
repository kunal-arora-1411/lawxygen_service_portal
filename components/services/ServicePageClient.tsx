"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./ServicePageClient.module.css";
import { serviceHref } from "@/lib/serviceRoutes";

type ServiceData = {
  title: string;
  category: string;
  categorySlug: string;
  accent: string;
  intro: string;
  overview: string[];
  eligibility: string[];
  tutorial: string;
  benefits: string[];
  documents: string[];
  process: string[];
  pricing: string;
  faqs: { q: string; a: string }[];
  related: string[];
  routeLabel: string;
};

const layouts = ["editorial", "split", "rail", "timeline", "stack", "signal"] as const;
const tones = ["blue", "mint", "violet", "amber", "cyan", "rose"] as const;

export function ServicePageClient({ data }: { data: ServiceData }) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const variant = useMemo(() => {
    const seed = data.title.length + data.title.charCodeAt(0);
    return { layout: layouts[seed % layouts.length], tone: tones[seed % tones.length] };
  }, [data.title]);

  return (
    <div className={`${styles.page} ${styles[variant.layout]} ${styles[variant.tone]}`} style={{ "--accent": data.accent } as React.CSSProperties}>
      <header className={styles.utilityBar}>
        <div className={styles.container}>
          <Link href="/services">All services</Link>
          <span>{data.category}</span>
          <span className={styles.route}>{data.routeLabel}</span>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className={styles.container}>
            <div className={styles.breadcrumbs}><Link href="/">Home</Link><span>/</span><Link href="/services">Services</Link><span>/</span><span>{data.category}</span></div>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <span className={styles.kicker}>{data.category}</span>
                <h1>{data.title}</h1>
                <p>{data.intro}</p>
                <div className={styles.heroActions}>
                  <Link className={styles.primary} href={`/login?service=${encodeURIComponent(data.title)}`}>Start this service <span>↗</span></Link>
                  <a className={styles.secondary} href="#process">See process <span>↓</span></a>
                </div>
              </div>
              <aside className={styles.workspace}>
                <div className={styles.workspaceHeader}><span>LAWXYGEN SERVICE DESK</span><strong>01</strong></div>
                <div className={styles.workspaceTitle}>Your route, organised.</div>
                <div className={styles.stat}><span>Service</span><b>{data.title}</b></div>
                <div className={styles.stat}><span>Status</span><b>Ready to begin</b></div>
                <div className={styles.stat}><span>Next step</span><b>Review requirements</b></div>
                <Link className={styles.workspaceCta} href={`/login?service=${encodeURIComponent(data.title)}`}>Log in / sign up <span>→</span></Link>
              </aside>
            </div>
          </div>
        </section>

        <nav className={styles.index} aria-label="Service navigation">
          {[["overview","Overview"],["eligibility","Eligibility"],["tutorial","Expert tutorial"],["benefits","Benefits"],["documents","Documents"],["process","Process"],["pricing","Pricing"],["related","Related"],["expert","Expert help"],["faqs","FAQs"]].map(([id,label], i) => <a key={id} href={`#${id}`}><span>{String(i+1).padStart(2,"0")}</span>{label}</a>)}
        </nav>

        <section className={`${styles.section} ${styles.overviewSection}`} id="overview">
          <div className={styles.container}>
            <div className={styles.sectionLead}><span>01 · OVERVIEW</span><h2>Understand the route before you start.</h2></div>
            <div className={styles.overviewGrid}>
              {data.overview.map((item) => <p key={item}>{item}</p>)}
              <div className={styles.note}><small>LAWXYGEN APPROACH</small><strong>Useful information first. Clear action next.</strong><span>We keep the page focused on what helps the user decide what to do next.</span></div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="eligibility">
          <div className={styles.container}>
            <div className={styles.sectionLead}><span>02 · ELIGIBILITY</span><h2>Check the essentials.</h2></div>
            <div className={styles.eligibilityGrid}>{data.eligibility.map((item, i) => <article key={item}><span>{String(i+1).padStart(2,"0")}</span><p>{item}</p></article>)}</div>
          </div>
        </section>

        <section className={styles.section} id="tutorial">
          <div className={styles.container}>
            <div className={styles.videoCard}>
              <div><span className={styles.sectionEyebrow}>03 · EXPERT TUTORIAL</span><h2>See the service explained simply.</h2><p>{data.tutorial}</p></div>
              <button className={styles.play} type="button" aria-label="Play expert tutorial">▶</button>
            </div>
          </div>
        </section>

        <section className={styles.section} id="benefits">
          <div className={styles.container}>
            <div className={styles.sectionLead}><span>04 · BENEFITS</span><h2>What this service helps you achieve.</h2></div>
            <div className={styles.benefitGrid}>{data.benefits.map((item, i) => <article key={item}><div className={styles.benefitNumber}>{String(i+1).padStart(2,"0")}</div><div><h3>{item}</h3><p>Designed to keep the requirement easier to understand and manage.</p></div></article>)}</div>
          </div>
        </section>

        <section className={styles.section} id="documents">
          <div className={styles.container}>
            <div className={styles.sectionLead}><span>05 · DOCUMENTS</span><h2>Keep the required information ready.</h2></div>
            <div className={styles.documentList}>{data.documents.map((item, i) => <div key={item}><span>{String(i+1).padStart(2,"0")}</span><strong>{item}</strong><b>✓</b></div>)}</div>
          </div>
        </section>

        <section className={styles.section} id="process">
          <div className={styles.container}>
            <div className={styles.sectionLead}><span>06 · PROCESS</span><h2>A clear path from requirement to completion.</h2></div>
            <div className={styles.processTrack}>{data.process.map((item, i) => <article key={item}><div className={styles.processDot}>{String(i+1).padStart(2,"0")}</div><div><h3>{item}</h3><p>LAWXYGEN keeps this stage focused, with the next action visible before you continue.</p></div></article>)}</div>
          </div>
        </section>

        <section className={styles.section} id="pricing">
          <div className={styles.container}>
            <div className={styles.pricingCard}><div><span className={styles.sectionEyebrow}>07 · PRICING</span><h2>Clear pricing, without the clutter.</h2><p>{data.pricing}</p></div><Link className={styles.primary} href={`/login?service=${encodeURIComponent(data.title)}`}>Get started <span>↗</span></Link></div>
          </div>
        </section>

        <section className={styles.section} id="related">
          <div className={styles.container}>
            <div className={styles.sectionLead}><span>08 · RELATED SERVICES</span><h2>Keep the rest of the journey nearby.</h2></div>
            <div className={styles.relatedRail}>{data.related.map((item) => <Link key={item} href={serviceHref(data.categorySlug, item)}><small>{data.category}</small><strong>{item}</strong><span>View service →</span></Link>)}</div>
          </div>
        </section>

        <section className={styles.section} id="expert">
          <div className={styles.container}>
            <div className={styles.expertCard}><div><span className={styles.sectionEyebrow}>09 · TALK TO AN EXPERT</span><h2>Need a human opinion?</h2><p>Connect with the relevant LAWXYGEN professional when your requirement needs personal guidance.</p></div><Link className={styles.primary} href="/services/talk-lawyer/online-lawyer-consultation">Talk to an expert <span>→</span></Link></div>
          </div>
        </section>

        <section className={styles.section} id="faqs">
          <div className={styles.container}>
            <div className={styles.sectionLead}><span>10 · FAQs</span><h2>Quick answers before you begin.</h2></div>
            <div className={styles.faqList}>{data.faqs.map((item, i) => <div key={item.q} className={`${styles.faqItem} ${activeFaq === i ? styles.open : ""}`}><button type="button" onClick={() => setActiveFaq(activeFaq === i ? null : i)}><span>{String(i+1).padStart(2,"0")}</span><strong>{item.q}</strong><b>{activeFaq === i ? "−" : "+"}</b></button>{activeFaq === i && <p>{item.a}</p>}</div>)}</div>
          </div>
        </section>
      </main>

      <footer className={styles.miniFooter}><div className={styles.container}><span>LAWXYGEN</span><span>Professional legal, tax & business services</span><Link href="/">Back to home ↗</Link></div></footer>
    </div>
  );
}

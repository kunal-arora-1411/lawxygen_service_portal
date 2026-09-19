import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import styles from "./ServiceDetail.module.css";

type Props = {
  title: string;
  category: string;
  categorySlug: string;
  slug: string;
  accent: string;
  kind: string;
  index: number;
  intro: string;
  outcomes: string[];
  steps: string[];
  docs: string[];
  faq: string[];
  focus: string;
  bestFor: string;
  startingPoint: string;
  related: { title: string; href: string }[];
};

const kindLabels: Record<string, string> = {
  registration: "Registration",
  compliance: "Compliance",
  documentation: "Documentation",
  ip: "Intellectual Property",
  tool: "Digital Tool",
  advisory: "Professional Guidance",
  finance: "Finance & Operations",
  service: "Professional Service",
};

function SectionHead({ number, kicker, title, intro }: { number: string; kicker: string; title: string; intro?: string }) {
  return (
    <div className={styles.sectionHead}>
      <span className={styles.sectionNumber}>{number}</span>
      <div>
        <p className={styles.kicker}>{kicker}</p>
        <h2>{title}</h2>
        {intro ? <p className={styles.sectionIntro}>{intro}</p> : null}
      </div>
    </div>
  );
}

function getFaqAnswer(question: string, title: string, kind: string, startingPoint: string) {
  const q = question.toLowerCase();
  if (kind === "tool") {
    if (q.includes("input")) return "Keep the figures, dates or reference details shown by the tool ready. Enter only information you can verify so the result remains useful for planning.";
    if (q.includes("final professional") || q.includes("advice")) return "A calculator or finder can support planning, but it does not replace case-specific professional advice. Use the result as a starting point when the matter needs judgement.";
    return `Use ${title} as a focused first step. ${startingPoint}`;
  }
  if (q.includes("document") || q.includes("keep ready") || q.includes("information")) return "Start with identity, entity, address, transaction or supporting records that are relevant to the matter. The exact checklist should be confirmed before submission or finalisation.";
  if (q.includes("online")) return "The LAWXYGEN workflow is designed to keep information, review points and next actions together online, while professional or government-facing steps are completed through the applicable process.";
  if (q.includes("professional") || q.includes("lawyer") || q.includes("expert")) return "You can move from guided preparation to a professional review whenever the matter involves judgement, objections, negotiation, dispute handling or another case-specific decision.";
  return `${title} is best approached in stages. LAWXYGEN keeps the scope, preparation and next action visible so you can move forward with fewer loose ends.`;
}

export function ServiceDetail({ title, category, categorySlug, slug, kind, index, intro, outcomes, steps, docs, faq, focus, bestFor, startingPoint, accent, related }: Props) {
  const serviceLabel = kindLabels[kind] || "Professional Service";
  const longPage = outcomes.length + steps.length + docs.length + faq.length >= 17;

  return (
    <div className={styles.site} style={{ ["--service-accent" as string]: accent }}>
      <Header />
      <main className={styles.page}>
        <div className={styles.ambient} />
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link><span>/</span><Link href="/services">Services</Link><span>/</span><Link href={`/services/${categorySlug}`}>{category}</Link><span>/</span><span>{title}</span>
          </div>

          <section className={styles.hero} aria-labelledby="service-title">
            <div className={styles.heroCopy}>
              <div className={styles.heroMeta}><span className={styles.dot} />{category}<span className={styles.metaDivider}>·</span>{serviceLabel}<span className={styles.metaIndex}>#{String(index).padStart(3, "0")}</span></div>
              <p className={styles.serviceLabel}>LAWXYGEN SERVICE</p>
              <h1 id="service-title">{title}</h1>
              <p className={styles.heroIntro}>{intro}</p>
              <div className={styles.heroActions}>
                <Link href="/login" className={styles.primaryAction}>Start this service <span>↗</span></Link>
                <a href="#process" className={styles.secondaryAction}>See how it works</a>
              </div>
              <div className={styles.heroSignals}>
                <span>Clear next steps</span><span>Document-ready workflow</span><span>Expert help when needed</span>
              </div>
            </div>

            <aside className={styles.serviceCard} id="start">
              <div className={styles.cardAccent} />
              <div className={styles.cardHeader}><span>LAWXYGEN SERVICE DESK</span><b>{serviceLabel}</b></div>
              <div className={styles.cardTitle}>{kind === "tool" ? "Get the result. Understand what it means." : "Know what happens next before you begin."}</div>
              <div className={styles.cardRows}>
                <div><span>Service</span><strong>{title}</strong></div>
                <div><span>Best for</span><strong>{bestFor}</strong></div>
                <div><span>Starting point</span><strong>{startingPoint}</strong></div>
              </div>
              <Link href="/login" className={styles.cardCta}>Sign in to save progress <span>→</span></Link>
            </aside>
          </section>

          <nav className={styles.localNav} aria-label="Service sections">
            <a href="#overview">Overview</a><a href="#readiness">Readiness</a><a href="#benefits">Benefits</a><a href="#documents">Documents</a><a href="#process">Process</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a>
          </nav>

          <section id="overview" className={styles.section}>
            <SectionHead number="01" kicker="OVERVIEW" title={kind === "tool" ? "What this tool helps you understand" : `What ${title} is designed to do`} intro={focus} />
            <div className={styles.overviewGrid}>
              <article className={styles.featurePanel}><p>{startingPoint}</p><div className={styles.featureFoot}><span>LAWXYGEN approach</span><strong>Simple information. Clear next action.</strong></div></article>
              <div className={styles.metricGrid}><div><small>Service family</small><strong>{category}</strong></div><div><small>Ideal for</small><strong>{bestFor}</strong></div><div><small>Workflow style</small><strong>{serviceLabel}</strong></div><div><small>Support</small><strong>Human expert available</strong></div></div>
            </div>
          </section>

          <section id="readiness" className={`${styles.section} ${styles.softSection}`}>
            <SectionHead number="02" kicker={kind === "compliance" ? "CHECK BEFORE FILING" : "READY TO START"} title="Get the important pieces ready" intro="A good starting checklist removes avoidable back-and-forth and helps the next stage move faster." />
            <div className={styles.checkGrid}>{outcomes.map((item, i) => <div className={styles.checkItem} key={item}><span>{String(i + 1).padStart(2, "0")}</span><div><strong>{item}</strong><p>{i === 0 ? `Begin with the core requirement for ${title.toLowerCase()}.` : i === 1 ? "Keep the relevant records in one place so they are easy to review." : i === 2 ? "Use a visible milestone to know when the next stage is ready." : "Escalate to the right professional when the matter becomes case-specific."}</p></div></div>)}</div>
          </section>

          <section className={styles.storyBand}>
            <div><p className={styles.kicker}>GOOD TO KNOW</p><h2>{longPage ? "More detail, without making the page harder to use." : "The essentials, without the clutter."}</h2></div>
            <p>We keep the page structured around decisions, preparation and next actions. That makes a long or unfamiliar service easier to scan on desktop and mobile without turning every section into a wall of text.</p>
          </section>

          <section className={styles.section}>
            <SectionHead number="03" kicker="EXPERT GUIDANCE" title="Learn the service before you act" intro="A future expert video can sit here; the surrounding copy already gives users a useful path to follow." />
            <div className={styles.videoCard}><div className={styles.videoIcon}>▶</div><div><p className={styles.kicker}>EXPERT WALKTHROUGH</p><h3>A focused guide for {title}</h3><p>Use this space for an approved LAWXYGEN expert walkthrough covering the key preparation points, common mistakes and what the user should expect next.</p></div><button type="button">Video coming soon</button></div>
          </section>

          <section id="benefits" className={styles.section}>
            <SectionHead number="04" kicker="BENEFITS" title="Why users choose a guided workflow" />
            <div className={styles.benefitGrid}>{outcomes.map((item, i) => <article key={item}><span>{String(i + 1).padStart(2, "0")}</span><h3>{item}</h3><p>{i === 0 ? "Start with a defined scope instead of guessing which route applies." : i === 1 ? "Reduce friction by keeping the required information organised." : i === 2 ? "Make progress visible so the next action is always easy to identify." : "Move to specialist review when a matter needs professional judgement."}</p></article>)}</div>
          </section>

          <section id="documents" className={`${styles.section} ${styles.softSection}`}>
            <SectionHead number="05" kicker="DOCUMENTS & INFORMATION" title="What you may need to keep nearby" intro="The exact checklist varies by case. The goal here is to prepare the information most likely to be requested at the next step." />
            <div className={styles.documentGrid}>{docs.map((item, i) => <article key={item}><div className={styles.documentIndex}>{String(i + 1).padStart(2, "0")}</div><div><h3>{item}</h3><p>Keep a current copy available for review when this item is relevant to your matter.</p></div></article>)}</div>
          </section>

          <section id="process" className={styles.section}>
            <SectionHead number="06" kicker="PROCESS" title={kind === "tool" ? "From input to a useful result" : "A practical path from request to completion"} intro="The exact government, registry or professional workflow depends on the service. LAWXYGEN keeps the user-facing journey simple and predictable." />
            <div className={styles.processGrid}>{steps.map((step, i) => <article key={step}><div className={styles.processIndex}>{String(i + 1).padStart(2, "0")}</div><div><h3>{step}</h3><p>{i === steps.length - 1 ? "Close the loop by reviewing the result, tracking follow-up items and knowing where to go next." : "Complete this stage, check the information and continue only when the next action is clear."}</p></div></article>)}</div>
          </section>

          <section id="pricing" className={styles.pricingSection}>
            <div><p className={styles.kicker}>PRICING</p><h2>See the right price for your requirement.</h2><p>Publish LAWXYGEN's approved service fee, applicable government charges and any optional professional work here. Until those figures are final, users can request a quote without seeing invented prices.</p></div>
            <Link href="/login" className={styles.priceCta}>Request a quote <span>↗</span></Link>
          </section>

          <section className={styles.relatedSection}>
            <div className={styles.sectionMini}><p className={styles.kicker}>KEEP EXPLORING</p><h2>Related LAWXYGEN services</h2></div>
            <div className={styles.relatedGrid}>{related.slice(0, 6).map((item) => <Link key={item.href} href={item.href}><span>{item.title}</span><b>↗</b></Link>)}</div>
          </section>

          <section className={styles.helpSection}>
            <div><p className={styles.kicker}>NEED HELP?</p><h2>Not sure what to do next?</h2><p>Start with the guided information above. When the issue involves a document review, negotiation, objection, dispute or another case-specific decision, move to a LAWXYGEN professional.</p></div>
            <div className={styles.helpActions}><Link href="/login" className={styles.primaryAction}>Talk to an expert <span>↗</span></Link><Link href="/login" className={styles.ghostAction}>Save this service</Link></div>
          </section>

          <section id="faq" className={styles.section}>
            <SectionHead number="07" kicker="FAQ" title="Frequently asked questions" />
            <div className={styles.faq}>{faq.map((question) => <details key={question}><summary>{question}<span>+</span></summary><p>{getFaqAnswer(question, title, kind, startingPoint)}</p></details>)}</div>
          </section>

          <div className={styles.footerBar}><span>LAWXYGEN · {category}</span><Link href="/services">Browse all services ↗</Link></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import type { CSSProperties, ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { serviceCatalog } from "@/data/serviceCatalog";
import { categoryHref, serviceHref } from "@/lib/serviceRoutes";
import styles from "./ServicePageShell.module.css";

type ServicePageShellProps = {
  title: string;
  category: string;
  categorySlug: string;
  accent: string;
  pageClassName?: string;
};

const sectionNames = [
  "Overview",
  "Eligibility",
  "Expert guidance",
  "Benefits",
  "Documents",
  "Process",
  "Pricing",
  "Related services",
  "Talk to an expert",
  "FAQs",
];

const categoryDescriptions: Record<string, string> = {
  "Business Setup": "Build the right legal foundation for your business with a clear, guided service journey.",
  "Tax & Compliance": "Stay organised across registrations, returns, filings and recurring compliance work.",
  "Intellectual Property": "Protect and manage the brand, creative work and intellectual property you are building.",
  "Documentation": "Put important agreements, policies and business documents into a clear, usable structure.",
  "Specialized Services": "Handle specialist business requirements through one focused service experience.",
  "Talk to a Lawyer": "Connect with legal support for business, agreements, disputes and other legal matters.",
  "Talk to a CA": "Get accounting, taxation and financial compliance support from a qualified professional.",
  "Talk to a CS": "Get corporate governance, ROC and company secretarial support when you need it.",
  "Talk to an IP Lawyer": "Get specialist guidance for trademarks, copyright, designs and related IP matters.",
  Certifications: "Manage certifications, permissions and related business requirements with clear guidance.",
};

function titleCaseSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function makeParagraph(title: string, category: string) {
  const summary = categoryDescriptions[category] ?? "A focused LAWXYGEN service journey with clear requirements, next steps and expert support.";
  return `${summary} ${title} is presented with the key information users need before they start, so the journey feels clear rather than overwhelming.`;
}

function getServiceMeta(title: string, category: string) {
  const base = {
    overview: makeParagraph(title, category),
    eligibility: [
      "Confirm the requirement and the relevant applicant or business type.",
      "Keep the required information and supporting records ready.",
      "Review the service-specific conditions before submitting anything.",
    ],
    documents: [
      "Identity and contact details",
      "Relevant business or applicant information",
      "Supporting records required for the selected service",
    ],
    process: [
      "Understand the requirement",
      "Share the required details and documents",
      "Review the submission with LAWXYGEN",
      "Track the next action and follow-up",
    ],
    benefits: [
      "A clearer route from requirement to action",
      "Focused information without unnecessary clutter",
      "A visible next step throughout the service journey",
      "Access to expert support when required",
    ],
    faq: [
      `What is ${title}?`,
      `Who typically needs ${title}?`,
      `What information should I keep ready?`,
    ],
  };

  if (title.toLowerCase().includes("registration")) {
    base.process = [
      "Check the registration requirement",
      "Prepare applicant or business details",
      "Share the supporting documents",
      "Complete the relevant filing or application",
      "Review the outcome and next compliance action",
    ];
  }

  if (category === "Tax & Compliance") {
    base.benefits = [
      "Clear filing and compliance workflow",
      "Better visibility over recurring actions",
      "Centralised document and requirement tracking",
      "Expert help when an issue needs review",
    ];
  }

  if (category === "Intellectual Property") {
    base.benefits = [
      "Protect important intellectual assets",
      "Understand the relevant filing or protection route",
      "Keep ownership documentation organised",
      "Escalate specialist questions when needed",
    ];
  }

  return base;
}

export function ServicePageShell({ title, category, categorySlug, accent, pageClassName = "" }: ServicePageShellProps) {
  const group = serviceCatalog.find((item) => item.slug === categorySlug);
  const related = group?.services.filter((service) => service !== title).slice(0, 5) ?? [];
  const meta = getServiceMeta(title, category);

  return (
    <div className={`${styles.root} ${pageClassName}`} style={{ "--service-accent": accent } as CSSProperties}>
      <Header />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroTop}>
            <div className={styles.crumbs}>
              <a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><a href={categoryHref(categorySlug)}>{category}</a>
            </div>
            <span className={styles.eyebrow}>{category}</span>
          </div>

          <div className={styles.heroGrid}>
            <div>
              <h1>{title}</h1>
              <p className={styles.lead}>{meta.overview}</p>
              <div className={styles.actions}>
                <a className={styles.primary} href="#pricing">Start this service <span>↗</span></a>
                <a className={styles.secondary} href="/services/talk-lawyer/online-lawyer-consultation">Talk to an expert <span>→</span></a>
              </div>
            </div>

            <aside className={styles.progressCard}>
              <div className={styles.cardHead}><span>LAWXYGEN WORKSPACE</span><b>01</b></div>
              <h2>Keep the next step visible.</h2>
              <div className={styles.status}><span>Category</span><strong>{category}</strong></div>
              <div className={styles.status}><span>Service</span><strong>{title}</strong></div>
              <div className={styles.status}><span>Status</span><strong>Ready to start</strong></div>
              <a href="/login" className={styles.cardButton}>Log in / Sign up <span>→</span></a>
            </aside>
          </div>
        </section>

        <nav className={styles.indexBar} aria-label="Service page navigation">
          {sectionNames.map((name, index) => (
            <a key={name} href={`#section-${index + 1}`}><b>{String(index + 1).padStart(2, "0")}</b>{name}</a>
          ))}
        </nav>

        <section className={`${styles.section} ${styles.overview}`} id="section-1">
          <div className={styles.sectionLabel}>01 · OVERVIEW</div>
          <div className={styles.twoCol}>
            <div>
              <h2>Understand the service before you begin.</h2>
              <p>{meta.overview}</p>
            </div>
            <div className={styles.highlightPanel}>
              <span>WHY IT MATTERS</span>
              <strong>{titleCaseSlug(categorySlug)} support, organised for the next decision.</strong>
            </div>
          </div>
        </section>

        <section className={styles.section} id="section-2">
          <div className={styles.sectionLabel}>02 · ELIGIBILITY</div>
          <div className={styles.sectionHeader}><h2>Check the essentials first.</h2><p>Keep the requirement clear and confirm the information that applies to your situation.</p></div>
          <div className={styles.numberGrid}>{meta.eligibility.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>)}</div>
        </section>

        <section className={styles.section} id="section-3">
          <div className={styles.sectionLabel}>03 · EXPERT GUIDANCE</div>
          <div className={styles.expertPanel}>
            <div><span>EXPERT TUTORIAL</span><h2>See the journey before you take it.</h2><p>A short expert-led walkthrough can make the service easier to understand before you submit a request.</p></div>
            <button type="button" aria-label="Play expert tutorial"><span>▶</span> Play tutorial</button>
          </div>
        </section>

        <section className={styles.section} id="section-4">
          <div className={styles.sectionLabel}>04 · BENEFITS</div>
          <div className={styles.sectionHeader}><h2>What becomes easier.</h2><p>Designed around clarity, visibility and the next useful action.</p></div>
          <div className={styles.featureGrid}>{meta.benefits.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><i>↗</i></article>)}</div>
        </section>

        <section className={styles.section} id="section-5">
          <div className={styles.sectionLabel}>05 · DOCUMENTS</div>
          <div className={styles.sectionHeader}><h2>Keep these ready.</h2><p>The final document list will be service-specific and can be refined as client-approved content is added.</p></div>
          <div className={styles.documentList}>{meta.documents.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><b>✓</b></div>)}</div>
        </section>

        <section className={styles.section} id="section-6">
          <div className={styles.sectionLabel}>06 · PROCESS</div>
          <div className={styles.sectionHeader}><h2>A simple route from start to finish.</h2><p>The exact filing steps will vary by service; the structure keeps them easy to scan.</p></div>
          <div className={styles.processGrid}>{meta.process.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><p>Next action for this service stage.</p></article>)}</div>
        </section>

        <section className={styles.section} id="section-7">
          <div className={styles.sectionLabel}>07 · PRICING</div>
          <div className={styles.pricingPanel} id="pricing"><div><span>LAWXYGEN</span><h2>Choose the right route for your requirement.</h2><p>Final pricing can be added here once the approved service pricing is provided.</p></div><a className={styles.primary} href="/login">Get started <span>↗</span></a></div>
        </section>

        <section className={styles.section} id="section-8">
          <div className={styles.sectionLabel}>08 · RELATED SERVICES</div>
          <div className={styles.relatedRail}>{related.map((service) => <a key={service} href={serviceHref(categorySlug, service)}><span>{category}</span><strong>{service}</strong><b>↗</b></a>)}</div>
        </section>

        <section className={`${styles.section} ${styles.helpSection}`} id="section-9">
          <div><div className={styles.sectionLabel}>09 · TALK TO AN EXPERT</div><h2>Need a second opinion?</h2><p>Connect with the right professional when the question needs human guidance.</p></div>
          <a className={styles.primary} href="/services/talk-lawyer/online-lawyer-consultation">Talk to an expert <span>→</span></a>
        </section>

        <section className={styles.section} id="section-10">
          <div className={styles.sectionLabel}>10 · FAQs</div>
          <div className={styles.faqList}>{meta.faq.map((question, index) => <details key={question}><summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<b>+</b></summary><p>This answer can be expanded with the final client-approved service information.</p></details>)}</div>
        </section>
      </main>
      <Footer />
      <div className={styles.indexDock} aria-label="Service sections">
        <span>INDEX</span>
        {sectionNames.slice(0, 5).map((name, index) => <a key={name} href={`#section-${index + 1}`}>{String(index + 1).padStart(2, "0")} {name}</a>)}
      </div>
    </div>
  );
}

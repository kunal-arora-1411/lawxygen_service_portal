"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { FormEvent, useEffect, useState } from "react";

type ContactMode = "expert" | "panel" | "team";

type Expert = {
  tag: string;
  title: string;
  text: string;
  image: string;
};

const journey = [
  {
    number: "01",
    title: "Start",
    text: "Set up the right legal and business foundation before you begin.",
    image: "/client-assets/start.png",
  },
  {
    number: "02",
    title: "Manage",
    text: "Stay on top of filings, tax, licences and recurring compliance.",
    image: "/client-assets/manage.png",
  },
  {
    number: "03",
    title: "Protect",
    text: "Secure the brand, IP, agreements and permissions your business relies on.",
    image: "/client-assets/protect.png",
  },
  {
    number: "04",
    title: "Grow",
    text: "Bring in professional support as decisions become more important.",
    image: "/client-assets/grow.png",
  },
];

const experts: Expert[] = [
  {
    tag: "LEGAL",
    title: "Talk to a Lawyer",
    text: "Business, agreements, disputes and legal matters.",
    image: "/client-assets/TALK TO A LAWYER.png",
  },
  {
    tag: "TAX",
    title: "Talk to a CA",
    text: "Taxation, GST, accounting and financial compliance.",
    image: "/client-assets/TALK TO A CA.png",
  },
  {
    tag: "CORPORATE",
    title: "Talk to a CS",
    text: "Governance, ROC and corporate compliance.",
    image: "/client-assets/TALK TO A CS.png",
  },
  {
    tag: "IP",
    title: "Talk to an IP Lawyer",
    text: "Trademark, copyright and intellectual property.",
    image: "/client-assets/Talk to an IP Lawyer.png",
  },
];

const faq = [
  [
    "What services can I find on LAWXYGEN?",
    "Business setup, tax and compliance, intellectual property, documentation, certifications and professional consultations are organised into a single service experience.",
  ],
  [
    "How do I find the right service?",
    "Search for a service from the hero or explore the categories. You can also talk to an expert when you are not sure which route fits your situation.",
  ],
  [
    "Can I speak with a professional?",
    "Yes. The homepage includes dedicated routes for lawyers, chartered accountants, company secretaries and IP lawyers.",
  ],
  [
    "Can LAWXYGEN help with recurring compliance?",
    "The service catalogue includes tax, GST, ROC and other recurring business requirements, depending on the service you select.",
  ],
  [
    "What happens when I am still confused?",
    "Use the two-minute team form. Share your name, phone, email, city and message and the team can understand what you need before the next step.",
  ],
];

const panel = [
  {
    role: "LAWYER",
    title: "Legal professionals",
    text: "Join the panel for business, contracts, disputes and legal matters.",
    image: "/client-assets/TALK TO A LAWYER.png",
  },
  {
    role: "CA",
    title: "Chartered accountants",
    text: "Support clients with tax, GST, accounts and financial compliance.",
    image: "/client-assets/TALK TO A CA.png",
  },
  {
    role: "CS",
    title: "Company secretaries",
    text: "Help with corporate governance, filings and regulatory compliance.",
    image: "/client-assets/TALK TO A CS.png",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export function HomeExperience() {
  const reduceMotion = useReducedMotion();
  const [modal, setModal] = useState<ContactMode | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState("Lawyer");

  const openModal = (mode: ContactMode) => {
    setSubmitted(false);
    setModal(mode);
    document.body.classList.add("lawx-modal-open");
  };

  const closeModal = () => {
    setModal(null);
    setSubmitted(false);
    document.body.classList.remove("lawx-modal-open");
  };

  useEffect(() => {
    return () => document.body.classList.remove("lawx-modal-open");
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section id="business" className="ux-journey">
        <div className="ux-wrap">
          <div className="ux-section-intro">
            <div>
              <span>YOUR BUSINESS JOURNEY</span>
              <h2>Start. Manage. Protect. Grow.</h2>
            </div>
            <p>One clearer path from the first setup task to the next business decision.</p>
          </div>

          <div className="ux-journey-grid">
            {journey.map((item, index) => (
              <motion.article
                key={item.number}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
              >
                <div className="ux-card-image">
                  <Image src={item.image} alt="" fill sizes="(max-width: 850px) 100vw, 25vw" />
                </div>
                <div className="ux-card-meta">
                  <span>{item.number}</span>
                  <strong>{item.title}</strong>
                </div>
                <p>{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="ux-experts" id="experts">
        <div className="ux-wrap ux-two-column">
          <div className="ux-sticky-copy">
            <span>EXPERT CONSULTATION</span>
            <h2>Some decisions deserve a real conversation.</h2>
            <p>Choose a professional by the kind of question you need answered.</p>
            <button type="button" className="ux-secondary" onClick={() => openModal("expert")}>
              Talk to an Expert <Arrow />
            </button>
          </div>

          <div className="ux-expert-list">
            {experts.map((expert, index) => (
              <motion.button
                type="button"
                className="ux-expert-card"
                key={expert.tag}
                onClick={() => {
                  setRole(expert.title.replace("Talk to an ", ""));
                  openModal("expert");
                }}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="ux-expert-image">
                  <Image src={expert.image} alt="" fill sizes="96px" />
                </div>
                <div className="ux-expert-copy">
                  <span>{expert.tag}</span>
                  <strong>{expert.title}</strong>
                  <p>{expert.text}</p>
                </div>
                <Arrow />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="ux-business-choice">
        <div className="ux-wrap">
          <div className="ux-choice-head">
            <span>CHOOSE YOUR NEXT STEP</span>
            <h2>Set up your business without losing the thread.</h2>
            <p>Start where the work is, then move directly to the service or person who can help.</p>
          </div>

          <div className="ux-choice-grid">
            <a href="/services/business-setup" className="ux-choice-card ux-choice-large">
              <div className="ux-choice-image">
                <Image src="/client-assets/BUSINESS SETUP.png" alt="Business setup" fill sizes="(max-width: 850px) 100vw, 50vw" />
              </div>
              <div className="ux-choice-content">
                <span>01 · BUSINESS SETUP</span>
                <h3>Set up your business</h3>
                <p>Explore company registration, startup, partnership and business setup services.</p>
                <Arrow />
              </div>
            </a>

            <button type="button" className="ux-choice-card" onClick={() => openModal("expert")}>
              <div className="ux-choice-image">
                <Image src="/client-assets/TALK TO A LAWYER.png" alt="Talk to an expert" fill sizes="(max-width: 850px) 100vw, 25vw" />
              </div>
              <div className="ux-choice-content">
                <span>02 · EXPERT</span>
                <h3>Talk to an expert</h3>
                <p>Tell us what you are trying to solve and route the conversation to the right professional.</p>
                <Arrow />
              </div>
            </button>

            <button type="button" className="ux-choice-card" onClick={() => openModal("team")}>
              <div className="ux-choice-image ux-choice-soft">
                <Image src="/client-assets/DOCUMENTATION.png" alt="Connect with the team" fill sizes="(max-width: 850px) 100vw, 25vw" />
              </div>
              <div className="ux-choice-content">
                <span>03 · STILL CONFUSED?</span>
                <h3>Connect with our team</h3>
                <p>Share five simple details. Start with a two-minute message instead of guessing the right service.</p>
                <Arrow />
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="ux-protect">
        <div className="ux-wrap ux-video-grid">
          <div className="ux-video-frame">
            <video autoPlay muted loop playsInline preload="metadata" poster="/client-assets/protect.png">
              <source src="/client-assets/Animate_this_image.mp4" type="video/mp4" />
            </video>
            <div className="ux-video-label">LAWXYGEN · PROTECT & GROW</div>
          </div>

          <div className="ux-video-copy">
            <span>PROTECT WHAT YOU BUILD</span>
            <h2>Make the important work easier to move through.</h2>
            <p>From brand protection to licences and documentation, the experience should tell you what to do next—not make you decode another page.</p>
            <div className="ux-protect-points">
              <div><b>01</b><span>Protect your brand and intellectual property.</span></div>
              <div><b>02</b><span>Keep licences and certifications organised.</span></div>
              <div><b>03</b><span>Get documents and agreements ready with the right support.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="ux-panel" id="panel">
        <div className="ux-wrap">
          <div className="ux-panel-head">
            <div>
              <span>MEET OUR PANEL</span>
              <h2>Professionals behind the conversation.</h2>
            </div>
            <p>LAWXYGEN brings legal, tax and corporate professionals into one place so clients can move from uncertainty to a clearer next step.</p>
          </div>

          <div className="ux-panel-grid">
            {panel.map((item) => (
              <article key={item.role}>
                <div className="ux-panel-image">
                  <Image src={item.image} alt="" fill sizes="(max-width: 850px) 100vw, 33vw" />
                </div>
                <span>{item.role}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <button type="button" className="ux-panel-cta" onClick={() => openModal("panel")}>
            Impanel With Us <Arrow />
          </button>
        </div>
      </section>

      <section className="ux-why">
        <div className="ux-wrap ux-two-column">
          <div className="ux-sticky-copy">
            <span>WHY LAWXYGEN</span>
            <h2>Complex work. Clear experience.</h2>
            <p>The homepage is designed around decisions, not around making people read every section before acting.</p>
          </div>

          <div className="ux-why-list">
            <article>
              <span>01</span>
              <div className="ux-why-item-image"><Image src="/client-assets/BUSINESS SETUP.png" alt="Business setup" fill sizes="58px" /></div>
              <div><strong>Find what you need faster</strong><p>Search, category navigation and focused CTAs keep the route visible.</p></div>
            </article>
            <article>
              <span>02</span>
              <div className="ux-why-item-image"><Image src="/client-assets/TAX & COMPLAINCE.png" alt="Tax and compliance" fill sizes="58px" /></div>
              <div><strong>Choose the right kind of help</strong><p>Service discovery and expert consultation sit beside each other instead of competing.</p></div>
            </article>
            <article>
              <span>03</span>
              <div className="ux-why-item-image"><Image src="/client-assets/IP.png" alt="Intellectual property" fill sizes="58px" /></div>
              <div><strong>Know the next action</strong><p>Each section leads naturally to a service, a professional or a simple contact form.</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="ux-faq" id="resources">
        <div className="ux-wrap ux-two-column">
          <div className="ux-sticky-copy">
            <span>QUESTIONS</span>
            <h2>Before you get started.</h2>
            <p>Answers stay short, visible and close to the action they support.</p>
          </div>
          <div className="ux-faq-list">
            {faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<b>+</b></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ux-end-cta">
        <div className="ux-wrap">
          <span>YOUR NEXT STEP</span>
          <h2>Start with what you need today.</h2>
          <p>Explore the service library, speak to a professional or send the team a two-minute message.</p>
          <div className="ux-end-actions">
            <a href="/services">Explore Services <Arrow /></a>
            <button type="button" onClick={() => openModal("expert")}>Talk to an Expert <span>→</span></button>
            <button type="button" className="ux-end-text" onClick={() => openModal("team")}>Still confused? Connect with our team <span>→</span></button>
          </div>
        </div>
      </section>

      {modal && (
        <div className="ux-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <div className="ux-modal" role="dialog" aria-modal="true" aria-labelledby="lawxygen-contact-title">
            <button type="button" className="ux-modal-close" onClick={closeModal} aria-label="Close">×</button>
            {!submitted ? (
              <form onSubmit={submit}>
                <span>{modal === "panel" ? "PROFESSIONAL PANEL" : modal === "expert" ? "TALK TO AN EXPERT" : "CONNECT WITH THE TEAM"}</span>
                <h3 id="lawxygen-contact-title">
                  {modal === "panel" ? "Impanel with LAWXYGEN." : modal === "expert" ? "Let’s find the right professional." : "Tell us what you need."}
                </h3>
                <p>{modal === "panel" ? "Share your details and professional category to start the panel conversation." : "Share the basics and keep the next step simple."}</p>
                <div className="ux-form-grid">
                  <label><span>Name</span><input name="name" required placeholder="Your name" /></label>
                  <label><span>Phone Number</span><input name="phone" required inputMode="tel" placeholder="Your phone number" /></label>
                  <label><span>Email</span><input name="email" required type="email" placeholder="you@example.com" /></label>
                  <label><span>City</span><input name="city" required placeholder="Your city" /></label>
                  {modal === "panel" && (
                    <label className="ux-full"><span>Professional category</span><select value={role} onChange={(event) => setRole(event.target.value)}><option>Lawyer</option><option>Chartered Accountant</option><option>Company Secretary</option><option>IP Lawyer</option></select></label>
                  )}
                  <label className="ux-full"><span>Message</span><textarea name="message" required rows={4} placeholder={modal === "panel" ? "Tell us about your professional practice" : "Tell us what you need help with"} /></label>
                </div>
                <button className="ux-form-submit" type="submit">Send Request <Arrow /></button>
              </form>
            ) : (
              <div className="ux-form-success">
                <span>✓</span>
                <h3>Request received.</h3>
                <p>This front-end flow is ready for the project’s final backend/API connection.</p>
                <button type="button" onClick={closeModal}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";

import {
  useRef,
} from "react";

const experts = [
  {
    tag: "LEGAL",
    title: "Talk to a Lawyer",
    text:
      "Get professional guidance for business, contracts, disputes and legal decisions.",
    color: "#ff5a67",
  },
  {
    tag: "TAX",
    title: "Talk to a CA",
    text:
      "Get support for tax, accounting, GST, financial compliance and planning.",
    color: "#15b985",
  },
  {
    tag: "CORPORATE",
    title: "Talk to a CS",
    text:
      "Navigate corporate filings, governance and regulatory compliance.",
    color: "#7357ff",
  },
  {
    tag: "IP",
    title: "Talk to an IP Lawyer",
    text:
      "Protect trademarks, copyright, patents and valuable intellectual property.",
    color: "#ff9c33",
  },
];

export function HomeSections() {
  const journeyRef =
    useRef<HTMLElement>(null);

  const { scrollYProgress } =
    useScroll({
      target: journeyRef,
      offset: [
        "start end",
        "end start",
      ],
    });

  const headingX =
    useTransform(
      scrollYProgress,
      [0, 1],
      ["10%", "-12%"]
    );

  return (
    <>
      <section
        ref={journeyRef}
        className="lx2-journey"
      >
        <div className="lx2-section-label">
          BUSINESS JOURNEY
        </div>

        <motion.h2
          style={{
            x: headingX,
          }}
        >
          Start. Manage. Protect.
          Grow.
        </motion.h2>

        <div className="lx2-journey-grid">
          {[
            [
              "01",
              "Start",
              "Choose your structure and establish the right legal foundation.",
            ],
            [
              "02",
              "Manage",
              "Keep filings, tax and business compliance organised.",
            ],
            [
              "03",
              "Protect",
              "Secure your brand, agreements and intellectual property.",
            ],
            [
              "04",
              "Grow",
              "Get professional guidance as business decisions become bigger.",
            ],
          ].map(
            (
              item,
              index
            ) => (
              <motion.article
                key={item[0]}
                initial={{
                  opacity: 0,
                  y: 65,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.7,
                  delay:
                    index *
                    0.07,
                }}
              >
                <span>
                  {item[0]}
                </span>

                <h3>
                  {item[1]}
                </h3>

                <p>
                  {item[2]}
                </p>
              </motion.article>
            )
          )}
        </div>
      </section>

      <section className="lx2-experts">
        <div className="lx2-expert-intro">
          <span>
            EXPERT CONSULTATION
          </span>

          <h2>
            When you need more
            than a form.
          </h2>

          <p>
            Connect with the right
            professional for
            complex legal, tax,
            corporate and
            intellectual-property
            matters.
          </p>
        </div>

        <div className="lx2-expert-list">
          {experts.map(
            (
              expert,
              index
            ) => (
              <motion.a
                href="#"
                key={
                  expert.title
                }
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.4,
                }}
                transition={{
                  duration: 0.55,
                  delay:
                    index *
                    0.05,
                }}
                style={
                  {
                    "--expert-color":
                      expert.color,
                  } as React.CSSProperties
                }
              >
                <i />

                <span>
                  {expert.tag}
                </span>

                <strong>
                  {expert.title}
                </strong>

                <p>
                  {expert.text}
                </p>

                <b>↗</b>
              </motion.a>
            )
          )}
        </div>
      </section>

      <section className="lx2-process">
        <div className="lx2-process-heading">
          <span>
            HOW LAWXYGEN WORKS
          </span>

          <h2>
            Less confusion.
            <br />
            More progress.
          </h2>
        </div>

        <div className="lx2-process-track">
          <div>
            <span>01</span>
            <strong>
              Find your service
            </strong>
            <p>
              Search or browse
              exactly what your
              business needs.
            </p>
          </div>

          <div>
            <span>02</span>
            <strong>
              Share the details
            </strong>
            <p>
              Provide the
              information and
              documents required
              for the service.
            </p>
          </div>

          <div>
            <span>03</span>
            <strong>
              Move forward
            </strong>
            <p>
              Continue with
              structured support
              and expert guidance.
            </p>
          </div>
        </div>
      </section>

      <section className="lx2-faq">
        <div>
          <span>
            QUESTIONS
          </span>

          <h2>
            Before you
            begin.
          </h2>
        </div>

        <div className="lx2-faq-list">
          <details>
            <summary>
              What services can I
              find on LAWXYGEN?
              <b>+</b>
            </summary>

            <p>
              LAWXYGEN covers
              business setup,
              taxation,
              compliance,
              intellectual
              property, legal
              documentation,
              certifications and
              professional
              consultations.
            </p>
          </details>

          <details>
            <summary>
              How do I find the
              right service?
              <b>+</b>
            </summary>

            <p>
              Use the service
              search or browse
              categories based on
              your business need.
            </p>
          </details>

          <details>
            <summary>
              Can I speak with a
              professional?
              <b>+</b>
            </summary>

            <p>
              Dedicated
              consultation
              categories include
              lawyers, chartered
              accountants,
              company
              secretaries and IP
              lawyers.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
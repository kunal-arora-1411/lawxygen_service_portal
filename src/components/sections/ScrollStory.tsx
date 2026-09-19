"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

const items = [
  {
    number: "01",
    label: "START",
    title: "Build on the right legal foundation.",
    text:
      "Choose the right business structure, complete registrations and start with clarity.",
  },
  {
    number: "02",
    label: "COMPLY",
    title: "Keep compliance moving with you.",
    text:
      "Tax, GST, ROC filings, licences and regulatory requirements stay organised as your business grows.",
  },
  {
    number: "03",
    label: "PROTECT",
    title: "Protect what makes the business yours.",
    text:
      "Secure trademarks, intellectual property, agreements and essential legal rights.",
  },
  {
    number: "04",
    label: "GROW",
    title: "Expert support when decisions get bigger.",
    text:
      "Connect with lawyers, CAs, CS professionals and IP specialists when specialist advice matters.",
  },
];

export function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "-75%"]
  );

  const headingY = useTransform(
    scrollYProgress,
    [0, 0.3],
    ["0%", "-35%"]
  );

  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.28],
    [1, 0.15]
  );

  return (
    <section
      ref={sectionRef}
      className="nx-story"
      id="services"
    >
      <div className="nx-story-sticky">
        <motion.div
          className="nx-story-heading"
          style={{
            y: headingY,
            opacity: headingOpacity,
          }}
        >
          <span>LAWXYGEN / SERVICES</span>

          <h2>
            One business.
            <br />
            Every legal stage.
          </h2>
        </motion.div>

        <motion.div
          className="nx-story-track"
          style={{ x }}
        >
          {items.map((item) => (
            <article
              className="nx-story-card"
              key={item.number}
            >
              <div className="nx-story-card-top">
                <span>{item.number}</span>
                <span>{item.label}</span>
              </div>

              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>

              <a href="#">
                Explore
                <span>↗</span>
              </a>
            </article>
          ))}
        </motion.div>

        <motion.div
          className="nx-progress"
          style={{
            scaleX: scrollYProgress,
          }}
        />
      </div>
    </section>
  );
}
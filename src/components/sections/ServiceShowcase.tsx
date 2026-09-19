import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { serviceCatalog } from "@/data/serviceCatalog";

const featuredSlugs = [
  "business-setup",
  "tax-compliance",
  "intellectual-property",
  "documentation",
] as const;

const serviceImages: Record<string, string> = {
  "business-setup": "/client-assets/BUSINESS SETUP.png",
  "tax-compliance": "/client-assets/TAX & COMPLAINCE.png",
  "intellectual-property": "/client-assets/IP.png",
  documentation: "/client-assets/DOCUMENTATION.png",
};

const serviceHighlights: Record<string, string> = {
  "business-setup": "Set up the right structure and get the paperwork moving.",
  "tax-compliance": "Handle recurring filings, registrations and compliance with clarity.",
  "intellectual-property": "Protect the brand, content and ideas that make your business yours.",
  documentation: "Create the agreements and legal documents your next step needs.",
};

export function ServiceShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const groups = useMemo(
    () =>
      featuredSlugs
        .map((slug) => serviceCatalog.find((group) => group.slug === slug))
        .filter((group): group is (typeof serviceCatalog)[number] => Boolean(group)),
    [],
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!groups.length) return;
    const next = Math.min(groups.length - 1, Math.floor(value * groups.length));
    setActiveIndex((current) => (current === next ? current : next));
  });

  const activeGroup = groups[activeIndex] ?? groups[0];
  const visibleServices = activeGroup?.services.slice(0, 4) ?? [];

  const openServices = (nextQuery = "") => {
    window.dispatchEvent(
      new CustomEvent("lawxygen:open-services", {
        detail: { query: nextQuery },
      }),
    );
  };

  const jumpToCategory = (index: number) => {
    if (!sectionRef.current || groups.length < 2) return;
    const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(sectionRef.current.offsetHeight - window.innerHeight, 0);
    const target = sectionTop + (range * index) / groups.length + 12;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  if (!activeGroup) return null;

  return (
    <section ref={sectionRef} id="services" className="ux-services-scroll">
      <div className="ux-services-scroll-sticky">
        <div className="ux-services-frame">
          <div className="ux-services-topline">
            <span>POPULAR SERVICES</span>
            <p>Choose an area, then pick the next service.</p>
          </div>

          <div className="ux-services-scroll-layout">
            <aside className="ux-scroll-categories" aria-label="Popular service categories">
              <div className="ux-scroll-categories-label">EXPLORE</div>
              {groups.map((group, index) => (
                <button
                  key={group.slug}
                  type="button"
                  className={index === activeIndex ? "active" : ""}
                  style={{ "--category-color": group.accent } as React.CSSProperties}
                  onClick={() => jumpToCategory(index)}
                  aria-current={index === activeIndex ? "step" : undefined}
                >
                  <span className="dot" />
                  <strong>{group.label.replace(" & ", " & ")}</strong>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                </button>
              ))}
              <button type="button" className="ux-scroll-browse" onClick={() => openServices()}>
                Browse all services <b>↗</b>
              </button>
            </aside>

            <div className="ux-scroll-stage" style={{ "--category-color": activeGroup.accent } as React.CSSProperties}>
              <motion.div
                key={activeGroup.slug}
                className="ux-scroll-content"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="ux-scroll-stage-head">
                  <div>
                    <span>{String(activeIndex + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}</span>
                    <h3>{activeGroup.label}</h3>
                    <p>{serviceHighlights[activeGroup.slug]}</p>
                  </div>
                  <button type="button" onClick={() => openServices()}>
                    Full service library <b>↗</b>
                  </button>
                </div>

                <div className="ux-scroll-main">
                  <div className="ux-scroll-services">
                    {visibleServices.map((service, index) => (
                      <button key={service} type="button" onClick={() => openServices(service)}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{service}</strong>
                        <b>↗</b>
                      </button>
                    ))}
                    <button type="button" className="ux-scroll-more" onClick={() => openServices()}>
                      Explore more in {activeGroup.label} <b>↗</b>
                    </button>
                  </div>

                  <div className="ux-scroll-image">
                    <img
                      src={serviceImages[activeGroup.slug]}
                      alt={activeGroup.label}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      sizes="(max-width: 860px) 100vw, 32vw"
                    />
                    <div className="ux-scroll-image-caption">
                      <span>LAWXYGEN</span>
                      <strong>{activeGroup.label}</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="ux-services-scroll-progress" aria-hidden="true">
            {groups.map((group, index) => (
              <span
                key={group.slug}
                className={index === activeIndex ? "active" : ""}
                style={{ "--bar-color": group.accent } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

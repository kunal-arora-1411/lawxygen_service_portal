"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";

import {
  CSSProperties,
  useRef,
  useState,
} from "react";

import {
  serviceCatalog,
} from "@/data/serviceCatalog";

export function ServiceUniverse() {
  const ref =
    useRef<HTMLElement>(null);

  const [active, setActive] =
    useState(0);

  const { scrollYProgress } =
    useScroll({
      target: ref,
      offset: [
        "start start",
        "end end",
      ],
    });

  useMotionValueEvent(
    scrollYProgress,
    "change",
    (latest) => {
      const index = Math.min(
        serviceCatalog.length - 1,
        Math.floor(
          latest *
            serviceCatalog.length
        )
      );

      setActive(index);
    }
  );

  const group =
    serviceCatalog[active];

  const openAll = () => {
    window.dispatchEvent(
      new CustomEvent(
        "lawxygen:open-services",
        {
          detail: {
            query: "",
          },
        }
      )
    );
  };

  return (
    <section
      ref={ref}
      id="services"
      className="lx2-services"
      style={
        {
          "--accent":
            group.accent,
        } as CSSProperties
      }
    >
      <div className="lx2-services-sticky">
        <div className="lx2-services-head">
          <span>
            SERVICES / EXPLORE
          </span>

          <p>
            Everything your business
            needs, without the legal
            maze.
          </p>
        </div>

        <div className="lx2-services-layout">
          <nav className="lx2-category-nav">
            {serviceCatalog.map(
              (
                item,
                index
              ) => (
                <button
                  key={
                    item.slug
                  }
                  className={
                    index ===
                    active
                      ? "active"
                      : ""
                  }
                  type="button"
                >
                  <i
                    style={{
                      background:
                        item.accent,
                    }}
                  />

                  <span>
                    {
                      item.label
                    }
                  </span>
                </button>
              )
            )}
          </nav>

          <div className="lx2-service-stage">
            <AnimatePresence
              mode="wait"
            >
              <motion.div
                key={group.slug}
                className="lx2-service-content"
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -35,
                }}
                transition={{
                  duration: 0.48,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              >
                <span className="lx2-service-kicker">
                  Explore
                </span>

                <h2>
                  {group.label}
                </h2>

                <div className="lx2-service-lines">
                  {group.services
                    .slice(0, 7)
                    .map(
                      (
                        service,
                        index
                      ) => (
                        <a
                          href="#"
                          key={
                            service
                          }
                        >
                          <span>
                            {String(
                              index +
                                1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <strong>
                            {
                              service
                            }
                          </strong>

                          <b>↗</b>
                        </a>
                      )
                    )}
                </div>

                <button
                  type="button"
                  className="lx2-all-services"
                  onClick={openAll}
                >
                  View all services
                  <span>↗</span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lx2-service-art">
            <div className="lx2-art-line" />

            <AnimatePresence
              mode="wait"
            >
              <motion.div
                key={group.slug}
                className="lx2-art-word"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  rotate: -8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 1.1,
                  rotate: 6,
                }}
                transition={{
                  duration: 0.55,
                }}
              >
                {group.label
                  .charAt(0)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          className="lx2-services-progress"
          style={{
            scaleX:
              scrollYProgress,
          }}
        />
      </div>
    </section>
  );
}
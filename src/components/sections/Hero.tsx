"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import {
  FormEvent,
  useRef,
  useState,
} from "react";

export function Hero() {
  const ref =
    useRef<HTMLElement>(null);

  const [query, setQuery] =
    useState("");

  const { scrollYProgress } =
    useScroll({
      target: ref,
      offset: [
        "start start",
        "end start",
      ],
    });

  const progress = useSpring(
    scrollYProgress,
    {
      stiffness: 75,
      damping: 28,
    }
  );

  const titleY = useTransform(
    progress,
    [0, 1],
    [0, -170]
  );

  const titleScale = useTransform(
    progress,
    [0, 0.7],
    [1, 0.78]
  );

  const titleOpacity = useTransform(
    progress,
    [0, 0.72],
    [1, 0]
  );

  const planeOne = useTransform(
    progress,
    [0, 1],
    ["0%", "-34%"]
  );

  const planeTwo = useTransform(
    progress,
    [0, 1],
    ["0%", "27%"]
  );

const giantX = useTransform(
  progress,
  [0, 1],
  ["2%", "-6%"]
);

  const openServices = (
    value = ""
  ) => {
    window.dispatchEvent(
      new CustomEvent(
        "lawxygen:open-services",
        {
          detail: {
            query: value,
          },
        }
      )
    );
  };

  const submit = (
    event: FormEvent
  ) => {
    event.preventDefault();

    openServices(query);
  };

  return (
    <section
      ref={ref}
      className="v3-hero"
    >
      <div className="v3-hero-sticky">
        <div className="v3-hero-grid" />

        <motion.div
          className="v3-plane v3-plane-one"
          style={{ x: planeOne }}
        />

        <motion.div
          className="v3-plane v3-plane-two"
          style={{ x: planeTwo }}
        />

        <motion.div
          className="v3-plane v3-plane-three"
          style={{ y: planeOne }}
        />

        <motion.div
          className="v3-giant-word"
          style={{ x: giantX }}
        >
          LAWXYGEN
        </motion.div>

        <motion.div
          className="v3-hero-content"
          style={{
            y: titleY,
            scale: titleScale,
            opacity: titleOpacity,
          }}
        >
          <motion.span
            className="v3-kicker"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
          >
            LEGAL · TAX · COMPLIANCE · BUSINESS
          </motion.span>

          <h1>
            <span>
              <motion.b
                initial={{
                  y: "110%",
                }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.08,
                  ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                  ],
                }}
              >
                Make business
              </motion.b>
            </span>

            <span>
              <motion.b
                initial={{
                  y: "110%",
                }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.18,
                  ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                  ],
                }}
              >
                feel easier.
              </motion.b>
            </span>
          </h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.48,
            }}
          >
            Business setup, taxation,
            compliance, intellectual
            property, documentation and
            expert guidance — brought
            together in one clear
            experience.
          </motion.p>

          <motion.form
            className="v3-hero-search"
            onSubmit={submit}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.62,
            }}
          >
            <span>⌕</span>

            <input
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              type="search"
              placeholder="Search a service"
            />

            <button type="submit">
              Explore
              <b>↗</b>
            </button>
          </motion.form>

          <motion.div
            className="v3-hero-popular"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
            }}
          >
            {[
              "Company Registration",
              "GST",
              "Trademark",
              "FSSAI",
            ].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() =>
                  openServices(item)
                }
              >
                {item}
              </button>
            ))}
          </motion.div>
        </motion.div>

        <div className="v3-scroll-note">
          <span>SCROLL</span>
          <i />
        </div>
      </div>
    </section>
  );
}
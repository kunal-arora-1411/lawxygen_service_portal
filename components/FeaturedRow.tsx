"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatPrice, type Service } from "@/lib/api";
import { usePrefersReducedMotion } from "@/lib/client-state";
import styles from "./FeaturedRow.module.css";

/**
 * "New in Lawxygen" — the one row that moves on its own.
 *
 * Which services appear is editorial: admin sets `featured`, so marketing controls the
 * row without a deploy and without it silently becoming "whatever was added last".
 *
 * Auto-rotation is held to WCAG 2.2.2, which is not optional on a client flow. It
 * pauses on hover, pauses on keyboard focus anywhere inside, offers an explicit
 * pause control, and does not start at all when the viewer has asked for reduced
 * motion. An un-pausable moving element fails the standard outright.
 */

const INTERVAL_MS = 6000;

export function FeaturedRow({ services }: { services: Service[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const region = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused || reducedMotion || services.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % services.length);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [paused, reducedMotion, services.length]);

  if (services.length === 0) return null;

  const stopped = paused || reducedMotion;

  return (
    <section
      className={styles.wrap}
      aria-labelledby="featured-heading"
      aria-roledescription="carousel"
      ref={region}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // Focus anywhere inside stops it. Content sliding away mid-read is the thing
      // that makes these unusable with a keyboard.
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!region.current?.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className={styles.head}>
        <h2 className={styles.title} id="featured-heading">
          New in Lawxygen
        </h2>

        {services.length > 1 && (
          <div className={styles.controls}>
            <div className={styles.dots}>
              {services.map((service, position) => (
                <button
                  key={service.id}
                  type="button"
                  className={styles.dot}
                  aria-current={position === index}
                  aria-label={`Show ${service.title}`}
                  onClick={() => setIndex(position)}
                />
              ))}
            </div>
            {!reducedMotion && (
              <button
                type="button"
                className={styles.pause}
                onClick={() => setPaused((value) => !value)}
                aria-pressed={paused}
              >
                {paused ? "Play" : "Pause"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles.viewport}>
        <div className={styles.track} style={{ transform: `translateX(-${String(index * 100)}%)` }}>
          {services.map((service, position) => (
            <div
              key={service.id}
              className={styles.slide}
              // Off-screen slides are hidden from assistive technology as well as
              // from sight, so a screen reader does not read all of them at once.
              aria-hidden={position !== index}
            >
              <div className={styles.panel}>
                <div className={styles.body}>
                  <div className={styles.eyebrow}>{service.categoryLabel}</div>
                  <h3 className={styles.name}>{service.title}</h3>
                  <div className={styles.meta}>
                    {formatPrice(service.pricePaise, service.currency)}
                    {service.turnaroundDays !== null && ` · about ${service.turnaroundDays} days`}
                  </div>
                </div>
                <Link
                  href={`/checkout?category=${service.categorySlug}&service=${service.slug}`}
                  className={styles.cta}
                  tabIndex={position === index ? undefined : -1}
                >
                  Get started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announces the change to a screen reader only while rotation is stopped —
          a live region that fires every six seconds is noise, not information. */}
      <div className="visually-hidden" aria-live={stopped ? "polite" : "off"}>
        {services[index]?.title}
      </div>
    </section>
  );
}

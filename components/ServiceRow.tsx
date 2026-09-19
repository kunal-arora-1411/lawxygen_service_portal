import Link from "next/link";
import { formatPrice, type Service } from "@/lib/api";
import styles from "./ServiceRow.module.css";

/**
 * A horizontally scrolling row of services, with "See all" above it.
 *
 * Plain overflow rather than a carousel: the row scrolls with a trackpad, a touch
 * swipe, the keyboard and a screen reader's own navigation, none of which a custom
 * control gets right for free.
 */
export function ServiceRow({
  title,
  subtitle,
  seeAllHref,
  services,
  empty,
}: {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
  services: Service[];
  empty?: React.ReactNode;
}) {
  return (
    <section className={styles.section} aria-labelledby={`row-${slugify(title)}`}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title} id={`row-${slugify(title)}`}>
            {title}
          </h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {seeAllHref && services.length > 0 && (
          <Link href={seeAllHref} className={styles.seeAll}>
            See all →
          </Link>
        )}
      </div>

      {services.length === 0 ? (
        <div className={styles.empty}>{empty}</div>
      ) : (
        <div className={styles.scroller}>
          {services.map((service) => (
            <ServiceCard key={`${service.categorySlug}/${service.slug}`} service={service} />
          ))}
        </div>
      )}
    </section>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      // Both parts, always: 22 slugs exist in two categories at once, so the slug
      // alone would be ambiguous between a filing and the consultation about it.
      href={`/checkout?category=${service.categorySlug}&service=${service.slug}`}
      className={styles.card}
    >
      <div className={styles.cardTop}>
        <span className={styles.badge}>{service.categoryLabel}</span>
        {service.fulfilmentType === "consultation" && (
          <span className={`${styles.badge} ${styles.consultation}`}>Consultation</span>
        )}
      </div>

      <h3 className={styles.cardTitle}>{service.title}</h3>

      <div className={styles.cardFoot}>
        <span className={styles.price}>{formatPrice(service.pricePaise, service.currency)}</span>
        {service.turnaroundDays !== null && (
          <span className={styles.turnaround}>
            ~{service.turnaroundDays} day{service.turnaroundDays === 1 ? "" : "s"}
          </span>
        )}
      </div>
    </Link>
  );
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

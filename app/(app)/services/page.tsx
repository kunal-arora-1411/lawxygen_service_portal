import Link from "next/link";
import { ServiceCard } from "@/components/ServiceRow";
import { api, type Category, type Page, type Service } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import styles from "./page.module.css";

/**
 * The all-services panel: search, category filter, and the full priced catalogue.
 *
 * Search and filter are plain GET form state in the URL, not client state. That makes
 * a filtered view linkable and survivable across a reload, and it means the work
 * happens on the server against an indexed query rather than by shipping the catalogue
 * to the browser and filtering it there.
 */

export const dynamic = "force-dynamic";

type Search = { q?: string; category?: string; cursor?: string };

export default async function ServicesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { q, category, cursor } = await searchParams;
  const cookie = await forwardedCookie();

  const query = new URLSearchParams({ limit: "40" });
  if (q) query.set("q", q);
  if (category) query.set("category", category);
  if (cursor) query.set("cursor", cursor);

  const [categoriesResult, servicesResult] = await Promise.all([
    api.call<Category[]>("/catalogue/categories", { cookie }),
    api.call<Page<Service>>(`/catalogue/services?${query.toString()}`, { cookie }),
  ]);

  const categories = categoriesResult.ok ? categoriesResult.data : [];
  const services = servicesResult.ok ? servicesResult.data.items : [];
  const nextCursor = servicesResult.ok ? servicesResult.data.nextCursor : null;

  const link = (next: Partial<Search>) => {
    const params = new URLSearchParams();
    const merged = { q, category, ...next };
    if (merged.q) params.set("q", merged.q);
    if (merged.category) params.set("category", merged.category);
    if (merged.cursor) params.set("cursor", merged.cursor);
    const query = params.toString();
    return query ? `/services?${query}` : "/services";
  };

  return (
    <>
      <div className={styles.head}>
        <h1 className={styles.title}>All services</h1>
        <p className={styles.sub}>
          {categories.length} categories. Prices include GST; a professional is assigned as soon as
          you pay.
        </p>
      </div>

      {/* A GET form, so the query lands in the URL and the page stays shareable. */}
      <form className={styles.controls} action="/services" method="get">
        {category && <input type="hidden" name="category" value={category} />}
        <input
          className={styles.search}
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search services — GST, trademark, incorporation…"
          aria-label="Search services"
        />
        <button type="submit" className={styles.submit}>
          Search
        </button>
      </form>

      <div className={styles.filters}>
        <Link
          href={link({ category: undefined, cursor: undefined })}
          className={styles.chip}
          aria-current={!category}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={link({ category: c.slug, cursor: undefined })}
            className={styles.chip}
            aria-current={category === c.slug}
          >
            {c.label}
            <span className={styles.count}>{c.serviceCount}</span>
          </Link>
        ))}
      </div>

      {services.length === 0 ? (
        <div className={styles.empty}>
          <strong>Nothing matches that yet.</strong>
          {q ? (
            <>
              No priced service matches “{q}”. <Link href="/services">Clear the search</Link>.
            </>
          ) : (
            "No services in this category are on sale yet."
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {services.map((service) => (
            <ServiceCard key={`${service.categorySlug}/${service.slug}`} service={service} />
          ))}
        </div>
      )}

      {nextCursor && (
        <div className={styles.more}>
          {/* Cursor, not page number — the API pages by keyset so nothing is skipped
              or repeated when the catalogue changes between requests. */}
          <Link href={link({ cursor: nextCursor })} className={styles.moreLink}>
            Show more
          </Link>
        </div>
      )}
    </>
  );
}

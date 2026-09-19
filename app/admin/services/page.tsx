import Link from "next/link";
import { api, type AdminService, type Category, type Page } from "@/lib/api";
import { forwardedCookie } from "@/lib/session";
import { ServiceRow } from "./ServiceRow";
import styles from "../admin.module.css";

/**
 * Catalogue and pricing.
 *
 * Defaults to the unpriced rows, because that is the work: 259 services arrive with no
 * price and none of them can be sold until someone sets one.
 */

export const dynamic = "force-dynamic";

type Search = { q?: string; category?: string; state?: string; cursor?: string };

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { q, category, state, cursor } = await searchParams;
  const cookie = await forwardedCookie();

  const query = new URLSearchParams({ limit: "60" });
  if (q) query.set("q", q);
  if (category) query.set("category", category);
  if (state === "live") query.set("active", "true");
  if (state === "draft") query.set("active", "false");
  if (cursor) query.set("cursor", cursor);

  const [categoriesResult, servicesResult] = await Promise.all([
    api.call<Category[]>("/catalogue/categories", { cookie }),
    api.call<Page<AdminService>>(`/admin/services?${query.toString()}`, { cookie }),
  ]);

  const categories = categoriesResult.ok ? categoriesResult.data : [];
  const services = servicesResult.ok ? servicesResult.data.items : [];
  const nextCursor = servicesResult.ok ? servicesResult.data.nextCursor : null;

  return (
    <>
      <h1 className={styles.title}>Catalogue</h1>
      <p className={styles.sub}>
        Prices are in whole rupees and include GST. A service needs both a price and a turnaround
        before it can go on sale — the database enforces that, not the form.
      </p>

      <form className={styles.controls} action="/admin/services" method="get">
        <input
          className={styles.search}
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by title or slug"
          aria-label="Search the catalogue"
        />

        <select
          className={styles.select}
          name="category"
          defaultValue={category ?? ""}
          aria-label="Category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          name="state"
          defaultValue={state ?? ""}
          aria-label="Publication state"
        >
          <option value="">Everything</option>
          <option value="draft">Drafts only</option>
          <option value="live">On sale only</option>
        </select>

        <button type="submit" className={styles.button}>
          Filter
        </button>
      </form>

      <div className={styles.tableWrap}>
        {services.length === 0 ? (
          <div className={styles.empty}>Nothing matches that filter.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Service</th>
                <th>Price (₹)</th>
                <th>Days</th>
                <th>State</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <ServiceRow key={`${service.categorySlug}/${service.slug}`} service={service} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {nextCursor && (
        <div className={styles.more}>
          <Link
            href={`/admin/services?${new URLSearchParams({
              ...(q ? { q } : {}),
              ...(category ? { category } : {}),
              ...(state ? { state } : {}),
              cursor: nextCursor,
            }).toString()}`}
            className={styles.ghost}
          >
            Show more
          </Link>
        </div>
      )}
    </>
  );
}

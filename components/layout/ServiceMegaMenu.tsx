"use client";

import {
  CSSProperties,
  useEffect,
  useMemo,
  useState,
} from "react";

import { serviceCatalog } from "@/data/serviceCatalog";
import { serviceHref } from "@/lib/serviceRoutes";

type Props = {
  open: boolean;
  initialQuery: string;
  onClose: () => void;
};

export function ServiceMegaMenu({
  open,
  initialQuery,
  onClose,
}: Props) {
  const [active, setActive] = useState(
    serviceCatalog[0].slug
  );

  const [query, setQuery] = useState("");

  const group =
    serviceCatalog.find(
      (item) => item.slug === active
    ) ?? serviceCatalog[0];

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return [];

    return serviceCatalog.flatMap((category) =>
      category.services
        .filter((service) =>
          service.toLowerCase().includes(value)
        )
        .map((service) => ({
          service,
          category: category.label,
          accent: category.accent,
          categorySlug: category.slug,
        }))
    );
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
      document.documentElement.classList.add(
        "v3-menu-open"
      );
    } else {
      document.documentElement.classList.remove(
        "v3-menu-open"
      );
    }

    return () =>
      document.documentElement.classList.remove(
        "v3-menu-open"
      );
  }, [open, initialQuery]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", close);

    return () =>
      window.removeEventListener(
        "keydown",
        close
      );
  }, [onClose]);

  return (
    <>
      <button
        className={`v3-mega-backdrop ${
          open ? "active" : ""
        }`}
        type="button"
        aria-label="Close services"
        onClick={onClose}
      />

      <aside
        className={`v3-mega ${
          open ? "active" : ""
        }`}
        data-lenis-prevent
      >
        <div className="v3-mega-top">
          <div>
            <span>LAWXYGEN</span>
            <strong>Explore services</strong>
          </div>

          <button
            type="button"
            className="v3-mega-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          className="v3-mega-search"
          onSubmit={(event) =>
            event.preventDefault()
          }
        >
          <span>⌕</span>

          <input
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search company registration, GST, trademark..."
            autoFocus={open}
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
            >
              Clear
            </button>
          )}
        </form>

        {query ? (
          <div
            className="v3-mega-results"
            data-lenis-prevent
          >
            {results.map((item) => (
              <a
                href={serviceHref(item.categorySlug, item.service)}
                className="v3-search-result"
                key={`${item.category}-${item.service}`}
              >
                <i
                  style={{
                    background: item.accent,
                  }}
                />

                <div>
                  <strong>{item.service}</strong>
                  <span>{item.category}</span>
                </div>

                <b>↗</b>
              </a>
            ))}

            {!results.length && (
              <div className="v3-no-result">
                No matching service found.
              </div>
            )}
          </div>
        ) : (
          <div className="v3-mega-layout">
            <nav
              className="v3-mega-categories"
              data-lenis-prevent
            >
              {serviceCatalog.map((item) => (
                <button
                  type="button"
                  key={item.slug}
                  className={
                    active === item.slug
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActive(item.slug)
                  }
                  onMouseEnter={() =>
                    setActive(item.slug)
                  }
                >
                  <i
                    style={{
                      background: item.accent,
                    }}
                  />

                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div
              className="v3-mega-services"
              data-lenis-prevent
              style={
                {
                  "--mega-accent":
                    group.accent,
                } as CSSProperties
              }
            >
              <div className="v3-mega-heading">
                <span>Category</span>
                <h2>{group.label}</h2>
              </div>

              <div className="v3-mega-service-list">
                {group.services.map(
                  (service, index) => (
                    <a href={serviceHref(group.slug, service)} key={service}>
                      <span>
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <strong>{service}</strong>

                      <b>↗</b>
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
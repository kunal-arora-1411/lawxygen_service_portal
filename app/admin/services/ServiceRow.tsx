"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  API_ORIGIN,
  paiseToRupees,
  rupeesToPaise,
  type AdminService,
  type ApiResult,
} from "@/lib/api";
import styles from "../admin.module.css";

/**
 * One editable row of the catalogue.
 *
 * Price is entered in whole rupees and converted to integer paise before it leaves the
 * browser — the API accepts nothing else. A decimal input would mean a float somewhere
 * between here and the ledger, and money that has been through a float can be a paisa
 * out.
 *
 * Publishing is a separate action from saving, deliberately. Setting a price should not
 * silently put something on sale.
 */
export function ServiceRow({ service }: { service: AdminService }) {
  const router = useRouter();

  const [rupees, setRupees] = useState(paiseToRupees(service.pricePaise));
  const [days, setDays] = useState(service.turnaroundDays?.toString() ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceValid = rupees === "" || rupeesToPaise(rupees) !== null;
  const daysValid = days === "" || /^\d+$/.test(days);
  const dirty =
    rupees !== paiseToRupees(service.pricePaise) ||
    days !== (service.turnaroundDays?.toString() ?? "");

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_ORIGIN}/admin/services/${service.categorySlug}/${service.slug}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );
      const result = (await response.json()) as ApiResult<AdminService>;
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  function save() {
    if (!priceValid || !daysValid) return;
    void patch({
      pricePaise: rupees === "" ? null : rupeesToPaise(rupees),
      turnaroundDays: days === "" ? null : Number(days),
    });
  }

  const publishable = service.pricePaise !== null && service.turnaroundDays !== null;

  return (
    <tr>
      <td>
        <div className={styles.serviceName}>{service.title}</div>
        <div className={styles.serviceMeta}>
          {service.categoryLabel}
          {service.fulfilmentType === "consultation" && " · consultation"}
        </div>
        {error && <div className={styles.rowError}>{error}</div>}
      </td>

      <td>
        <input
          className={styles.priceInput}
          value={rupees}
          onChange={(e) => setRupees(e.target.value)}
          inputMode="numeric"
          placeholder="₹"
          aria-label={`Price in rupees for ${service.title}`}
          aria-invalid={!priceValid}
          disabled={busy}
        />
      </td>

      <td>
        <input
          className={`${styles.priceInput} ${styles.dayInput}`}
          value={days}
          onChange={(e) => setDays(e.target.value)}
          inputMode="numeric"
          placeholder="days"
          aria-label={`Turnaround days for ${service.title}`}
          aria-invalid={!daysValid}
          disabled={busy}
        />
      </td>

      <td>
        <span className={`${styles.badge} ${service.active ? styles.live : styles.draft}`}>
          {service.active ? "On sale" : "Draft"}
        </span>
      </td>

      <td>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.ghost}
            onClick={save}
            disabled={busy || !dirty || !priceValid || !daysValid}
          >
            Save
          </button>

          {service.active ? (
            <button
              type="button"
              className={`${styles.ghost} ${styles.danger}`}
              onClick={() => void patch({ active: false })}
              disabled={busy}
            >
              Withdraw
            </button>
          ) : (
            <button
              type="button"
              className={styles.ghost}
              onClick={() => void patch({ active: true })}
              // The API refuses this anyway — the CHECK constraint is the real guard.
              // Disabling it here just avoids an error the operator could have been
              // spared.
              disabled={busy || !publishable || dirty}
              title={publishable ? undefined : "Set a price and a turnaround first, then save."}
            >
              Put on sale
            </button>
          )}

          <button
            type="button"
            className={styles.ghost}
            onClick={() => void patch({ featured: !service.featured })}
            disabled={busy || !service.active}
            title={service.active ? undefined : "Only services on sale can be featured."}
            aria-pressed={service.featured}
          >
            {service.featured ? "★ Featured" : "☆ Feature"}
          </button>
        </div>
      </td>
    </tr>
  );
}

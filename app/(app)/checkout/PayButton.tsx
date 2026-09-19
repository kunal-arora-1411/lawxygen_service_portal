"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, type ApiResult } from "@/lib/api";
import styles from "./page.module.css";

/**
 * Create the order, then open the gateway.
 *
 * Two calls, deliberately in this order. The order exists before any money is
 * involved, so a client who abandons the gateway still has something to come back to
 * — that is what makes "payment pending" a resumable state rather than a lost sale.
 *
 * The amount is never sent: the API reads it from the order's own snapshot. A
 * client-supplied amount is a client-chosen price.
 */
export function PayButton({
  category,
  service,
  existingReference,
}: {
  category?: string;
  service?: string;
  existingReference?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setBusy(true);
    setError(null);

    try {
      let reference = existingReference;

      if (!reference) {
        const created = await fetch(`${API_ORIGIN}/orders`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ category, service }),
        });
        const result = (await created.json()) as ApiResult<{ reference: string }>;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        reference = result.data.reference;
      }

      const intent = await fetch(`${API_ORIGIN}/payments/${reference}/intent`, {
        method: "POST",
        credentials: "include",
      });
      const result = (await intent.json()) as ApiResult<{
        gatewayOrderId: string;
        amountPaise: number;
        currency: string;
        keyId: string | null;
      }>;

      if (!result.ok) {
        /**
         * The order survives a failed intent. Sending the client to their orders list
         * rather than stranding them here means the attempt is visible and resumable
         * instead of looking like nothing happened.
         */
        setError(`${result.message} Your order ${reference} is saved and can be paid later.`);
        return;
      }

      // TODO: open Razorpay Checkout with result.data.gatewayOrderId once the
      // account exists. Until then the order and gateway order are both created and
      // the capture path is driven by the webhook.
      router.push(`/orders`);
      router.refresh();
    } catch {
      setError("Could not reach Lawxygen. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      <button type="button" className={styles.pay} onClick={() => void pay()} disabled={busy}>
        {busy ? "Starting payment…" : "Pay and get started"}
      </button>
      <p className={styles.reassure}>
        A qualified professional is assigned automatically once your payment clears. You will get a
        GST invoice straight away.
      </p>
    </>
  );
}

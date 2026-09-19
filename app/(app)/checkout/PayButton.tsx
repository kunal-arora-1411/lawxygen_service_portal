"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ORIGIN, type ApiResult } from "@/lib/api";
import styles from "./page.module.css";

/**
 * Create the order, open the gateway, then ask the server what happened.
 *
 * Three steps, deliberately in this order. The order exists before any money is
 * involved, so a client who abandons the gateway still has something to come back to
 * — that is what makes "payment pending" a resumable state rather than a lost sale.
 *
 * The amount is never sent: the API reads it from the order's own snapshot. A
 * client-supplied amount is a client-chosen price.
 *
 * The third step is the subtle one. Checkout's success callback runs in the browser
 * and is therefore worthless as evidence — anyone can call it. What it is good for is
 * *timing*: it tells us the moment worth asking the server to go and check with
 * Razorpay, instead of leaving the client watching a spinner until the webhook lands.
 * The server verifies the signature and then asks the gateway directly; nothing the
 * code below says is believed.
 */

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

type CheckoutSuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type CheckoutOptions = {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: { name?: string; email?: string; contact?: string };
  notes: Record<string, string>;
  theme: { color: string };
  handler: (response: CheckoutSuccess) => void;
  modal: { ondismiss: () => void };
};

type RazorpayInstance = { open: () => void };

declare global {
  interface Window {
    Razorpay?: new (options: CheckoutOptions) => RazorpayInstance;
  }
}

/**
 * Loaded on demand rather than on every page.
 *
 * Checkout's script is ~100KB and only matters to somebody who reached this button.
 * Resolving an existing tag rather than appending a second one matters because React
 * strict mode runs effects twice in development and a double-loaded Checkout leaks a
 * second modal.
 */
function loadCheckout(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("no window"));
      return;
    }
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => {
        resolve();
      });
      existing.addEventListener("error", () => {
        reject(new Error("checkout failed to load"));
      });
      return;
    }

    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.addEventListener("load", () => {
      resolve();
    });
    script.addEventListener("error", () => {
      reject(new Error("checkout failed to load"));
    });
    document.body.appendChild(script);
  });
}

export function PayButton({
  category,
  service,
  serviceTitle,
  existingReference,
  prefill,
}: {
  category?: string;
  service?: string;
  serviceTitle?: string;
  existingReference?: string;
  prefill?: { name?: string; email?: string; contact?: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Asks the server whether the payment landed.
   *
   * A "pending" answer is not a failure: an authorised payment that Razorpay has not
   * captured yet is an ordinary intermediate state the webhook will finish. Saying so
   * and sending the client to their orders, where the status is live, beats inventing
   * either an error or a success.
   */
  async function confirm(reference: string, success: CheckoutSuccess) {
    setStatus("Confirming your payment…");
    try {
      const response = await fetch(`${API_ORIGIN}/payments/${reference}/confirm`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          paymentId: success.razorpay_payment_id,
          signature: success.razorpay_signature,
        }),
      });
      const result = (await response.json()) as ApiResult<{ status: "paid" | "pending" }>;

      if (!result.ok) {
        // The money may well have left their account. Never say it did not.
        setError(
          `We could not confirm it here: ${result.message} If you were charged, your order ${reference} will update on its own — nothing is lost.`,
        );
        return;
      }
    } catch {
      setError(
        `Your payment went through but we could not reach Lawxygen to confirm it. Order ${reference} will update on its own.`,
      );
      return;
    } finally {
      setStatus(null);
    }

    router.push("/orders");
    router.refresh();
  }

  async function pay() {
    setBusy(true);
    setError(null);

    /**
     * Not state: `finally` below runs in the same tick and would read a stale `busy`.
     * Once the widget is up the button must stay disabled behind it, because a second
     * press creates a second gateway order for the same order.
     */
    let widgetOpen = false;

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

      if (!result.data.keyId) {
        setError(
          `Payments are not switched on yet. Your order ${reference} is saved and can be paid once they are.`,
        );
        return;
      }

      await loadCheckout();
      const Checkout = window.Razorpay;
      if (!Checkout) throw new Error("checkout unavailable");

      const settled = reference;
      const checkout = new Checkout({
        key: result.data.keyId,
        order_id: result.data.gatewayOrderId,
        amount: result.data.amountPaise,
        currency: result.data.currency,
        name: "Lawxygen",
        description: serviceTitle ?? "Professional services",
        prefill: prefill ?? {},
        notes: { orderReference: settled },
        theme: { color: "#1c5dd8" },
        handler: (response) => {
          void confirm(settled, response);
        },
        modal: {
          // Closing the widget is not an error. The order is still there.
          ondismiss: () => {
            setBusy(false);
            setStatus(null);
            setError(
              `Payment cancelled. Order ${settled} is saved — you can pay for it from your orders at any time.`,
            );
          },
        },
      });

      widgetOpen = true;
      checkout.open();
    } catch {
      setError("Could not reach Lawxygen. Check your connection and try again.");
    } finally {
      if (!widgetOpen) setBusy(false);
    }
  }

  return (
    <>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      {status && (
        <div className={styles.error} role="status">
          {status}
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

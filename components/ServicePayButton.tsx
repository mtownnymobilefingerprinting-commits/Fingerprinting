"use client";

import { useState } from "react";
import type { ServiceConfig } from "../config/services";

function parseAmount(price: string) {
  const match = price.match(/\$([0-9]+(?:\.[0-9]{1,2})?)/);
  if (!match) {
    return undefined;
  }

  return Math.round(parseFloat(match[1]) * 100);
}

type ServicePayButtonProps = {
  service: ServiceConfig;
  className?: string;
};

export function ServicePayButton({ service, className }: ServicePayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = parseAmount(service.price);
  const isDisabled = !amount;
  const buttonLabel = isDisabled ? "Contact for pricing" : isLoading ? "Processing…" : "Pay Now";

  const handlePayNow = async () => {
    if (!amount) {
      setError("Payment is not available for this service. Please contact us for pricing.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          serviceTitle: service.title,
          amount
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to create checkout session.");
      }

      window.location.assign(data.url);
    } catch (err) {
      setError((err as Error).message || "Unable to start payment.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handlePayNow}
        disabled={isLoading || isDisabled}
        className={
          className ||
          "rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {buttonLabel}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </>
  );
}

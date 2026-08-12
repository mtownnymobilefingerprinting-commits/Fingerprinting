"use client";

import { useState } from "react";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";

export default function PayPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayNow = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: "mobileInk",
          serviceTitle: "Mobile Ink Fingerprinting",
          amount: 12500
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to create checkout session.");
      }

      window.location.assign(data.url);
    } catch (err) {
      setError((err as Error).message || "Unable to start payment.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 text-blue-950">
      <Navigation />
      <main className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <div className="space-y-8 rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.24em] text-blue-900">Secure payment</p>
            <h1 className="text-4xl font-semibold text-blue-950">Pay Now</h1>
            <p className="text-lg leading-8 text-blue-800">
              Use the secure checkout page to complete your fingerprinting payment. We never expose your Stripe secret key in the browser.
            </p>
          </div>

          <div className="grid gap-6 rounded-3xl border border-blue-100 bg-blue-50 p-6 text-blue-900 sm:grid-cols-2">
            <div>
              <h2 className="text-base font-semibold text-blue-950">Service</h2>
              <p className="mt-2">Mobile Ink Fingerprinting</p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-blue-950">Amount</h2>
              <p className="mt-2 text-lg font-semibold text-blue-950">$125.00</p>
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="button"
            onClick={handlePayNow}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isProcessing ? "Processing payment…" : "Pay Now"}
          </button>

          <p className="text-sm leading-7 text-blue-800">
            If the payment does not start, confirm that your Stripe secret key is configured as `STRIPE_SECRET_KEY` on the server.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

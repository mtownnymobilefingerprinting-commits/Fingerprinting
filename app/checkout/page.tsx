"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";

type QuoteFormValues = {
  companyName?: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  employees?: string;
  serviceNeeded: string;
  fingerprintType: string;
  businessAddress: string;
  preferredDate?: string;
  notes?: string;
};

export default function CheckoutPage() {
  const [quote, setQuote] = useState<QuoteFormValues | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("fingerprintQuoteRequest");
    if (stored) {
      try {
        setQuote(JSON.parse(stored));
      } catch {
        setQuote(null);
      }
    }
  }, []);

  const onPay = async () => {
    if (!quote) return;
    setError(null);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quote)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to create checkout session.");
      }

      window.location.assign(data.url);
    } catch (err) {
      setError((err as Error).message || "Unable to complete payment.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Checkout</p>
            <h1 className="text-3xl font-semibold text-slate-950">Review your quote and pay $125</h1>
            <p className="text-sm leading-7 text-slate-600">
              Your quote details are saved locally. Confirm the request below and proceed to secure checkout to complete the fixed-price payment.
            </p>
          </div>

          {!quote ? (
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
              <p className="text-lg font-semibold text-slate-950">Quote details not found</p>
              <p>Please return to the quote form and submit your request again.</p>
              <Link href="/contact" className="inline-flex rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">
                Return to contact page
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700 sm:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">Contact</h2>
                  <p>{quote.contactName}</p>
                  <p>{quote.email}</p>
                  <p>{quote.phone}</p>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-950">Location</h2>
                  <p>{quote.businessAddress}</p>
                  <p>{quote.preferredDate || "No preferred date"}</p>
                </div>
              </div>

              <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700 sm:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">Service requested</h2>
                  <p>{quote.serviceNeeded}</p>
                  <p className="mt-2 text-sm text-slate-500">{quote.fingerprintType}</p>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-950">Pricing</h2>
                  <p className="text-lg font-semibold text-slate-950">$125 per person</p>
                  <p className="mt-2 text-sm text-slate-500">{quote.employees ? `People: ${quote.employees}` : "Number of people not specified"}</p>
                </div>
              </div>

              {quote.notes ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                  <h2 className="text-base font-semibold text-slate-950">Notes</h2>
                  <p>{quote.notes}</p>
                </div>
              ) : null}

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onPay}
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isProcessing ? "Processing payment…" : "Proceed to payment"}
                </button>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
                >
                  Edit quote request
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

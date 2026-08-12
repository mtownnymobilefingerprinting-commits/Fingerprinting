"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({
  pricing,
  onSuccess,
}: {
  pricing: any;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: "if_required", // Stays on page if card doesn't require 3D Secure redirect
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed.");
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-2xl bg-blue-950 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-900 disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${pricing.total.toFixed(2)} Now`}
      </button>
    </form>
  );
}

export function PayNowModal({
  isOpen,
  onClose,
  serviceTitle = "Fingerprinting Service",
  basePrice = 125,
}: {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
  basePrice?: number;
}) {
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [loadingPricing, setLoadingPricing] = useState(false);

  if (!isOpen) return null;

  const handleCalculateAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPricing(true);

    // Geocode address using free Nominatim API to get lat/lng for distance calculation
    let destLat = 41.4459; // Default fallback
    let destLng = -74.4229;

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const geoData = await geoRes.json();
      if (geoData && geoData.length > 0) {
        destLat = parseFloat(geoData[0].lat);
        destLng = parseFloat(geoData[0].lon);
      }
    } catch (err) {
      console.warn("Geocoding failed, defaulting to Middletown base area.");
    }

    // Call API to create Payment Intent
    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address, destLat, destLng, basePrice }),
    });

    const data = await res.json();
    setLoadingPricing(false);

    if (data.clientSecret) {
      setClientSecret(data.clientSecret);
      setPricing(data.pricing);
      setStep("payment");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-950">{serviceTitle}</h3>
            <p className="text-xs text-slate-500">Secure On-Page Payment</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {step === "details" && (
          <form onSubmit={handleCalculateAndPay} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Physical Service Address (to calculate travel fee from Middletown, NY)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 123 Main St, Goshen, NY 10924"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-blue-950 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loadingPricing}
              className="w-full rounded-2xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-500 disabled:opacity-50"
            >
              {loadingPricing ? "Calculating Distance & Total..." : "Continue to Payment"}
            </button>
          </form>
        )}

        {step === "payment" && clientSecret && pricing && (
          <div className="space-y-4">
            {/* Breakdown Card */}
            <div className="rounded-2xl bg-slate-50 p-4 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Travel Fee ({pricing.distanceInMiles} mi from Middletown, NY):
                </span>
                <span>+${pricing.travelFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (4%):</span>
                <span>+${pricing.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 font-bold text-sm text-slate-950 border-t border-slate-200">
                <span>Total Amount:</span>
                <span>${pricing.total.toFixed(2)}</span>
              </div>
            </div>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm pricing={pricing} onSuccess={() => setStep("success")} />
            </Elements>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-3 py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-950 text-xl">
              ✓
            </div>
            <h4 className="text-xl font-bold text-slate-950">Payment Successful!</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thank you, {name}. Your payment of <strong>${pricing?.total.toFixed(2)}</strong> has been processed cleanly. We will be coming to {address}.
            </p>
            <button
              onClick={onClose}
              className="mt-4 rounded-xl bg-blue-950 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-900"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
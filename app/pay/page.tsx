"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { CalendlyModal } from "../../components/CalendlyModal";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SERVICES_LIST = [
  { id: "mobile-ink", title: "Mobile Ink Fingerprinting" },
  { id: "fd258", title: "FD-258 Fingerprint Cards" },
  { id: "fbiCard", title: "FBI Fingerprint Cards" },
  { id: "immigration", title: "Immigration Fingerprinting" },
  { id: "adoption", title: "Adoption Fingerprinting" },
  { id: "personalRecordReview", title: "Personal Record Review" },
  { id: "employment", title: "Employment Fingerprinting" },
  { id: "nursingLicense", title: "Nursing License Fingerprinting" },
  { id: "teacherCertification", title: "Teacher Certification Fingerprinting" },
  { id: "securityGuard", title: "Security Guard Fingerprinting" },
  { id: "realEstateLicense", title: "Real Estate License Fingerprinting" },
  { id: "finra", title: "FINRA Fingerprinting" },
  { id: "corporate", title: "Corporate Fingerprinting" },
  { id: "onSiteBusiness", title: "On-Site Business Fingerprinting" },
  { id: "group", title: "Group Fingerprinting" },
  { id: "staffingAgency", title: "Staffing Agency Fingerprinting" },
  { id: "healthcare", title: "Healthcare Facility Fingerprinting" },
  { id: "governmentContractor", title: "Government Contractor Fingerprinting" },
];

function EmbeddedCheckoutForm({
  pricing,
  onPaymentSuccess,
}: {
  pricing: any;
  onPaymentSuccess: () => void;
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
        return_url: typeof window !== "undefined" ? window.location.href : "",
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed. Please check your card details.");
      setLoading(false);
    } else {
      setLoading(false);
      onPaymentSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-2">
      <PaymentElement />
      {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-full bg-blue-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Processing Payment..." : `Pay $${pricing.total.toFixed(2)} & Book Appointment`}
      </button>
    </form>
  );
}

function PayForm() {
  const searchParams = useSearchParams();
  const paramService = searchParams.get("service") || "mobile-ink";

  const [selectedServiceId, setSelectedServiceId] = useState(paramService);
  const [step, setStep] = useState<"details" | "payment" | "booked">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const basePrice = 125;

  // Sync state if URL searchParam changes
  useEffect(() => {
    if (paramService) {
      setSelectedServiceId(paramService);
    }
  }, [paramService]);

  const currentServiceObj =
    SERVICES_LIST.find((s) => s.id === selectedServiceId) || SERVICES_LIST[0];

  const handleCalculateAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    let destLat = 41.4459;
    let destLng = -74.4229;

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const geoData = await geoRes.json();
      if (geoData && geoData.length > 0) {
        destLat = parseFloat(geoData[0].lat);
        destLng = parseFloat(geoData[0].lon);
      }
    } catch (err) {
      console.warn("Geocoding fallback used.");
    }

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTitle: currentServiceObj.title,
          name,
          phone,
          address,
          destLat,
          destLng,
          basePrice,
        }),
      });

      // Safely check if server returned JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const rawText = await response.text();
        console.error("Non-JSON API response received:", rawText);
        throw new Error(
          "Server configuration error. Please ensure Vercel finished deploying and your API route is active."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create payment intent.");
      }

      setClientSecret(data.clientSecret);
      setPricing(data.pricing);
      setStep("payment");
    } catch (err) {
      setError((err as Error).message || "Unable to start payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <div className="space-y-8 rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
        {step !== "booked" ? (
          <>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-blue-900">
                Step {step === "details" ? "1" : "2"} of 2
              </p>
              <h1 className="text-4xl font-semibold text-blue-950">
                {step === "details" ? "Enter Details" : "Complete Payment"}
              </h1>
              <p className="text-lg leading-8 text-blue-800">
                Payment is required before picking an appointment time. Once paid, you will instantly pick your date and time slot.
              </p>
            </div>

            {/* Service Selection Dropdown */}
            <div className="grid gap-6 rounded-3xl border border-blue-100 bg-blue-50 p-6 text-blue-900 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-blue-950">Service</label>
                {step === "details" ? (
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-blue-200 bg-white px-3 py-2.5 text-base text-blue-950 shadow-sm focus:border-blue-950 focus:outline-none"
                  >
                    {SERVICES_LIST.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        {svc.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-2 text-base font-semibold text-blue-950">
                    {currentServiceObj.title}
                  </p>
                )}
              </div>
              <div>
                <h2 className="text-base font-semibold text-blue-950">Base Amount</h2>
                <p className="mt-2 text-lg font-semibold text-blue-950">${basePrice.toFixed(2)}</p>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            {step === "details" && (
              <form onSubmit={handleCalculateAndPay} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-blue-950">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-base text-blue-950 focus:border-blue-950 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-950">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="(888) 219-4681"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-base text-blue-950 focus:border-blue-950 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-950">
                    Physical Service Address (for travel calculation)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123 Main St, Goshen, NY 10924"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-base text-blue-950 focus:border-blue-950 focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isProcessing ? "Calculating Total..." : "Continue to Payment"}
                </button>
              </form>
            )}

            {step === "payment" && clientSecret && pricing && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 text-sm text-blue-950 space-y-2">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-semibold">{currentServiceObj.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Rate:</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Travel Fee ({pricing.distanceInMiles} miles from Middletown, NY):</span>
                    <span>+${pricing.travelFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales Tax (4%):</span>
                    <span>+${pricing.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-3 text-base font-bold">
                    <span>Total Due:</span>
                    <span>${pricing.total.toFixed(2)}</span>
                  </div>
                </div>

                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <EmbeddedCheckoutForm
                    pricing={pricing}
                    onPaymentSuccess={() => {
                      setStep("booked");
                      setIsCalendlyOpen(true);
                    }}
                  />
                </Elements>

                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-xs text-blue-800 hover:underline"
                >
                  ← Edit details or address
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-3xl font-bold">
              ✓
            </div>
            <h2 className="text-3xl font-bold text-blue-950">Payment Verified!</h2>
            <p className="text-blue-800 max-w-md mx-auto text-base">
              Thank you, <strong>{name}</strong>. Your payment for <strong>{currentServiceObj.title}</strong> (${pricing?.total?.toFixed(2)}) has been processed. Please pick your appointment time below.
            </p>
            <button
              type="button"
              onClick={() => setIsCalendlyOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-blue-950 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-900"
            >
              Schedule Appointment Date & Time
            </button>
          </div>
        )}
      </div>

      {isCalendlyOpen && (
        <CalendlyModal
          open={isCalendlyOpen}
          onClose={() => setIsCalendlyOpen(false)}
          url={`https://calendly.com/mtownnymobilefingerprinting/30min?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`}
        />
      )}
    </main>
  );
}

export default function PayPage() {
  return (
    <div className="min-h-screen bg-brand-50 text-blue-950">
      <Navigation />
      <Suspense fallback={<div className="p-10 text-center">Loading checkout...</div>}>
        <PayForm />
      </Suspense>
      <Footer />
    </div>
  );
} 
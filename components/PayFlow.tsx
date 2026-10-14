"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { findService, services } from "../config/services";
import { policies } from "../config/policies";
import { siteConfig } from "../config/site";
import { formatCents, PRICING, type PriceQuote } from "../lib/pricing";
import { StepIndicator } from "./StepIndicator";
import { scheduleHref as scheduleHrefFor, setPendingBooking } from "../lib/pendingBooking";

// Load Stripe.js only once the customer reaches the payment step.
let stripePromise: Promise<Stripe | null> | null = null;
function getStripe() {
  stripePromise ??= import("@stripe/stripe-js").then(({ loadStripe }) =>
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  );
  return stripePromise;
}

type Checkout = {
  clientSecret: string;
  token: string;
  reference: string;
  serviceTitle: string;
  quote: PriceQuote;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-base text-blue-950 focus:border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/30 aria-[invalid=true]:border-red-700";

function PaymentForm({ checkout }: { checkout: Checkout }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scheduleHref = scheduleHrefFor(checkout.token);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || submitting) return;
    setSubmitting(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: new URL(scheduleHref, window.location.origin).toString() },
      redirect: "if_required",
    });

    const intentStatus = stripeError?.payment_intent?.status;
    if (stripeError && intentStatus !== "succeeded" && intentStatus !== "processing") {
      setError(stripeError.message || "Your payment didn't go through. Please check your card details.");
      setSubmitting(false);
      return;
    }
    // Remember on this device that booking is still required. The schedule page
    // verifies the payment with Stripe on the server before unlocking anything.
    setPendingBooking(checkout.token);
    window.location.replace(scheduleHref);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6" aria-describedby={error ? "payment-error" : undefined}>
      <PaymentElement />
      <div aria-live="assertive">
        {error && (
          <p id="payment-error" className="text-sm font-medium text-red-700">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full rounded-full bg-blue-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-500"
      >
        {submitting ? "Processing payment…" : `Pay ${formatCents(checkout.quote.totalCents)}, then Schedule`}
      </button>
    </form>
  );
}

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "address", string>>;

export function PayFlow() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("service");
  const initial = findService(requested) ?? services[0];

  const [serviceId, setServiceId] = useState(initial.id);
  const [people, setPeople] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const match = findService(requested);
    if (match) setServiceId(match.id);
  }, [requested]);

  useEffect(() => {
    if (checkout) headingRef.current?.focus();
  }, [checkout]);

  const service = findService(serviceId) ?? services[0];
  const unknownService = requested !== null && !findService(requested);

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (name.trim().length < 2) errors.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = "Enter a valid email so we can send your scheduling link.";
    if (phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a 10-digit phone number.";
    if (address.trim().length < 5) errors.address = "Enter the street address where we should meet you.";
    return errors;
  };

  const onDetailsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    const errors = validate();
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length) {
      document.getElementById(`field-${Object.keys(errors)[0]}`)?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: service.id, people, name, email, phone, address }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "We couldn't start checkout. Please try again.");
      setCheckout(data as Checkout);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const describedBy = (field: keyof FieldErrors, hint?: string) =>
    [hint, fieldErrors[field] ? `error-${field}` : null].filter(Boolean).join(" ") || undefined;

  const fieldError = (field: keyof FieldErrors) =>
    fieldErrors[field] ? (
      <p id={`error-${field}`} className="mt-1 text-sm text-red-700">
        {fieldErrors[field]}
      </p>
    ) : null;

  return (
    <main id="main" className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-8">
        <StepIndicator current={checkout ? "Payment" : "Details"} />

        <div className="space-y-3">
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold text-blue-950 focus:outline-none sm:text-4xl">
            {checkout ? "Review & pay" : "Your details"}
          </h1>
          <p className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-base leading-7 text-blue-950">
            {policies.payFirstNotice}
          </p>
        </div>

        {!checkout ? (
          <form noValidate onSubmit={onDetailsSubmit} className="space-y-6">
            {unknownService && (
              <p role="status" className="text-sm text-slate-700">
                We couldn’t find the service in your link, so please choose one below.
              </p>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="field-service" className="block text-sm font-semibold text-blue-950">
                  Service
                </label>
                <select id="field-service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={inputClass}>
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="field-people" className="block text-sm font-semibold text-blue-950">
                  Number of people
                </label>
                <select
                  id="field-people"
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value))}
                  aria-describedby="hint-people"
                  className={inputClass}
                >
                  {Array.from({ length: PRICING.maxOnlinePeople }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <p id="hint-people" className="mt-1 text-sm text-slate-700">
                  Larger group? <Link href="/contact" className="font-semibold text-blue-900 underline">Request a business quote</Link>.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="field-name" className="block text-sm font-semibold text-blue-950">
                  Full name
                </label>
                <input
                  id="field-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={describedBy("name")}
                  className={inputClass}
                />
                {fieldError("name")}
              </div>
              <div>
                <label htmlFor="field-phone" className="block text-sm font-semibold text-blue-950">
                  Phone number
                </label>
                <input
                  id="field-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={describedBy("phone")}
                  className={inputClass}
                />
                {fieldError("phone")}
              </div>
            </div>

            <div>
              <label htmlFor="field-email" className="block text-sm font-semibold text-blue-950">
                Email
              </label>
              <input
                id="field-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={describedBy("email", "hint-email")}
                className={inputClass}
              />
              <p id="hint-email" className="mt-1 text-sm text-slate-700">
                We email your receipt and a private link to pick your time.
              </p>
              {fieldError("email")}
            </div>

            <div>
              <label htmlFor="field-address" className="block text-sm font-semibold text-blue-950">
                Appointment address
              </label>
              <input
                id="field-address"
                type="text"
                autoComplete="street-address"
                required
                placeholder="123 Main St, Goshen, NY 10924"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                aria-invalid={Boolean(fieldErrors.address)}
                aria-describedby={describedBy("address", "hint-address")}
                className={inputClass}
              />
              <p id="hint-address" className="mt-1 text-sm text-slate-700">
                Used to calculate travel. {policies.travelAndTax}
              </p>
              {fieldError("address")}
            </div>

            <div aria-live="assertive">{formError && <p className="text-sm font-medium text-red-700">{formError}</p>}</div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-500 sm:w-auto"
            >
              {loading ? "Calculating your total…" : "Review total"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <dl className="space-y-2 rounded-3xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-950 sm:p-6">
              <div className="flex justify-between gap-4">
                <dt>Service</dt>
                <dd className="text-right font-semibold">{checkout.serviceTitle}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>
                  {checkout.quote.people} × {formatCents(PRICING.basePerPersonCents)} per person
                </dt>
                <dd>{formatCents(checkout.quote.baseCents)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Travel ({checkout.quote.distanceMiles} mi from Middletown, NY)</dt>
                <dd>{checkout.quote.travelFeeCents ? `+${formatCents(checkout.quote.travelFeeCents)}` : "Included"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Tax ({PRICING.taxRate * 100}%)</dt>
                <dd>+{formatCents(checkout.quote.taxCents)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-blue-200 pt-3 text-base font-bold">
                <dt>Total due today</dt>
                <dd>{formatCents(checkout.quote.totalCents)}</dd>
              </div>
            </dl>

            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <strong className="text-blue-950">Order {checkout.reference}.</strong>
              </p>
              {policies.inclusions && (
                <ul className="list-disc pl-5">
                  {policies.inclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              <p>
                {policies.cancellation ??
                  `Questions about cancellations or refunds? Call ${siteConfig.phoneDisplay} or email ${siteConfig.email} before paying.`}
              </p>
            </div>

            <Elements stripe={getStripe()} options={{ clientSecret: checkout.clientSecret }}>
              <PaymentForm checkout={checkout} />
            </Elements>

            <button type="button" onClick={() => setCheckout(null)} className="text-sm font-semibold text-blue-900 underline">
              ← Edit details or address
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

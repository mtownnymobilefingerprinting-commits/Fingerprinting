import Link from "next/link";
import { headers } from "next/headers";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { CalendlyScheduler } from "../../components/CalendlyScheduler";
import { ClearPendingBooking } from "../../components/ClearPendingBooking";
import { StepIndicator } from "../../components/StepIndicator";
import { siteConfig } from "../../config/site";
import { formatCents } from "../../lib/pricing";
import { privatePageMetadata } from "../../lib/seo";
import type { Order } from "../../lib/server/db";
import { bookingTagFor, bookingUrlForOrder, canSchedule, orderFromToken, reconcileBooking, reconcileOrder } from "../../lib/server/orders";

// Rendered per request: access depends on the token and on live payment status.
export const dynamic = "force-dynamic";
export const metadata = { ...privatePageMetadata, title: "Schedule your appointment" };

async function requestOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return `${h.get("x-forwarded-proto") ?? "https"}://${host}`;
}

async function loadOrder(token: string | undefined): Promise<Order | null> {
  const order = await orderFromToken(token);
  if (!order) return null;
  // If the webhook hasn't arrived yet, ask Stripe directly; if the customer booked
  // but the page never reported it, pick the booking up from Calendly.
  return reconcileBooking(await reconcileOrder(order, await requestOrigin()));
}

function Shell({ step, children }: { step: "Payment" | "Schedule" | "Confirmation"; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-50 text-blue-950">
      <Navigation />
      <main id="main" className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-6 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-8">
          <StepIndicator current={step} />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

const help = (reference?: string) => (
  <p className="text-sm text-slate-700">
    Need help{reference ? ` with order ${reference}` : ""}? Call{" "}
    <a href={`tel:${siteConfig.phone}`} className="font-semibold text-blue-900 underline">
      {siteConfig.phoneDisplay}
    </a>{" "}
    or email <span className="[overflow-wrap:anywhere]">{siteConfig.email}</span>.
  </p>
);

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  let order: Order | null = null;
  let failed = false;
  try {
    order = await loadOrder(t);
  } catch (error) {
    console.error("[schedule] failed to load order", error);
    failed = true;
  }

  if (failed) {
    return (
      <Shell step="Payment">
        <h1 className="text-3xl font-semibold">We couldn’t load your order right now.</h1>
        <p className="text-slate-700">Please refresh this page in a moment. If you already paid, you will not be charged again.</p>
        {help()}
      </Shell>
    );
  }

  if (!order) {
    return (
      <Shell step="Payment">
        <h1 className="text-3xl font-semibold">This scheduling link isn’t valid.</h1>
        <p className="text-slate-700">
          If you’ve already paid, we can email your private scheduling link again.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/resume" className="inline-flex justify-center rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white">
            Resend my scheduling link
          </Link>
          <Link href="/pay?new=1" className="inline-flex justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold">
            Start a new booking
          </Link>
        </div>
      </Shell>
    );
  }

  if (order.appointment_status === "scheduled") {
    return (
      <Shell step="Confirmation">
        <ClearPendingBooking token={t!} />
        <h1 className="text-3xl font-semibold">Your appointment is booked.</h1>
        <p className="text-slate-700">
          Order {order.reference} for {order.service_title} is paid and scheduled. Calendly has emailed your appointment
          confirmation to {order.customer_email}, including links to reschedule if you need to.
        </p>
        {help(order.reference)}
      </Shell>
    );
  }

  if (order.payment_status === "processing") {
    return (
      <Shell step="Payment">
        <h1 className="text-3xl font-semibold">Your payment is processing.</h1>
        <p className="text-slate-700">
          Scheduling opens as soon as your payment is confirmed. Refresh this page in a minute — we’ll also email you a link.
        </p>
        {help(order.reference)}
      </Shell>
    );
  }

  if (order.payment_status === "refunded") {
    return (
      <Shell step="Payment">
        <ClearPendingBooking token={t!} />
        <h1 className="text-3xl font-semibold">This order was refunded.</h1>
        <p className="text-slate-700">Order {order.reference} has been refunded, so scheduling is closed.</p>
        {help(order.reference)}
      </Shell>
    );
  }

  if (!canSchedule(order)) {
    return (
      <Shell step="Payment">
        <h1 className="text-3xl font-semibold">Payment hasn’t been completed.</h1>
        <p className="text-slate-700">
          We haven’t received payment for order {order.reference}, so scheduling isn’t available yet. No appointment has
          been booked.
        </p>
        <Link href="/pay" className="inline-flex justify-center rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white">
          Return to payment
        </Link>
        {help(order.reference)}
      </Shell>
    );
  }

  const bookingUrl = await bookingUrlForOrder(order);

  return (
    <Shell step="Schedule">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">Payment received</p>
        <h1 className="text-3xl font-semibold">Choose your appointment time</h1>
        <p className="text-slate-700">
          Thank you, {order.customer_name}. We received {formatCents(order.amount_cents)} for {order.service_title} (order{" "}
          {order.reference}). <strong>Your appointment isn’t booked until you pick a time below.</strong>
        </p>
        <p className="text-sm text-slate-700">
          Booking is required to complete your order. If you need to come back later, use the “choose your time” link in
          your payment receipt or in the reminder we’ll email you — you won’t be charged again. Once you’ve booked, we’ll
          email your confirmation.
        </p>
      </div>
      {bookingUrl ? (
      <CalendlyScheduler
        url={bookingUrl}
        token={t!}
        reference={order.reference}
        bookingTag={bookingTagFor(order)}
        name={order.customer_name}
        email={order.customer_email}
      />
      ) : (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-semibold">The scheduling calendar isn’t available right now.</p>
          <p className="mt-1">Your payment is safe. Please refresh this page in a few minutes, or contact us below with order {order.reference}.</p>
        </div>
      )}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-blue-950">No time that works, or the calendar won’t load?</p>
        <p className="mt-1">
          Your payment is safe. Contact us with order {order.reference} and we’ll arrange a time with you directly.
        </p>
        <p className="mt-2">
          Booking for someone else as well?{" "}
          <Link href="/pay?new=1" className="font-semibold text-blue-900 underline">
            Start a separate order
          </Link>
          .
        </p>
        <div className="mt-2">{help(order.reference)}</div>
      </div>
    </Shell>
  );
}

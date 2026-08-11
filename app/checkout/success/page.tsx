import Link from "next/link";
import { Navigation } from "../../../components/Navigation";
import { Footer } from "../../../components/Footer";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Payment completed</p>
          <h1 className="text-3xl font-semibold text-slate-950">Thank you for your request.</h1>
          <p className="text-sm leading-7 text-slate-600">
            Your payment went through successfully. We’ll follow up soon to confirm your mobile fingerprinting appointment and coordinate your on-site visit.
          </p>
          <Link href="/" className="inline-flex rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">
            Return to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

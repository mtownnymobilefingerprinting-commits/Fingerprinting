import Link from "next/link";
import { Navigation } from "../../../components/Navigation";
import { Footer } from "../../../components/Footer";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Payment canceled</p>
          <h1 className="text-3xl font-semibold text-slate-950">Your checkout was canceled.</h1>
          <p className="text-sm leading-7 text-slate-600">
            You can return to the quote page to try again, or contact us directly if you need help completing your payment.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/checkout" className="inline-flex rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">
              Try checkout again
            </Link>
            <Link href="/contact" className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300">
              Edit quote request
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

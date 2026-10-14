import Link from "next/link";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main id="main" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Page not found</p>
          <h1 className="text-3xl font-semibold text-slate-950">We couldn’t find that page.</h1>
          <p className="text-slate-600">The link may be out of date. Try one of these instead:</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/services" className="inline-flex justify-center rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900">
              View services
            </Link>
            <Link href="/" className="inline-flex justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">
              Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

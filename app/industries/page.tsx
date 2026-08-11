import Link from "next/link";
import { industryPages } from "../../config/content";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Industries</p>
          <h1 className="text-4xl font-semibold text-slate-950">Industry-specific mobile fingerprinting for businesses.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Learn how mobile fingerprinting supports healthcare, education, law firms, staffing agencies, government contractors, and more.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {industryPages.map((industry) => (
            <Link
              key={industry.id}
              href={`/industries/${industry.id}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 transition hover:border-brand-400 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold">{industry.label}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{industry.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { serviceAreaPages } from "../../config/content";

export default function ServiceAreasPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Service Areas</p>
          <h1 className="text-4xl font-semibold text-slate-950">Professional mobile fingerprinting across the Hudson Valley.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            We serve Middletown, Orange County, Sullivan County, and nearby communities with secure, on-site fingerprinting for businesses and individuals.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {serviceAreaPages.map((area) => (
            <Link
              key={area.id}
              href={`/service-areas/${area.id}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 transition hover:border-brand-400 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold">{area.label}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{area.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

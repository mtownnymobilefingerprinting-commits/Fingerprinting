import Image from "next/image";
import Link from "next/link";
import { BusinessQuoteForm } from "../../components/BusinessQuoteForm";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { siteConfig } from "../../config/site";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <section className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Contact</p>
            <h1 className="text-4xl font-semibold text-slate-950">Request a quote or book an appointment.</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              For appointments at homes, offices, schools, or workplaces across Middletown, Orange County, Sullivan County, and the Hudson Valley, complete the quote request form or call us directly.
            </p>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Reach us</p>
              <p className="mt-4 text-lg text-slate-900">Phone: <Link href={`tel:${siteConfig.phone}`} className="text-brand-600">{siteConfig.phone}</Link></p>
              <p className="mt-2 text-lg text-slate-900">Email: <Link href={`mailto:${siteConfig.email}`} className="text-brand-600">{siteConfig.email}</Link></p>
              <p className="mt-4 text-sm text-slate-600">Business hours: {siteConfig.hours}</p>
              <div className="mt-6 rounded-3xl border border-brand-100 bg-brand-50 p-5 text-slate-900">
                <p className="font-semibold text-brand-700">Price</p>
                <p className="mt-2 text-sm">$125 per person within 20 miles of Middletown, NY.</p>
              </div>
              <div className="mt-8 rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Find us online</p>
                <div className="mt-4 flex flex-col gap-3 text-sm text-slate-700">
                  <a href={siteConfig.googleBusinessUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:text-brand-600">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm">G</span>
                    Google Business
                  </a>
                  <a href={siteConfig.facebookUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:text-brand-600">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm">f</span>
                    Facebook
                  </a>
                  <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:text-brand-600">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm">I</span>
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </section>
          <div className="space-y-8">
            <BusinessQuoteForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { siteConfig } from "../../config/site";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_0.9fr] lg:items-start">
          <section className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-700">About</p>
            <h1 className="text-4xl font-semibold text-slate-950">Professional fingerprinting with on-site service across the Hudson Valley.</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Middletown NY Mobile Fingerprinting supports businesses, HR teams, schools, healthcare providers, law firms, and government contractors with flexible mobile fingerprinting solutions.
            </p>
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Why businesses choose us</h2>
                <ul className="mt-4 space-y-3 text-slate-600">
                  <li>• Mobile fingerprinting at your office or group location</li>
                  <li>• Customized service for employment, licensing, and background checks</li>
                  <li>• Clear communication, reliable scheduling, and professional handling</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Service focus</h2>
                <p className="mt-3 text-slate-600">
                  We focus on business-grade fingerprinting needs with support for FD-258 cards, corporate and group appointments, and industry-specific workflows.
                </p>
              </div>
            </div>
          </section>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Contact</p>
            <p className="mt-4 text-lg font-semibold text-slate-950">{siteConfig.title}</p>
            <p className="mt-4 text-slate-600">Phone: <a href={`tel:${siteConfig.phone}`} className="text-brand-600">{siteConfig.phone}</a></p>
            <p className="mt-2 text-slate-600">Email: <a href={`mailto:${siteConfig.email}`} className="text-brand-600">{siteConfig.email}</a></p>
            <p className="mt-2 text-slate-600">Service areas: Middletown, Orange County, Sullivan County, Hudson Valley</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

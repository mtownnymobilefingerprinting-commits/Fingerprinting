import Link from "next/link";
import { industryPages } from "../../../config/content";
import { Navigation } from "../../../components/Navigation";
import { Footer } from "../../../components/Footer";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return industryPages.map((industry) => ({ slug: industry.id }));
}

export default function IndustryPage({ params }: Props) {
  const industry = industryPages.find((page) => page.id === params.slug);
  if (!industry) {
    return <div>Industry not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Industry</p>
            <h1 className="text-4xl font-semibold text-slate-950">{industry.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">{industry.description}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {industry.highlights.map((highlight) => (
              <div key={highlight} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-slate-700">{highlight}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-semibold text-slate-950">Schedule mobile fingerprinting for {industry.label}</h2>
            <p className="mt-3 text-slate-600">Book an appointment or request a business quote for your industry-focused fingerprinting needs.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/appointments" className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">
                Book an Appointment
              </Link>
              <Link href="/contact" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Request a Business Quote
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

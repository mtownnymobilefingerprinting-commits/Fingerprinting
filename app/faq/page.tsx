import { faqs } from "../../config/content";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">FAQ</p>
          <h1 className="text-4xl font-semibold text-slate-950">Frequently asked questions</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Clear answers for appointment scheduling, mobile service, payment, and local coverage.
          </p>
        </div>
        <section className="mt-10 grid gap-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">{faq.question}</h2>
              <p className="mt-3 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { services } from "../../config/services";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { ServiceCard } from "../../components/ServiceCard";
import { pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({
  title: "Fingerprinting Services",
  description:
    "Mobile ink and FD-258 fingerprinting services for employment, licensing, immigration, adoption, and groups in Middletown, NY and the Hudson Valley.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main id="main" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Services</p>
          <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Comprehensive mobile fingerprinting for businesses and professionals.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Browse our service offerings for individual prints, employment and licensing, corporate appointments, and group fingerprinting support.
          </p>
        </header>
        <section className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

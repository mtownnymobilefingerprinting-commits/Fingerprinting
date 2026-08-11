import { services } from "../../config/services";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { ServiceCard } from "../../components/ServiceCard";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Services</p>
          <h1 className="text-4xl font-semibold text-slate-950">Comprehensive mobile fingerprinting for businesses and professionals.</h1>
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

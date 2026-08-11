import { AppointmentGrid } from "../../components/AppointmentGrid";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Appointments</p>
          <h1 className="text-4xl font-semibold text-slate-950">Schedule a mobile fingerprinting appointment</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Select the fingerprinting category that matches your needs, then book through our embedded Calendly experience.
          </p>
        </div>
        <div className="mt-10">
          <AppointmentGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}

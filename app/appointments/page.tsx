import { AppointmentGrid } from "../../components/AppointmentGrid";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({
  title: "Appointments",
  description:
    "Choose your fingerprinting service, pay securely, then pick your appointment date and time.",
  path: "/appointments",
});

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main id="main" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Appointments</p>
          <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Schedule a mobile fingerprinting appointment</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Choose your service, review your total, and pay securely. Payment is required before choosing your appointment time — right after payment, you’ll pick your date and time.
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

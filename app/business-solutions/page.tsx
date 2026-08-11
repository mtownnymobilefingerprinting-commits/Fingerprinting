import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";

export default function BusinessSolutionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Business Solutions</p>
          <h1 className="text-4xl font-semibold text-slate-950">Enterprise-grade mobile fingerprinting for teams and workplaces.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Our business solutions are designed for HR managers, recruiters, staffing agencies, healthcare organizations, schools, law firms, and government contractors.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">On-site corporate fingerprinting</h2>
            <p className="mt-4 text-slate-600">We bring secure fingerprinting to your office and schedule appointments around your team’s availability.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Group and staffing support</h2>
            <p className="mt-4 text-slate-600">Group appointments and staffing agency fingerprinting are handled with efficient workflows and clear documentation.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Industry compliance</h2>
            <p className="mt-4 text-slate-600">We help businesses comply with licensing, hiring, and security requirements across healthcare, education, law, and government.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { ResumeForm } from "../../components/ResumeForm";
import { privatePageMetadata } from "../../lib/seo";

export const metadata = { ...privatePageMetadata, title: "Resume scheduling" };

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-brand-50 text-blue-950">
      <Navigation />
      <main id="main" className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-6 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-8">
          <h1 className="text-3xl font-semibold">Already paid? Pick your time.</h1>
          <p className="text-slate-700">
            The quickest way back is the “choose your time” link in your payment receipt email. You can also enter the
            email you used at checkout and we’ll send your private scheduling link again. You won’t be charged again.
          </p>
          <ResumeForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

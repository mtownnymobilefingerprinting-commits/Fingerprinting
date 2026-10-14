import { Suspense } from "react";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { PayFlow } from "../../components/PayFlow";
import { pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({
  title: "Pay, then Schedule",
  description:
    "Review your total and pay securely, then choose your mobile fingerprinting appointment time in Middletown and the Hudson Valley.",
  path: "/pay",
});

export default function PayPage() {
  return (
    <div className="min-h-screen bg-brand-50 text-blue-950">
      <Navigation />
      {/* The ?service= selection is read in the browser and re-validated on the server. */}
      <Suspense fallback={<p className="p-10 text-center">Loading checkout…</p>}>
        <PayFlow />
      </Suspense>
      <Footer />
    </div>
  );
}

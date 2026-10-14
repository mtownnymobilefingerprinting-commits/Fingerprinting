import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "../../../config/services";
import { policies } from "../../../config/policies";
import { siteConfig } from "../../../config/site";
import { Navigation } from "../../../components/Navigation";
import { Footer } from "../../../components/Footer";
import { PayThenScheduleLink } from "../../../components/PayThenScheduleLink";
import { pageMetadata } from "../../../lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Only catalog slugs exist; anything else is a real 404. Legacy ids redirect in next.config.mjs.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

function getService(slug: string) {
  return services.find((item) => item.slug === slug);
}

export async function generateMetadata({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />

      <main id="main" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-10">
          <div className="space-y-6">

            {/* Service Header */}
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-700">
                Service
              </p>

              <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                {service.title}
              </h1>

              <p className="max-w-3xl text-lg leading-8 text-slate-600">
                {service.description}
              </p>
            </div>

            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6 text-slate-900">
              <p className="text-lg font-semibold">{service.price}</p>
            </div>

            {/* Customer + What to Bring */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-xl font-semibold text-slate-950">
                  Who needs this service?
                </h2>

                <p className="mt-3 text-slate-600">
                  {service.idealCustomer}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-xl font-semibold text-slate-950">
                  What to bring
                </h2>

                <ul className="mt-3 space-y-2 text-slate-600">
                  <li>• Government-issued photo ID</li>
                  <li>• Required fingerprint form or agency instructions</li>
                  <li>
                    • Payment confirmation or company authorization when needed
                  </li>
                </ul>
              </div>
            </div>

            {/* Appointment + Service Area */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-xl font-semibold text-slate-950">
                  How the appointment works
                </h2>

                <p className="mt-3 text-slate-600">
                  {policies.payFirstNotice} We’ll arrive at your chosen location
                  with fingerprinting equipment and clear instructions.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-xl font-semibold text-slate-950">
                  Service area
                </h2>

                <p className="mt-3 text-slate-600">
                  Middletown, Orange County, Sullivan County, and the Hudson
                  Valley.
                </p>
              </div>
            </div>

            {/* Appointment + Payment Buttons */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <PayThenScheduleLink
                serviceSlug={service.slug}
                className="inline-flex justify-center rounded-full bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
              />
              <Link
                href="/contact"
                className="inline-flex justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Group or business quote
              </Link>
            </div>

            {/* FAQ */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-950">
                Frequently asked about {service.title}
              </h2>

              <p className="mt-3 text-slate-600 [overflow-wrap:anywhere]">
                If you have questions about your appointment, call{" "}
                {siteConfig.phoneDisplay} or email {siteConfig.email}.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
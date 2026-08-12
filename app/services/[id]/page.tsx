import { services } from "../../../config/services";
import { Navigation } from "../../../components/Navigation";
import { Footer } from "../../../components/Footer";
import { ServicePayButton } from "../../../components/ServicePayButton";
import { BookAppointmentButton } from "../../../components/BookAppointmentButton";
import { generatePageMetadata } from "../../../lib/seo";
import { siteConfig } from "../../../config/site";

type Props = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

export function generateMetadata({ params }: Props) {
  const service = services.find((item) => item.id === params.id);

  return generatePageMetadata({
    title: service?.seoTitle ?? siteConfig.title,
    description: service?.seoDescription ?? siteConfig.description,
    url: `${siteConfig.url}/services/${params.id}`,
  });
}

export default function ServiceDetailPage({ params }: Props) {
  const service = services.find((item) => item.id === params.id);

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-slate-900">
        Service not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="space-y-6">

            {/* Service Header */}
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-700">
                Service
              </p>

              <h1 className="text-4xl font-semibold text-slate-950">
                {service.title}
              </h1>

              <p className="max-w-3xl text-lg leading-8 text-slate-600">
                {service.description}
              </p>
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
                  Choose your payment option below. After payment is completed,
                  you can schedule your appointment date and time. We’ll arrive
                  at your chosen location with professional fingerprinting
                  equipment and clear instructions.
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
              <BookAppointmentButton
                serviceId={service.id}
                className="inline-flex justify-center rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
              />

              <ServicePayButton
                service={service}
                className="inline-flex justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
              />
            </div>

            {/* FAQ */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-950">
                Frequently asked about {service.title}
              </h2>

              <p className="mt-3 text-slate-600">
                If you have questions about your appointment, call
                888-219-4681 or email
                mtownnymobilefingerprinting@gmail.com.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
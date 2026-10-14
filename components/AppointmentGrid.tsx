import Link from "next/link";
import { appointmentCategories } from "../config/content";
import { findService } from "../config/services";
import { PayThenScheduleLink } from "./PayThenScheduleLink";

export function AppointmentGrid() {
  return (
    <div className="space-y-10">
      {appointmentCategories.map((category) => (
        <section
          key={category.category}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-2xl font-bold text-slate-950">
            {category.category}
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {category.items.map((item) => {
              const itemWithDesc = item as typeof item & {
                description?: string;
              };
              const slug = findService(item.id)?.slug ?? item.id;

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* Top Header */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100/80">
                        <div
                          className="h-3.5 w-3.5 rounded-full bg-orange-600"
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-950">
                          {item.title}
                        </h3>

                        <p className="text-sm leading-snug text-slate-600">
                          {item.highlight}
                        </p>
                      </div>
                    </div>

                    {/* Body Text */}
                    {itemWithDesc.description && (
                      <p className="text-sm leading-relaxed text-slate-600">
                        {itemWithDesc.description}
                      </p>
                    )}

                    {/* Pricing Box */}
                    <div className="rounded-2xl bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-700">
                      <strong className="font-semibold text-slate-950">
                        Price:
                      </strong>{" "}
                      $125 per person within 20 miles of Middletown, NY
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-3">
                    <PayThenScheduleLink
                      serviceSlug={slug}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900"
                    />

                    {/* Learn More */}
                    <Link
                      href={`/services/${slug}`}
                      className="mt-1 text-sm font-semibold text-orange-800 underline-offset-2 hover:underline"
                    >
                      Learn more<span className="sr-only"> about {item.title}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
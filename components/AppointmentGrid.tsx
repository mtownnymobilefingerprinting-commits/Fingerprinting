"use client";

import { appointmentCategories } from "../config/content";
import { BookAppointmentButton } from "./BookAppointmentButton";
import Link from "next/link";

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

                        <p className="text-xs leading-snug text-slate-500">
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
                    {/* Book Appointment */}
                    <BookAppointmentButton
                      serviceId={item.id}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 active:bg-blue-950"
                    />

                    {/* Pay Now */}
                    <Link
                      href={`/pay?service=${item.id}`}
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                    >
                      Pay Now
                    </Link>

                    {/* Learn More */}
                    <Link
                      href={`/services/${item.id}`}
                      className="mt-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
                    >
                      Learn More
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
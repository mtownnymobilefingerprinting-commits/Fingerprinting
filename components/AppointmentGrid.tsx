"use client";

import { appointmentCategories } from "../config/content";
import { calendlyLinks } from "../config/appointments";

export function AppointmentGrid() {
  return (
    <div className="space-y-8">
      {appointmentCategories.map((category) => (
        <section key={category.category} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">{category.category}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.highlight}</p>
                  </div>
                </div>
                <a
                  href={calendlyLinks[item.id as keyof typeof calendlyLinks]}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
                >
                  Book Appointment
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

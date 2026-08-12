"use client";

import { appointmentCategories } from "../config/content";
import { calendlyLinks } from "../config/appointments";
import { BookAppointmentButton } from "./BookAppointmentButton";

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
                <BookAppointmentButton url={calendlyLinks[item.id as keyof typeof calendlyLinks]} className="mt-6 inline-flex w-full justify-center" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

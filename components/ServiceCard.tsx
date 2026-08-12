"use client";

import { motion } from "framer-motion";
import { ServicePayButton } from "./ServicePayButton";
import { BookAppointmentButton } from "./BookAppointmentButton";
import type { ServiceConfig } from "../config/services";

export function ServiceCard({ service }: { service: ServiceConfig }) {
  return (
    <motion.article
      className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      whileHover={{ y: -4 }}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100">
            <span className="sr-only">Service icon</span>

            <div
              className="h-3.5 w-3.5 rounded-full bg-brand-700"
              aria-hidden="true"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              {service.title}
            </h3>

            <p className="text-sm text-slate-500">
              {service.idealCustomer}
            </p>
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-600">
          {service.description}
        </p>

        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <span className="font-semibold">Price:</span> {service.price}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <BookAppointmentButton serviceId={service.id} />

        <ServicePayButton service={service} />

        <a
          href={`/services/${service.id}`}
          className="text-sm font-medium text-brand-600 hover:text-brand-800"
        >
          Learn More
        </a>
      </div>
    </motion.article>
  );
} 
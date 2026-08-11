"use client";

import Link from "next/link";
import { useState } from "react";
import { services } from "../config/services";

export function ServiceDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-brand-300"
      >
        Services
        <span className="ml-3">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-2 min-w-[20rem] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="grid gap-1 p-3">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                <p className="font-semibold">{service.title}</p>
                <p className="text-xs text-slate-500">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

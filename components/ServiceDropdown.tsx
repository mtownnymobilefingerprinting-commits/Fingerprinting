"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { services } from "../config/services";

export function ServiceDropdown() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-brand-300"
      >
        Services
        <span aria-hidden="true" className="ml-3">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div
          id={panelId}
          className="absolute right-0 z-10 mt-2 max-h-[70vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-xl sm:left-0 sm:right-auto"
        >
          <div className="grid gap-1 p-3">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                <p className="font-semibold">{service.title}</p>
                <p className="text-xs text-slate-600">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

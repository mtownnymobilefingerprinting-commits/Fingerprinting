"use client";

import { useState } from "react";
import { CalendlyModal } from "./CalendlyModal";

type BookAppointmentButtonProps = {
  url: string;
  label?: string;
  className?: string;
};

export function BookAppointmentButton({ url, label = "Book Appointment", className }: BookAppointmentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          "inline-flex items-center justify-center rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
        }
      >
        {label}
      </button>
      <CalendlyModal url={url} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

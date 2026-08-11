"use client";

import { useEffect, useState } from "react";

type CalendlyModalProps = {
  url: string;
  open: boolean;
  onClose: () => void;
};

export function CalendlyModal({ url, open, onClose }: CalendlyModalProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!(window as any).Calendly) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    } else {
      setLoaded(true);
    }
  }, [open]);

  useEffect(() => {
    if (!loaded || !open) {
      return;
    }

    (window as any).Calendly?.initPopupWidget({ url });
  }, [loaded, open, url]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
        >
          Close
        </button>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-950">Book an Appointment</h2>
          <p className="text-sm text-slate-600">
            Your booking will open in a Calendly widget to keep you on the site.
          </p>
          <div className="h-[60vh] rounded-3xl border border-slate-200">
            <iframe
              title="Calendly Scheduling"
              src={url}
              className="h-full w-full rounded-3xl"
              frameBorder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clearPendingBooking, setPendingBooking } from "../lib/pendingBooking";

const WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";

type CalendlyWindow = Window & {
  Calendly?: {
    initInlineWidget: (options: {
      url: string;
      parentElement: HTMLElement;
      prefill?: { name?: string; email?: string };
      utm?: Record<string, string>;
    }) => void;
  };
};

function loadWidget(): Promise<void> {
  const w = window as CalendlyWindow;
  if (w.Calendly) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SRC}"]`);
  return new Promise((resolve, reject) => {
    const script = existing ?? Object.assign(document.createElement("script"), { src: WIDGET_SRC, async: true });
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Calendly failed to load")), { once: true });
    if (!existing) document.body.appendChild(script);
  });
}

type Status = "loading" | "ready" | "saving" | "error" | "save-error";

/** Inline Calendly scheduler, rendered only after the server has verified payment. */
export function CalendlyScheduler({
  url,
  token,
  reference,
  bookingTag,
  name,
  email,
}: {
  url: string;
  token: string;
  reference: string;
  /** Secret per-order tag stored in the booking's utm_content; the server uses it to tie the booking to this paid order. */
  bookingTag: string;
  name: string;
  email: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const recorded = useRef(false);
  const [status, setStatus] = useState<Status>("loading");
  // Calendly reports its content height; size the box to it so there's no empty gap or inner scrollbar.
  const [height, setHeight] = useState(720);

  useEffect(() => {
    const onHeight = (event: MessageEvent) => {
      if (event.origin !== "https://calendly.com" || event.data?.event !== "calendly.page_height") return;
      const px = Number.parseInt(String(event.data.payload?.height ?? ""), 10);
      if (Number.isFinite(px) && px > 300) setHeight(Math.min(px, 2000));
    };
    window.addEventListener("message", onHeight);
    return () => window.removeEventListener("message", onHeight);
  }, []);
  const router = useRouter();
  // Once Calendly reports a booking, stop warning even if saving it here failed.
  const booked = status === "saving" || status === "save-error";
  const warnOnLeave = !booked && status !== "error";

  // Booking is required after payment: remember it on this device and warn before leaving.
  useEffect(() => {
    setPendingBooking(token);
  }, [token]);

  useEffect(() => {
    if (!warnOnLeave) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [warnOnLeave]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const timeout = window.setTimeout(() => setStatus((s) => (s === "loading" ? "error" : s)), 15000);

    loadWidget()
      .then(() => {
        if (!container.current) return;
        (window as CalendlyWindow).Calendly!.initInlineWidget({
          url,
          parentElement: container.current,
          prefill: { name, email },
          // utm_content starts with the order reference (visible to the owner in Calendly) and
          // carries a secret suffix that proves the booking came from this paid order's page.
          utm: { utmSource: "paid-order", utmContent: bookingTag },
        });
        setStatus("ready");
      })
      .catch(() => setStatus("error"))
      .finally(() => window.clearTimeout(timeout));

    return () => window.clearTimeout(timeout);
  }, [url, name, email, bookingTag]);

  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== "https://calendly.com" || event.data?.event !== "calendly.event_scheduled") return;
      if (recorded.current) return;
      recorded.current = true;
      setStatus("saving");
      const payload = event.data.payload ?? {};
      try {
        const res = await fetch("/api/orders/scheduled", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, eventUri: payload.event?.uri, inviteeUri: payload.invitee?.uri }),
        });
        if (!res.ok) throw new Error(String(res.status));
        clearPendingBooking();
        router.refresh();
      } catch {
        // The schedule page also looks the booking up with Calendly on load, so a refresh usually fixes this.
        setStatus("save-error");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [token, router]);

  return (
    <div className="space-y-3">
      <div aria-live="polite" className="text-sm text-slate-700">
        {status === "loading" && <p>Loading available times…</p>}
        {status === "saving" && <p>Saving your appointment…</p>}
        {status === "error" && (
          <p className="font-medium text-red-700">
            The scheduling calendar didn’t load. Please refresh the page, or contact us below with your order reference.
          </p>
        )}
        {status === "save-error" && (
          <p className="font-medium text-red-700">
            Your appointment was booked in Calendly, but we couldn’t confirm it here yet. Please refresh this page in a
            moment. Check your email for the Calendly confirmation, and contact us with order {reference} if you don’t
            receive it.
          </p>
        )}
      </div>
      {/* Calendly's iframe fills its parent, so the parent needs a real height (not min-height). */}
      <div
        ref={container}
        style={{ height }}
        className="w-full overflow-hidden rounded-2xl border border-slate-200 [&_.calendly-inline-widget]:h-full [&_iframe]:h-full"
      />
    </div>
  );
}

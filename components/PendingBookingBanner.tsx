"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { clearPendingBooking, getPendingBooking, scheduleHref } from "../lib/pendingBooking";

// Until a paid customer books, every page reminds them, and the pay page sends them
// back to scheduling instead of letting them start (and pay for) a new order.
export function PendingBookingBanner() {
  const pathname = usePathname();
  const router = useRouter();
  const startingNew = useSearchParams().get("new") === "1";
  const [pending, setPending] = useState<{ token: string; reference: string } | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/schedule")) {
      setPending(null);
      return;
    }
    if (pathname === "/pay" && startingNew) {
      // The customer chose to start a different order.
      clearPendingBooking();
      setPending(null);
      return;
    }
    const token = getPendingBooking();
    if (!token) {
      setPending(null);
      return;
    }

    let cancelled = false;
    fetch("/api/orders/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { state: string; reference: string } | null) => {
        if (cancelled || !data) return;
        if (data.state === "needs_booking") {
          if (pathname === "/pay") {
            router.replace(scheduleHref(token));
            return;
          }
          setPending({ token, reference: data.reference });
        } else if (data.state === "done") {
          clearPendingBooking();
          setPending(null);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname, router, startingNew]);

  if (!pending) return null;

  return (
    <div role="status" className="border-b border-orange-300 bg-orange-50 text-blue-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm">
          <strong>You’ve paid for order {pending.reference}, but your appointment isn’t booked yet.</strong> Please choose
          your date and time to finish.
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link
            href={scheduleHref(pending.token)}
            className="inline-flex justify-center rounded-full bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
          >
            Choose my time
          </Link>
          <button
            type="button"
            onClick={() => {
              clearPendingBooking();
              setPending(null);
            }}
            className="text-sm font-semibold text-blue-900 underline"
          >
            Not my order / already arranged
          </button>
        </div>
      </div>
    </div>
  );
}

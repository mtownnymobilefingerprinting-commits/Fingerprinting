"use client";

import { useEffect } from "react";
import { clearPendingBooking, getPendingBooking } from "../lib/pendingBooking";

/** Rendered once an order is booked (or closed): stops the reminder for this order and announces the result. */
export function ClearPendingBooking({ token }: { token: string }) {
  useEffect(() => {
    if (getPendingBooking() === token) clearPendingBooking();
    const heading = document.querySelector<HTMLElement>("#main h1");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
  }, [token]);
  return null;
}

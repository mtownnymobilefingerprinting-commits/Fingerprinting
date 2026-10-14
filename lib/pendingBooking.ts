// Remembers, on this device only, a paid order that still needs an appointment time.
// This is a convenience for nudging the customer back; the server re-checks every
// token and decides what (if anything) is unlocked.
const KEY = "mf_pending_booking";

export function getPendingBooking(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setPendingBooking(token: string) {
  try {
    window.localStorage.setItem(KEY, token);
  } catch {
    // Storage unavailable (private mode, blocked): the emailed/receipt link still works.
  }
}

export function clearPendingBooking() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function scheduleHref(token: string) {
  return `/schedule?t=${encodeURIComponent(token)}`;
}

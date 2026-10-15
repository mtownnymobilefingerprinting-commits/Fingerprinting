// Pure helpers for booking emails (no server imports, so they can be unit-tested).

const MINUTE = 60 * 1000;
/** Reminder 1 goes 30 minutes after payment; reminder 2 (the last) 24 hours after that. */
export const REMINDER_SCHEDULE_MS = [30 * MINUTE, 24 * 60 * MINUTE];

type ReminderState = { paid_at: string | null; last_reminder_at: string | null; reminder_count: number | null };

export function reminderDue(order: ReminderState, now: number) {
  const count = order.reminder_count ?? 0;
  if (count >= REMINDER_SCHEDULE_MS.length) return false;
  const since = count === 0 ? order.paid_at : order.last_reminder_at;
  return Boolean(since) && now - Date.parse(since!) >= REMINDER_SCHEDULE_MS[count];
}

/** e.g. "Tuesday, October 20 at 10:00 AM EDT" in the business's time zone. */
export function formatAppointmentTime(iso: string) {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
  return `${day} at ${time}`;
}

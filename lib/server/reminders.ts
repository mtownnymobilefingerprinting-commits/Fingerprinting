import "server-only";
import { REMINDER_SCHEDULE_MS as SCHEDULE, reminderDue } from "../bookingEmails";
import { listOrders, updateOrders } from "./db";
import { emailConfigured, sendBookingReminderEmail } from "./email";
import { reconcileBooking, scheduleUrl } from "./orders";

/** Emails paid customers who haven't booked a time yet. Runs from the 5-minute job. */
export async function sendBookingReminders(origin: string) {
  const result = { checked: 0, sent: 0, booked: 0, skipped: emailConfigured() ? null : "SMTP not configured", errors: 0 };
  if (!emailConfigured()) return result;

  const now = Date.now();
  const candidates = await listOrders(
    { payment_status: "eq.paid", appointment_status: "eq.unscheduled", reminder_count: `lt.${SCHEDULE.length}` },
    100
  );
  for (const candidate of candidates) {
    if (!reminderDue(candidate, now)) continue;
    result.checked++;
    try {
      // They may have booked without the page recording it; that sends the confirmation instead.
      const order = await reconcileBooking(candidate);
      if (order.appointment_status === "scheduled") {
        result.booked++;
        continue;
      }
      const count = order.reminder_count ?? 0;
      // Claim this reminder so overlapping runs can't send it twice.
      const [claimed] = await updateOrders(
        { id: `eq.${order.id}`, appointment_status: "eq.unscheduled", reminder_count: `eq.${count}` },
        { reminder_count: count + 1, last_reminder_at: new Date().toISOString() }
      );
      if (!claimed) continue;
      if (await sendBookingReminderEmail(claimed, scheduleUrl(origin, claimed), count + 1 === SCHEDULE.length)) {
        result.sent++;
      } else {
        await updateOrders({ id: `eq.${order.id}`, reminder_count: `eq.${count + 1}` }, { reminder_count: count });
        result.errors++;
      }
    } catch (error) {
      result.errors++;
      console.error(`[reminders] ${candidate.reference} failed`, error);
    }
  }
  return result;
}

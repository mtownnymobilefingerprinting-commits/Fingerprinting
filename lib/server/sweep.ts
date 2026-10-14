import "server-only";
import { siteConfig } from "../../config/site";
import {
  cancelEvent,
  createdAfterPayment,
  getEvent,
  getInvitee,
  listInvitees,
  listUpcomingPaidEventBookings,
  type ScheduledEvent,
} from "./calendly";
import { getOrder, type Order } from "./db";
import { moveBooking, orderFromBookingTag, reconcileOrder, recordBooking } from "./orders";

// Outcomes. Only "unpaid" can lead to a cancellation; anything uncertain is "review"
// (reported, never cancelled) so a paying customer's appointment is never removed by mistake.
type Outcome = "kept" | "recorded" | "moved" | "review" | "unpaid";

export type SweepResult = {
  mode: "report" | "cancel";
  checked: number;
  truncated: boolean;
  kept: string[];
  recorded: string[];
  moved: string[];
  review: { event: string; why: string }[];
  unpaid: string[];
  cancelled: string[];
  errors: { event: string; error: string }[];
};

async function paidOrderLinkedTo(eventUri: string) {
  return getOrder({ calendly_event_uri: `eq.${eventUri}`, payment_status: "eq.paid" });
}

async function classify(event: ScheduledEvent, origin: string): Promise<{ outcome: Outcome; why?: string }> {
  // 1. Already recorded against a paid (not refunded) order.
  if (await paidOrderLinkedTo(event.uri)) return { outcome: "kept" };

  const invitees = (await listInvitees(event.uri)).filter((i) => i.status === "active");
  if (invitees.length !== 1) {
    return { outcome: "review", why: `${invitees.length} active invitees (expected exactly 1)` };
  }
  const invitee = invitees[0];
  const booking = { eventUri: event.uri, inviteeUri: invitee.uri };

  // 2. A reschedule of a booking that belongs to a paid order: move the order to the new event.
  if (invitee.old_invitee) {
    const previous = await getInvitee(invitee.old_invitee);
    const order = await paidOrderLinkedTo(previous.event);
    if (order) {
      return (await moveBooking(order, previous.event, booking))
        ? { outcome: "moved" }
        : { outcome: "review", why: `reschedule of ${order.reference} could not be recorded` };
    }
  }

  // 3. Booked through a paid order's own scheduling page (secret tag in utm_content).
  let order: Order | null = await orderFromBookingTag(invitee.tracking?.utm_content);
  if (!order) return { outcome: "unpaid" };

  order = await reconcileOrder(order, origin); // ask Stripe if the webhook hasn't arrived
  if (order.payment_status === "processing") return { outcome: "review", why: `${order.reference} payment processing` };
  if (order.payment_status !== "paid") return { outcome: "unpaid" };
  if (!createdAfterPayment(event, order)) return { outcome: "unpaid" };

  if (order.appointment_status === "unscheduled" && (await recordBooking(order, booking))) {
    return { outcome: "recorded" };
  }

  // The order already holds a booking (or someone else just recorded this one).
  const fresh = await getOrder({ id: `eq.${order.id}` });
  if (fresh?.calendly_event_uri === event.uri) return { outcome: "kept" };
  if (fresh?.calendly_event_uri) {
    const current = await getEvent(fresh.calendly_event_uri);
    if (current.status === "canceled" && (await moveBooking(fresh, fresh.calendly_event_uri, booking))) {
      return { outcome: "moved" };
    }
  }
  return { outcome: "review", why: `${order.reference} already has a different active booking` };
}

/**
 * Checks upcoming bookings of the paid-appointment event type. Bookings not backed
 * by a paid order are cancelled in "cancel" mode (Calendly tells the invitee to pay
 * first); otherwise they're only reported. Errors never cause a cancellation.
 */
export async function sweepUnpaidBookings(origin: string): Promise<SweepResult> {
  const mode = process.env.CALENDLY_AUTO_CANCEL === "true" ? "cancel" : "report";
  const { events, truncated } = await listUpcomingPaidEventBookings();
  const result: SweepResult = {
    mode,
    checked: 0,
    truncated,
    kept: [],
    recorded: [],
    moved: [],
    review: [],
    unpaid: [],
    cancelled: [],
    errors: [],
  };

  for (const event of events) {
    result.checked++;
    try {
      const { outcome, why } = await classify(event, origin);
      if (outcome === "review") {
        result.review.push({ event: event.uri, why: why ?? "" });
        continue;
      }
      if (outcome !== "unpaid") {
        result[outcome].push(event.uri);
        continue;
      }

      result.unpaid.push(event.uri);
      if (mode !== "cancel" || Date.parse(event.start_time) <= Date.now()) continue;
      // Last-moment re-check so a booking recorded by the customer's page in the meantime is kept.
      if (await paidOrderLinkedTo(event.uri)) continue;
      await cancelEvent(
        event.uri,
        `Appointments must be paid before booking. Please pay and choose your time at ${siteConfig.url}/pay. Questions: ${siteConfig.phoneDisplay}.`
      );
      result.cancelled.push(event.uri);
    } catch (error) {
      result.errors.push({ event: event.uri, error: error instanceof Error ? error.message : String(error) });
    }
  }

  if (result.unpaid.length || result.review.length || result.errors.length || truncated) {
    console.warn("[sweep]", JSON.stringify({ ...result, kept: result.kept.length }));
  }
  return result;
}

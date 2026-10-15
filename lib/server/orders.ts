import "server-only";
import type Stripe from "stripe";
import { bookingTagMatches, createBookingTag, createOrderToken, referenceFromBookingTag, verifyOrderToken } from "../orderToken";
import {
  calendlyApiEnabled,
  createSingleUseBookingUrl,
  findBookingsForOrder,
  getEvent,
  type VerifiedBooking,
} from "./calendly";
import { getOrder, updateOrders, type Order, type PaymentStatus } from "./db";
import { sendBookingConfirmationEmail } from "./email";
import { serverEnv } from "./env";
import { stripe } from "./stripe";

export function tokenForOrder(order: Pick<Order, "id">) {
  return createOrderToken(order.id, serverEnv.orderTokenSecret());
}

export function bookingTagFor(order: Pick<Order, "id" | "reference">) {
  return createBookingTag(order.id, order.reference, serverEnv.orderTokenSecret());
}

/** The order a Calendly booking tag was issued to, or null if the tag isn't authentic. */
export async function orderFromBookingTag(tag: string | null | undefined) {
  const reference = referenceFromBookingTag(tag);
  if (!reference) return null;
  const order = await getOrder({ reference: `eq.${reference}` });
  return order && bookingTagMatches(tag, order.id, order.reference, serverEnv.orderTokenSecret()) ? order : null;
}

export function scheduleUrl(origin: string, order: Pick<Order, "id">) {
  return `${origin}/schedule?t=${encodeURIComponent(tokenForOrder(order))}`;
}

export async function orderFromToken(token: string | null | undefined) {
  const id = verifyOrderToken(token, serverEnv.orderTokenSecret());
  return id ? getOrder({ id: `eq.${id}` }) : null;
}

function statusFromIntent(intent: Stripe.PaymentIntent): PaymentStatus {
  switch (intent.status) {
    case "succeeded":
      return "paid";
    case "processing":
      return "processing";
    case "canceled":
      return "canceled";
    default:
      return "unpaid";
  }
}

/**
 * The single fulfillment path, used by both the webhook and the return-page
 * reconciliation. It trusts only the PaymentIntent as retrieved from Stripe and
 * checks it against the stored order before granting scheduling access.
 */
export async function syncOrderWithPaymentIntent(intent: Stripe.PaymentIntent, origin: string) {
  const orderId = intent.metadata?.order_id;
  if (!orderId) return null;

  const order = await getOrder({ id: `eq.${orderId}` });
  if (!order) {
    console.error(`[orders] PaymentIntent ${intent.id} references unknown order ${orderId}`);
    return null;
  }

  const matches =
    order.stripe_payment_intent_id === intent.id &&
    intent.amount === order.amount_cents &&
    intent.currency === order.currency;
  if (!matches) {
    console.error(`[orders] PaymentIntent ${intent.id} does not match order ${order.reference}; access not granted.`);
    return order;
  }

  const next = statusFromIntent(intent);
  if (next === "paid" && intent.amount_received !== order.amount_cents) {
    console.error(`[orders] ${order.reference}: amount_received mismatch; access not granted.`);
    return order;
  }

  // Never move an order backwards out of paid/refunded from a PaymentIntent event.
  if (order.payment_status === "paid" || order.payment_status === "refunded" || order.payment_status === next) {
    return order;
  }

  const [updated] = await updateOrders(
    { id: `eq.${order.id}`, payment_status: "not.in.(paid,refunded)" },
    next === "paid" ? { payment_status: "paid", paid_at: new Date().toISOString() } : { payment_status: next }
  );
  if (!updated) return getOrder({ id: `eq.${order.id}` });

  // No email here: customers get a confirmation once they've booked, or a reminder if they haven't.
  return updated;
}

/** Ask Stripe directly so a delayed webhook never strands a paying customer. */
export async function reconcileOrder(order: Order, origin: string) {
  if (order.payment_status === "paid" || order.payment_status === "refunded" || !order.stripe_payment_intent_id) {
    return order;
  }
  const intent = await stripe().paymentIntents.retrieve(order.stripe_payment_intent_id);
  return (await syncOrderWithPaymentIntent(intent, origin)) ?? order;
}

export async function markRefunded(paymentIntentId: string) {
  await updateOrders({ stripe_payment_intent_id: `eq.${paymentIntentId}` }, { payment_status: "refunded" });
}

export function canSchedule(order: Order) {
  return order.payment_status === "paid" && order.appointment_status === "unscheduled";
}

/** Marks a paid order as booked. Returns null if it was already booked or the booking is used by another order. */
export async function recordBooking(order: Order, booking: VerifiedBooking) {
  try {
    const [updated] = await updateOrders(
      { id: `eq.${order.id}`, payment_status: "eq.paid", appointment_status: "eq.unscheduled" },
      {
        appointment_status: "scheduled",
        calendly_event_uri: booking.eventUri,
        calendly_invitee_uri: booking.inviteeUri,
        scheduled_at: new Date().toISOString(),
      }
    );
    if (updated) await sendConfirmationOnce(updated);
    return updated ?? null;
  } catch (error) {
    // Unique index on calendly_event_uri: one Calendly booking can't satisfy two orders.
    console.error(`[orders] Could not record booking for ${order.reference}`, error);
    return null;
  }
}

/** If the customer booked but the page never reported it, pick the booking up from Calendly. */
export async function reconcileBooking(order: Order) {
  if (!calendlyApiEnabled() || !canSchedule(order)) return order;
  try {
    for (const booking of await findBookingsForOrder(order, bookingTagFor(order))) {
      // recordBooking fails if another order already holds this booking; try the next one.
      const updated = await recordBooking(order, booking);
      if (updated) return updated;
    }
  } catch (error) {
    console.error(`[orders] Calendly booking lookup failed for ${order.reference}`, error);
  }
  return order;
}

/**
 * The scheduler URL for a paid order: a single-use Calendly link created once and
 * reused on refresh. Returns null (never the reusable public link) if it can't be
 * created, so one payment can't be turned into several bookings. Without an API
 * token configured, the shared event link is used.
 */
export async function bookingUrlForOrder(order: Order): Promise<string | null> {
  try {
    if (!calendlyApiEnabled()) return serverEnv.calendlyUrl();
    if (order.calendly_booking_url) return order.calendly_booking_url;
    const url = await createSingleUseBookingUrl();
    const [saved] = await updateOrders(
      { id: `eq.${order.id}`, calendly_booking_url: "is.null" },
      { calendly_booking_url: url }
    );
    if (saved) return url;
    // Another request saved a link first; use that one so there's only ever one.
    return (await getOrder({ id: `eq.${order.id}` }))?.calendly_booking_url ?? url;
  } catch (error) {
    console.error(`[orders] Could not create single-use Calendly link for ${order.reference}`, error);
    return null;
  }
}

/** Moves a paid order from a booking Calendly replaced (reschedule) to the new one. */
export async function moveBooking(order: Order, fromEventUri: string, booking: VerifiedBooking) {
  const [updated] = await updateOrders(
    { id: `eq.${order.id}`, payment_status: "eq.paid", calendly_event_uri: `eq.${fromEventUri}` },
    { calendly_event_uri: booking.eventUri, calendly_invitee_uri: booking.inviteeUri, scheduled_at: new Date().toISOString() }
  ).catch((error) => {
    console.error(`[orders] Could not move booking for ${order.reference}`, error);
    return [] as Order[];
  });
  return updated ?? null;
}

/**
 * Emails the "booked and paid" confirmation at most once per order (the browser,
 * the Calendly lookup, and the sweep can all record a booking). Never throws.
 */
async function sendConfirmationOnce(order: Order) {
  try {
    const [claimed] = await updateOrders(
      { id: `eq.${order.id}`, appointment_status: "eq.scheduled", confirmation_sent_at: "is.null" },
      { confirmation_sent_at: new Date().toISOString() }
    );
    if (!claimed) return;
    let startTime: string | null = null;
    if (calendlyApiEnabled() && claimed.calendly_event_uri) {
      startTime = (await getEvent(claimed.calendly_event_uri).catch(() => null))?.start_time ?? null;
    }
    if (!(await sendBookingConfirmationEmail(claimed, startTime))) {
      await updateOrders({ id: `eq.${order.id}` }, { confirmation_sent_at: null });
    }
  } catch (error) {
    console.error(`[orders] Confirmation email failed for ${order.reference}`, error);
  }
}

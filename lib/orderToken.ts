import { createHmac, timingSafeEqual } from "node:crypto";

// A scheduling token is "<orderId>.<hmac>". The order id alone grants nothing;
// the HMAC proves the link was issued by this server for that order.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function sign(orderId: string, secret: string) {
  return createHmac("sha256", secret).update(`schedule:${orderId}`).digest("base64url");
}

export function createOrderToken(orderId: string, secret: string) {
  if (!secret) throw new Error("ORDER_TOKEN_SECRET is not configured");
  return `${orderId}.${sign(orderId, secret)}`;
}

/** Returns the order id when the token is authentic, otherwise null. */
export function verifyOrderToken(token: string | null | undefined, secret: string): string | null {
  if (!token || !secret) return null;
  const [orderId, signature, ...rest] = token.split(".");
  if (rest.length || !orderId || !signature || !UUID.test(orderId)) return null;
  const expected = Buffer.from(sign(orderId, secret));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  return orderId;
}

/**
 * The value put in Calendly's utm_content for a paid order's booking: the readable
 * order reference plus a short HMAC, so a booking can't be attributed to an order
 * by someone who only knows its reference or email.
 */
export function createBookingTag(orderId: string, reference: string, secret: string) {
  if (!secret) throw new Error("ORDER_TOKEN_SECRET is not configured");
  const mac = createHmac("sha256", secret).update(`booking:${orderId}`).digest("base64url").slice(0, 16);
  return `${reference}.${mac}`;
}

export function bookingTagMatches(tag: string | null | undefined, orderId: string, reference: string, secret: string) {
  if (!tag || !secret) return false;
  const expected = Buffer.from(createBookingTag(orderId, reference, secret));
  const actual = Buffer.from(tag);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function referenceFromBookingTag(tag: string | null | undefined) {
  const ref = tag?.split(".")[0];
  return ref && /^MF-[0-9A-F]{8}$/.test(ref) ? ref : null;
}

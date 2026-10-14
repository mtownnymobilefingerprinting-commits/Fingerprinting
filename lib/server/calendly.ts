import "server-only";
import type { Order } from "./db";
import { serverEnv } from "./env";

// Calendly API (personal access token). Scopes used: users:read, event_types:read,
// scheduling_links:write, scheduled_events:read, and scheduled_events:write (only
// for auto-cancelling unpaid bookings).
const API = "https://api.calendly.com";

export function calendlyApiEnabled() {
  return Boolean(process.env.CALENDLY_API_TOKEN);
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path.startsWith("https://") ? path : `${API}${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
    headers: {
      Authorization: `Bearer ${process.env.CALENDLY_API_TOKEN}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`Calendly ${init.method ?? "GET"} ${path.split("?")[0]} failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as T;
}

type Resource<T> = { resource: T };
type Collection<T> = { collection: T[] };
type EventType = { uri: string; scheduling_url: string; active: boolean };
type ScheduledEvent = { uri: string; status: "active" | "canceled"; event_type: string; start_time: string; created_at: string };
type Invitee = {
  uri: string;
  email: string;
  event: string;
  status: "active" | "canceled";
  old_invitee?: string | null;
  tracking?: { utm_content?: string | null };
};

function memo<T>(load: () => Promise<T>) {
  let cached: Promise<T> | null = null;
  return () => {
    cached ??= load().catch((error) => {
      cached = null;
      throw error;
    });
    return cached;
  };
}

const currentUserUri = memo(async () => (await call<Resource<{ uri: string }>>("/users/me")).resource.uri);

function normalizeUrl(url: string) {
  const u = new URL(url);
  return `${u.host}${u.pathname}`.toLowerCase().replace(/\/+$/, "");
}

/** The event type behind CALENDLY_SCHEDULING_URL (or CALENDLY_EVENT_TYPE_URI if set). */
export const eventTypeUri = memo(async () => {
  if (process.env.CALENDLY_EVENT_TYPE_URI) return process.env.CALENDLY_EVENT_TYPE_URI;
  const target = normalizeUrl(serverEnv.calendlyUrl());
  const user = await currentUserUri();
  const { collection } = await call<Collection<EventType>>(
    `/event_types?user=${encodeURIComponent(user)}&count=100`
  );
  const match = collection.find((et) => normalizeUrl(et.scheduling_url) === target);
  if (!match) throw new Error(`No Calendly event type matches CALENDLY_SCHEDULING_URL (${serverEnv.calendlyUrl()})`);
  return match.uri;
});

/** A booking link that stops working after one booking. */
export async function createSingleUseBookingUrl() {
  const { resource } = await call<Resource<{ booking_url: string }>>("/scheduling_links", {
    method: "POST",
    body: JSON.stringify({ max_event_count: "1", owner: await eventTypeUri(), owner_type: "EventType" }),
  });
  return resource.booking_url;
}

export type VerifiedBooking = { eventUri: string; inviteeUri: string };

export function createdAfterPayment(event: Pick<ScheduledEvent, "created_at">, order: Order) {
  const paidAt = Date.parse(order.paid_at ?? order.created_at);
  return Date.parse(event.created_at) >= paidAt - 60_000; // allow small clock skew
}

/**
 * Confirms with Calendly that an event exists, is active, is for our event type,
 * was booked after this order was paid, and carries this order's secret booking tag
 * (only ever given to the paid order's own scheduling page).
 */
async function verifyEvent(order: Order, event: ScheduledEvent, bookingTag: string): Promise<VerifiedBooking | null> {
  if (event.status !== "active" || event.event_type !== (await eventTypeUri())) return null;
  if (!createdAfterPayment(event, order)) return null;

  const invitee = (await listInvitees(event.uri)).find(
    (i) => i.status === "active" && i.tracking?.utm_content === bookingTag
  );
  return invitee ? { eventUri: event.uri, inviteeUri: invitee.uri } : null;
}

export async function verifyBooking(order: Order, eventUri: string, bookingTag: string): Promise<VerifiedBooking | null> {
  const uuid = /^https:\/\/api\.calendly\.com\/scheduled_events\/([A-Za-z0-9-]+)$/.exec(eventUri)?.[1];
  if (!uuid) return null;
  return verifyEvent(order, await getEvent(eventUri), bookingTag);
}

export async function getEvent(eventUri: string) {
  const uuid = eventUri.split("/").pop();
  return (await call<Resource<ScheduledEvent>>(`/scheduled_events/${uuid}`)).resource;
}

/** The invitee a rescheduled booking replaced (Invitee.old_invitee is a full API URI). */
export async function getInvitee(inviteeUri: string) {
  return (await call<Resource<Invitee>>(inviteeUri)).resource;
}

/**
 * Bookings that belong to this order even if the browser never reported them
 * (tab closed, network error). Checks the order's email first, then any recent
 * booking of the event type (the invitee may have typed a different email).
 */
export async function findBookingsForOrder(order: Order, bookingTag: string): Promise<VerifiedBooking[]> {
  const since = new Date(order.paid_at ?? order.created_at).toISOString();
  const base = { user: await currentUserUri(), status: "active", min_start_time: since, sort: "start_time:asc" };
  const target = await eventTypeUri();
  const seen = new Set<string>();
  const found: VerifiedBooking[] = [];

  const searches: Record<string, string>[] = [{ invitee_email: order.customer_email, count: "20" }, { count: "50" }];
  for (const extra of searches) {
    const params = new URLSearchParams({ ...base, ...extra });
    const { collection } = await call<Collection<ScheduledEvent>>(`/scheduled_events?${params}`);
    for (const event of collection) {
      if (seen.has(event.uri) || event.event_type !== target || !createdAfterPayment(event, order)) continue;
      seen.add(event.uri);
      const verified = await verifyEvent(order, event, bookingTag);
      if (verified) found.push(verified);
    }
    if (found.length) break;
  }
  return found;
}

type Page<T> = Collection<T> & { pagination?: { next_page?: string | null } };

/** Active bookings of the paid event type that haven't started yet (follows pagination, capped). */
export async function listUpcomingPaidEventBookings(maxPages = 10) {
  const target = await eventTypeUri();
  const params = new URLSearchParams({
    user: await currentUserUri(),
    status: "active",
    min_start_time: new Date().toISOString(),
    sort: "start_time:asc",
    count: "100",
  });
  const events: ScheduledEvent[] = [];
  let next: string | null | undefined = `/scheduled_events?${params}`;
  for (let page = 0; next && page < maxPages; page++) {
    const res: Page<ScheduledEvent> = await call<Page<ScheduledEvent>>(next);
    events.push(...res.collection.filter((e) => e.event_type === target));
    next = res.pagination?.next_page;
  }
  return { events, truncated: Boolean(next) };
}

export async function listInvitees(eventUri: string) {
  const uuid = eventUri.split("/").pop();
  return (await call<Collection<Invitee>>(`/scheduled_events/${uuid}/invitees?count=100`)).collection;
}

/** Cancels a booking; Calendly emails the invitee the reason. Requires scheduled_events:write. */
export async function cancelEvent(eventUri: string, reason: string) {
  const uuid = eventUri.split("/").pop();
  await call(`/scheduled_events/${uuid}/cancellation`, { method: "POST", body: JSON.stringify({ reason }) });
}

export type { ScheduledEvent, Invitee };

import "server-only";
import { serverEnv } from "./env";

// Minimal Supabase (PostgREST) client using the service-role key. The orders
// table has RLS enabled with no policies, so only this server can read/write it.

export type PaymentStatus = "unpaid" | "processing" | "paid" | "canceled" | "refunded";
export type AppointmentStatus = "unscheduled" | "scheduled";

export type Order = {
  id: string;
  reference: string;
  service_id: string;
  service_title: string;
  people: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_address: string;
  distance_miles: number;
  base_cents: number;
  travel_fee_cents: number;
  tax_cents: number;
  amount_cents: number;
  currency: string;
  stripe_payment_intent_id: string | null;
  payment_status: PaymentStatus;
  appointment_status: AppointmentStatus;
  calendly_event_uri: string | null;
  calendly_invitee_uri: string | null;
  calendly_booking_url: string | null;
  paid_at: string | null;
  scheduled_at: string | null;
  resume_email_sent_at: string | null;
  created_at: string;
};

export type NewOrder = Omit<
  Order,
  | "id"
  | "reference"
  | "stripe_payment_intent_id"
  | "payment_status"
  | "appointment_status"
  | "calendly_event_uri"
  | "calendly_invitee_uri"
  | "calendly_booking_url"
  | "paid_at"
  | "scheduled_at"
  | "resume_email_sent_at"
  | "created_at"
>;

async function rest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = serverEnv.supabaseServiceRoleKey();
  const res = await fetch(`${serverEnv.supabaseUrl()}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase ${init.method ?? "GET"} ${path.split("?")[0]} failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as T;
}

type Filters = Record<string, string>;

function query(filters: Filters) {
  return Object.entries(filters)
    .map(([column, expr]) => `${encodeURIComponent(column)}=${encodeURIComponent(expr)}`)
    .join("&");
}

export async function insertOrder(order: NewOrder) {
  const rows = await rest<Order[]>("orders", { method: "POST", body: JSON.stringify(order) });
  return rows[0];
}

export async function getOrder(filters: Filters) {
  const rows = await rest<Order[]>(`orders?${query(filters)}&limit=1`);
  return rows[0] ?? null;
}

export async function listOrders(filters: Filters, limit = 5) {
  return rest<Order[]>(`orders?${query(filters)}&order=created_at.desc&limit=${limit}`);
}

/**
 * Conditional update: only rows matching every filter change. Returns the
 * updated rows, so an empty array means "someone else already did this" —
 * which is what makes fulfillment idempotent.
 */
export async function updateOrders(filters: Filters, patch: Partial<Order>) {
  return rest<Order[]>(`orders?${query(filters)}`, {
    method: "PATCH",
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
}

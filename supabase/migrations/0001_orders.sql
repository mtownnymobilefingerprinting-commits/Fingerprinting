-- Orders and booking entitlements for the pay-first scheduling flow.
-- Run once in the Supabase SQL editor (or with `supabase db push`).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text generated always as ('MF-' || upper(left(replace(id::text, '-', ''), 8))) stored,

  service_id text not null,
  service_title text not null,
  people integer not null check (people between 1 and 50),

  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  service_address text not null,
  distance_miles numeric(7, 1) not null check (distance_miles >= 0),

  base_cents integer not null check (base_cents > 0),
  travel_fee_cents integer not null check (travel_fee_cents >= 0),
  tax_cents integer not null check (tax_cents >= 0),
  amount_cents integer not null check (amount_cents = base_cents + travel_fee_cents + tax_cents),
  currency text not null default 'usd',

  stripe_payment_intent_id text unique,
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'processing', 'paid', 'canceled', 'refunded')),
  appointment_status text not null default 'unscheduled'
    check (appointment_status in ('unscheduled', 'scheduled')),
  -- An appointment can only be recorded against a paid order.
  constraint scheduled_requires_payment check (appointment_status = 'unscheduled' or payment_status in ('paid', 'refunded')),

  calendly_event_uri text,
  calendly_invitee_uri text,

  paid_at timestamptz,
  scheduled_at timestamptz,
  resume_email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists orders_reference_idx on public.orders (reference);
create index if not exists orders_email_idx on public.orders (customer_email);

-- Lock the table down: no anon/authenticated policies. Only the server, using
-- the service-role key, can read or write orders.
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;

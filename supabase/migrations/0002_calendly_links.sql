-- Single-use Calendly links and one-booking-per-order enforcement.
-- Run after 0001_orders.sql. Safe to run more than once.

alter table public.orders add column if not exists calendly_booking_url text;

-- A Calendly booking can satisfy only one paid order.
create unique index if not exists orders_calendly_event_uri_idx
  on public.orders (calendly_event_uri)
  where calendly_event_uri is not null;

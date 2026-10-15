-- Booking confirmation and "you haven't booked yet" reminder tracking.
-- Run after 0001–0003. Safe to run more than once.

alter table public.orders add column if not exists confirmation_sent_at timestamptz;
alter table public.orders add column if not exists reminder_count integer not null default 0;
alter table public.orders add column if not exists last_reminder_at timestamptz;

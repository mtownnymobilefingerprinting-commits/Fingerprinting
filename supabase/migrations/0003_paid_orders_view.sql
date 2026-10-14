-- A read-only list of successful payments for the owner. Updates automatically:
-- every paid checkout appears here; nothing needs to be created per payment.
-- Run after 0001 and 0002. Safe to run more than once.

create or replace view public.paid_orders
with (security_invoker = true) -- uses the orders table's lockdown (RLS), so it isn't public
as
select
  reference,
  paid_at,
  customer_name,
  customer_email,
  customer_phone,
  service_title,
  people,
  service_address,
  round(amount_cents / 100.0, 2) as amount_usd,
  appointment_status,
  scheduled_at,
  stripe_payment_intent_id
from public.orders
where payment_status = 'paid'
order by paid_at desc;

revoke all on public.paid_orders from anon, authenticated;

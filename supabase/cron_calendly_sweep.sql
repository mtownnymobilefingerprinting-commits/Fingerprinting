-- Runs the unpaid-booking check every 5 minutes from Supabase (free on all plans).
-- 1. Database → Extensions: enable "pg_cron" and "pg_net".
-- 2. Paste this into the SQL editor, replace REPLACE_WITH_CRON_SECRET with the same value
--    as CRON_SECRET in Vercel, and run it. Safe to run again (it updates instead of failing).
--    The secret is stored in Supabase Vault. Do not save the real value in this file.

do $$
declare
  existing uuid;
begin
  select id into existing from vault.secrets where name = 'calendly_sweep_cron_secret';
  if existing is null then
    perform vault.create_secret('REPLACE_WITH_CRON_SECRET', 'calendly_sweep_cron_secret');
  else
    perform vault.update_secret(existing, 'REPLACE_WITH_CRON_SECRET');
  end if;
end $$;

-- Re-running with the same job name replaces the existing schedule.
select cron.schedule(
  'calendly-unpaid-booking-sweep',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://www.middletownnymobilefingerprinting.com/api/calendly/sweep',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'calendly_sweep_cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);

-- Check it's scheduled:   select jobname, schedule, active from cron.job;
-- See recent runs:        select status, return_message, start_time from cron.job_run_details order by start_time desc limit 5;
-- Stop it:                select cron.unschedule('calendly-unpaid-booking-sweep');

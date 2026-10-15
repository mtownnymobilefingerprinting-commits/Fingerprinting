import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { calendlyApiEnabled } from "../../../../lib/server/calendly";
import { sendBookingReminders } from "../../../../lib/server/reminders";
import { sweepUnpaidBookings } from "../../../../lib/server/sweep";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// Called every few minutes by a scheduler (Supabase pg_cron, see supabase/cron_calendly_sweep.sql).
// Two independent jobs: the unpaid-booking check and "you haven't booked yet" reminders.
async function handle(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const origin = new URL(request.url).origin;

  const sweep = calendlyApiEnabled()
    ? await sweepUnpaidBookings(origin).catch((error) => {
        console.error("[sweep] failed", error);
        return { error: "Sweep failed" };
      })
    : { error: "CALENDLY_API_TOKEN not configured" };
  const reminders = await sendBookingReminders(origin).catch((error) => {
    console.error("[reminders] failed", error);
    return { error: "Reminders failed" };
  });

  const failed = "error" in sweep || "error" in reminders;
  return NextResponse.json({ ...sweep, reminders }, { status: failed ? 500 : 200, headers: { "Cache-Control": "private, no-store" } });
}

export const GET = handle;
export const POST = handle;

import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { calendlyApiEnabled } from "../../../../lib/server/calendly";
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
async function handle(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!calendlyApiEnabled()) return NextResponse.json({ error: "CALENDLY_API_TOKEN not configured" }, { status: 503 });
  try {
    return NextResponse.json(await sweepUnpaidBookings(new URL(request.url).origin), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("[sweep] failed", error);
    return NextResponse.json({ error: "Sweep failed" }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;

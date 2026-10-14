import { NextResponse } from "next/server";
import { z } from "zod";
import { calendlyApiEnabled, verifyBooking } from "../../../../lib/server/calendly";
import { bookingTagFor, orderFromToken, recordBooking } from "../../../../lib/server/orders";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" };

const calendlyUri = z.string().url().startsWith("https://api.calendly.com/").max(300);
const schema = z.object({ token: z.string().max(200), eventUri: calendlyUri, inviteeUri: calendlyUri });

function reply(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

// Records the Calendly booking against the paid order so the same payment can't
// open the scheduler again. With CALENDLY_API_TOKEN set, the booking is confirmed
// with Calendly first; without it, the embed's report is trusted.
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return reply({ error: "Invalid request" }, 400);

  const order = await orderFromToken(parsed.data.token);
  if (!order) return reply({ error: "Not found" }, 404);

  if (order.appointment_status === "scheduled") {
    const same = order.calendly_event_uri === parsed.data.eventUri;
    return reply({ ok: same }, same ? 200 : 409);
  }
  if (order.payment_status !== "paid") return reply({ error: "Payment not confirmed" }, 402);

  let booking = { eventUri: parsed.data.eventUri, inviteeUri: parsed.data.inviteeUri };
  if (calendlyApiEnabled()) {
    try {
      const verified = await verifyBooking(order, parsed.data.eventUri, bookingTagFor(order));
      if (!verified) return reply({ error: "Booking could not be confirmed with Calendly" }, 422);
      booking = verified;
    } catch (error) {
      console.error(`[scheduled] Calendly verification failed for ${order.reference}`, error);
      return reply({ error: "Calendly is unavailable; try again shortly" }, 503);
    }
  }

  const updated = await recordBooking(order, booking);
  return reply({ ok: Boolean(updated) }, updated ? 200 : 409);
}

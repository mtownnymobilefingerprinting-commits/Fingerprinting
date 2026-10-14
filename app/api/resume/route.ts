import { after, NextResponse } from "next/server";
import { z } from "zod";
import { listOrders, updateOrders } from "../../../lib/server/db";
import { sendScheduleLinkEmail } from "../../../lib/server/email";
import { reconcileOrder, scheduleUrl } from "../../../lib/server/orders";

export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().trim().toLowerCase().email().max(200) });
const RESEND_INTERVAL_MS = 10 * 60 * 1000;

async function resendLinks(email: string, origin: string) {
  const unscheduled = { customer_email: `eq.${email}`, appointment_status: "eq.unscheduled" };
  // Paid orders first so unpaid ones can't push them out of the result.
  const [paid, pending] = await Promise.all([
    listOrders({ ...unscheduled, payment_status: "eq.paid" }),
    listOrders({ ...unscheduled, payment_status: "eq.processing" }),
  ]);
  for (const candidate of pending) await reconcileOrder(candidate, origin); // sends its own email if now paid

  const cutoff = new Date(Date.now() - RESEND_INTERVAL_MS).toISOString();
  for (const order of paid) {
    // Claim the send so repeated requests can't flood the inbox (at most one per 10 minutes).
    const [claimed] = await updateOrders(
      { id: `eq.${order.id}`, or: `(resume_email_sent_at.is.null,resume_email_sent_at.lt."${cutoff}")` },
      { resume_email_sent_at: new Date().toISOString() }
    );
    if (claimed) await sendScheduleLinkEmail(claimed, scheduleUrl(origin, claimed));
  }
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  // Work happens after the response, so timing doesn't reveal whether the email has orders.
  after(() => resendLinks(parsed.data.email, origin).catch((error) => console.error("[resume] failed", error)));

  return NextResponse.json(
    { ok: true, message: "If we find a paid order that still needs a time, we'll email the scheduling link." },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

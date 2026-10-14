import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { serverEnv } from "../../../../lib/server/env";
import { markRefunded, syncOrderWithPaymentIntent } from "../../../../lib/server/orders";
import { stripe } from "../../../../lib/server/stripe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  // Signature verification needs the exact raw body.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(payload, signature ?? "", serverEnv.stripeWebhookSecret());
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
      case "payment_intent.processing":
      case "payment_intent.payment_failed":
      case "payment_intent.canceled":
        // Re-fetch rather than trusting the event body's snapshot.
        await syncOrderWithPaymentIntent(await stripe().paymentIntents.retrieve(event.data.object.id), origin);
        break;
      case "charge.refunded": {
        const charge = event.data.object;
        const intentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        if (intentId && charge.refunded) await markRefunded(intentId);
        break;
      }
    }
  } catch (error) {
    console.error(`[webhook] ${event.type} ${event.id} failed`, error);
    // A 500 makes Stripe retry; fulfillment is idempotent so retries are safe.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

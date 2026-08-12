import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not configured. Set STRIPE_SECRET_KEY in the environment.");
}

const stripeClient = new Stripe(stripeSecretKey, { apiVersion: "2026-07-29.dahlia" });

export async function POST(request: Request) {
  const body = await request.json();
  const amount = Number(body.amount ?? 0);
  const currency = String(body.currency ?? "usd").toLowerCase();
  const serviceTitle = String(body.serviceTitle ?? "Mobile Ink Fingerprinting");
  const serviceId = String(body.serviceId ?? "mobileInk");

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "A valid amount is required." }, { status: 400 });
  }

  try {
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      description: `Payment for ${serviceTitle}`,
      metadata: {
        service_id: serviceId,
        service_title: serviceTitle
      }
    });

    if (!paymentIntent.client_secret) {
      return NextResponse.json({ error: "Unable to create a Stripe payment intent." }, { status: 500 });
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    const stripeError = error as Stripe.StripeRawError;
    const message = stripeError?.message || "Unable to create payment intent.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

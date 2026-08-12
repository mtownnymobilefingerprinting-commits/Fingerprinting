import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_CHECKOUT_PRICE = 12500; // $125.00 in cents

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe secret key is not configured. Set STRIPE_SECRET_KEY in the environment." },
      { status: 500 }
    );
  }

  const stripeClient = new Stripe(stripeSecretKey, { apiVersion: "2026-07-29.dahlia" });
  const body = await request.json();
  const origin = new URL(request.url).origin;

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "$125 Mobile Fingerprinting Quote"
          },
          unit_amount: STRIPE_CHECKOUT_PRICE
        },
        quantity: 1
      }
    ],
    success_url: `${origin}/checkout/success`,
    cancel_url: `${origin}/checkout/cancel`,
    metadata: {}
  };

  if (body.serviceId) {
    if (!body.serviceTitle || typeof body.amount !== "number" || body.amount <= 0) {
      return NextResponse.json(
        { error: "Service payment requires a valid service title and amount." },
        { status: 400 }
      );
    }

    sessionParams.line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Payment for ${body.serviceTitle}`
          },
          unit_amount: body.amount
        },
        quantity: 1
      }
    ];

    sessionParams.metadata = {
      service_id: body.serviceId,
      service_title: body.serviceTitle
    };
  } else {
    const requiredFields = [
      "contactName",
      "email",
      "phone",
      "industry",
      "serviceNeeded",
      "fingerprintType",
      "businessAddress"
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    sessionParams.metadata = {
      contact_name: body.contactName,
      email: body.email,
      phone: body.phone,
      industry: body.industry,
      service_needed: body.serviceNeeded,
      fingerprint_type: body.fingerprintType,
      business_address: body.businessAddress,
      number_of_people: body.employees || "",
      preferred_date: body.preferredDate || "",
      notes: body.notes || ""
    };
  }

  try {
    const session = await stripeClient.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const stripeError = error as Stripe.StripeRawError;
    const message = stripeError?.message || "Unable to create checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

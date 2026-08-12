import { NextResponse } from "next/server";
import Stripe from "stripe";
import { calculateTotalPrice } from "@/lib/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia" as any,
});

export async function POST(req: Request) {
  try {
    const { name, phone, address, destLat, destLng, basePrice = 125 } = await req.json();

    // Calculate dynamic pricing + 4% tax
    const pricing = calculateTotalPrice({ basePrice, destLat, destLng });

    // Create Payment Intent using explicit card payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pricing.totalInCents,
      currency: "usd",
      payment_method_types: ["card"], // Explicitly allow credit/debit card payments
      metadata: {
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        base_price: `$${basePrice}`,
        travel_fee: `$${pricing.travelFee}`,
        tax_4_percent: `$${pricing.tax}`,
        estimated_distance_miles: pricing.distanceInMiles,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      pricing,
    });
  } catch (error: any) {
    console.error("Stripe Payment Intent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
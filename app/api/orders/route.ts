import { NextResponse } from "next/server";
import { z } from "zod";
import { findService } from "../../../config/services";
import { calculatePrice, distanceInMiles, PRICING } from "../../../lib/pricing";
import { insertOrder, updateOrders } from "../../../lib/server/db";
import { geocodeAddress } from "../../../lib/server/geocode";
import { scheduleUrl, tokenForOrder } from "../../../lib/server/orders";
import { stripe } from "../../../lib/server/stripe";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "private, no-store" };

const orderSchema = z.object({
  serviceId: z.string().min(1).max(64),
  people: z.coerce.number().int().min(1).max(PRICING.maxOnlinePeople),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().min(7).max(40),
  address: z.string().trim().min(5).max(300),
});

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE });
}

export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Please check your details and try again.", 400);
  const input = parsed.data;

  // Price and service come from trusted server data only.
  const service = findService(input.serviceId);
  if (!service) return fail("Please choose a valid service.", 400);

  const location = await geocodeAddress(input.address);
  if (!location) {
    return fail("We couldn't locate that address. Please include street, town, and ZIP, or call us for help.", 422);
  }

  const quote = calculatePrice({ people: input.people, distanceMiles: distanceInMiles(location.lat, location.lng) });

  try {
    const order = await insertOrder({
      service_id: service.id,
      service_title: service.title,
      people: quote.people,
      customer_name: input.name,
      customer_email: input.email,
      customer_phone: input.phone,
      service_address: input.address,
      distance_miles: quote.distanceMiles,
      base_cents: quote.baseCents,
      travel_fee_cents: quote.travelFeeCents,
      tax_cents: quote.taxCents,
      amount_cents: quote.totalCents,
      currency: quote.currency,
    });

    const intent = await stripe().paymentIntents.create(
      {
        amount: order.amount_cents,
        currency: order.currency,
        payment_method_types: ["card"],
        receipt_email: order.customer_email,
        // Stripe's receipt email shows this description, so it doubles as the
        // "choose your time" email when SMTP isn't configured.
        description: `${service.title} x${order.people} (order ${order.reference}). Your appointment is not booked yet. Choose your date and time here: ${scheduleUrl(new URL(request.url).origin, order)}`,
        metadata: {
          order_id: order.id,
          order_reference: order.reference,
          service_id: service.id,
          people: String(order.people),
        },
      },
      { idempotencyKey: `order-${order.id}` }
    );

    await updateOrders({ id: `eq.${order.id}` }, { stripe_payment_intent_id: intent.id });

    return NextResponse.json(
      {
        clientSecret: intent.client_secret,
        token: tokenForOrder(order),
        reference: order.reference,
        serviceTitle: service.title,
        quote,
      },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error("[orders] Unable to create order", error);
    return fail("We couldn't start checkout right now. Please try again or call us.", 500);
  }
}

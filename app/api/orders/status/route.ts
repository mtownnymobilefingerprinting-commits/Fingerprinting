import { NextResponse } from "next/server";
import { z } from "zod";
import { orderFromToken } from "../../../../lib/server/orders";

export const dynamic = "force-dynamic";

const schema = z.object({ token: z.string().max(200) });

// Tells a returning browser whether its paid order still needs an appointment time.
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  let order;
  try {
    order = parsed.success ? await orderFromToken(parsed.data.token) : null;
  } catch {
    // Unknown, not "done": the browser keeps its reminder and asks again later.
    return NextResponse.json({ state: "unknown" }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }

  let state: "needs_booking" | "pending_payment" | "done" = "done";
  if (order?.appointment_status === "unscheduled") {
    if (order.payment_status === "paid") state = "needs_booking";
    else if (order.payment_status === "unpaid" || order.payment_status === "processing") state = "pending_payment";
  }

  return NextResponse.json(
    { state, reference: order?.reference ?? null },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

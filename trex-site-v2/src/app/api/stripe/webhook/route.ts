import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

type CheckoutSessionWithLegacyShipping = Stripe.Checkout.Session & {
  shipping_details?: {
    name: string;
    address: Stripe.Address;
  } | null;
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripeServer();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as CheckoutSessionWithLegacyShipping;
    const orderId = session.metadata?.order_id;

    if (orderId) {
      const shippingDetails =
        session.collected_information?.shipping_details ??
        session.shipping_details;
      const paidAmount =
        typeof session.amount_total === "number"
          ? session.amount_total / 100
          : undefined;

      const updates: Record<string, unknown> = {
        status: "paid",
      };

      if (typeof paidAmount === "number") {
        updates.total_amount = paidAmount;
      }

      if (shippingDetails) {
        updates.shipping_name = shippingDetails.name;
        updates.shipping_address = shippingDetails.address;
      }

      // Update order status and fulfillment details in Supabase.
      const supabase = createAdminClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("orders")
        .update(updates)
        .eq("id", orderId);
    }
  }

  return NextResponse.json({ received: true });
}

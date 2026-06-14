import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { getResend } from "@/lib/resend/client";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

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
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    const orderNumber = session.metadata?.order_number;

    if (orderId) {
      const shippingDetails = session.collected_information?.shipping_details;
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

      // Send confirmation email
      try {
        const resend = getResend();
        await resend.emails.send({
          from: "TREX <orders@trexathleticsclub.com>",
          to: session.customer_email!,
          subject: `TREX — Order Confirmed (${orderNumber})`,
          html: `
            <h1>Thanks for your order!</h1>
            <p>Your payment has been confirmed. We'll notify you when your order is ready for collection.</p>
            <p><strong>Order number:</strong> ${orderNumber}</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    }
  }

  return NextResponse.json({ received: true });
}

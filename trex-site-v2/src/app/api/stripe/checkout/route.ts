import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CartItem } from "@/types";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail, customerName, customerPhone } =
      (await request.json()) as {
        items: CartItem[];
        customerEmail: string;
        customerName: string;
        customerPhone: string;
      };

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderNumber = `TREX-${nanoid(8).toUpperCase()}`;

    // Create order in Supabase with "pending" status
    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: dbError } = await (supabase as any)
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        items,
        total_amount: totalAmount,
        status: "pending",
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Failed to create order:", dbError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "sgd",
        product_data: {
          name: item.name,
          ...(item.size && { description: `Size: ${item.size}` }),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: lineItems,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    // Store Stripe session ID on the order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

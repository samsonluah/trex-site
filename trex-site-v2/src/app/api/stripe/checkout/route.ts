import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { nanoid } from "nanoid";
import { z } from "zod";

const CartItemSchema = z.object({
  productId: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1).max(100),
  size: z.string().optional(),
  image: z.string(),
});

const CheckoutSchema = z.object({
  items: z.array(CartItemSchema).min(1).max(50),
  customerEmail: z.string().email(),
  customerName: z.string().min(1).max(200),
  customerPhone: z.string().min(1).max(50),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { items, customerEmail, customerName, customerPhone } = parsed.data;

    // Fetch canonical prices from DB to prevent client-side price manipulation
    const supabase = createAdminClient();
    const productIds = [...new Set(items.map((i) => i.productId))];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: products, error: productsError } = await (supabase as any)
      .from("products")
      .select("id, name, price, in_stock")
      .in("id", productIds);

    if (productsError || !products) {
      console.error("Failed to fetch products:", productsError);
      return NextResponse.json(
        { error: "Failed to validate products" },
        { status: 500 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productMap = new Map<string, any>(products.map((p: any) => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }
      if (!product.in_stock) {
        return NextResponse.json(
          { error: `${product.name} is currently out of stock` },
          { status: 400 }
        );
      }
    }

    // Use DB prices — not client-provided prices
    const verifiedItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      return { ...item, price: product.price, name: product.name };
    });

    const totalAmount = verifiedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderNumber = `TREX-${nanoid(8).toUpperCase()}`;

    // Create order in Supabase with "pending" status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: dbError } = await (supabase as any)
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        items: verifiedItems,
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
    const lineItems = verifiedItems.map((item) => ({
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

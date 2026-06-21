import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const CartItemSchema = z.object({
  productId: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1).max(100),
  size: z.string().optional(),
  image: z.string(),
});

const SummarySchema = z.object({
  items: z.array(CartItemSchema).min(1).max(50),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = SummarySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid cart", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { items } = parsed.data;
  const productIds = [...new Set(items.map((item) => item.productId))];
  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: products, error } = await (supabase as any)
    .from("products")
    .select("id, name, price, in_stock, visible")
    .in("id", productIds);

  if (error || !products) {
    console.error("Failed to fetch checkout summary products:", error);
    return NextResponse.json(
      { error: "Failed to refresh cart" },
      { status: 500 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productMap = new Map<string, any>(products.map((p: any) => [p.id, p]));
  const refreshedItems = [];

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

    if (!product.visible) {
      return NextResponse.json(
        { error: `${product.name} is no longer available` },
        { status: 400 }
      );
    }

    refreshedItems.push({
      ...item,
      name: product.name,
      price: product.price,
    });
  }

  const total = refreshedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return NextResponse.json({ items: refreshedItems, total });
}

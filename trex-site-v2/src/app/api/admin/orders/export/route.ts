import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/supabase/auth-guard";
import type { CartItem, Order } from "@/types";

const CSV_HEADERS = [
  "order_number",
  "order_date",
  "status",
  "customer_name",
  "customer_email",
  "customer_phone",
  "product_name",
  "size",
  "quantity",
  "line_total_sgd",
  "shipping_name",
  "address_line_1",
  "address_line_2",
  "postal_code",
  "city",
  "country",
  "stripe_session_id",
];

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function csvRow(values: unknown[]) {
  return values.map(csvCell).join(",");
}

function orderDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10);
}

function buildOrderRows(order: Order) {
  const address = order.shipping_address;

  return order.items.map((item: CartItem) =>
    csvRow([
      order.order_number,
      orderDate(order.created_at),
      order.status,
      order.customer_name,
      order.customer_email,
      order.customer_phone,
      item.name,
      item.size ?? "",
      item.quantity,
      (item.price * item.quantity).toFixed(2),
      order.shipping_name ?? "",
      address?.line1 ?? "",
      address?.line2 ?? "",
      address?.postal_code ?? "",
      address?.city ?? "",
      address?.country ?? "",
      order.stripe_session_id ?? "",
    ])
  );
}

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("orders")
    .select("*")
    .in("status", ["paid", "fulfilled"])
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const exportableOrders = ((data ?? []) as Order[]).filter(
    (order) => order.status === "paid" || order.status === "fulfilled"
  );

  const rows = [
    csvRow(CSV_HEADERS),
    ...exportableOrders.flatMap(buildOrderRows),
  ];
  const csv = `${rows.join("\n")}\n`;
  const fileDate = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="trex-orders-${fileDate}.csv"`,
    },
  });
}

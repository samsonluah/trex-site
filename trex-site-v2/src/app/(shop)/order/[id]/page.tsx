import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ClearCart } from "@/components/shop/clear-cart";
import { notFound } from "next/navigation";
import type { Order, CartItem } from "@/types";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: order } = await (supabase as any)
    .from("orders")
    .select("*")
    .eq("id", id)
    .single() as { data: Order | null };

  if (!order) return notFound();

  return (
    <div className="site-container py-24 max-w-lg mx-auto">
      <ClearCart />

      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="site-header">Order confirmed.</h1>
        <p className="text-trex-muted text-lg">
          Thanks for your purchase! You&apos;ll receive a confirmation email
          shortly.
        </p>
      </div>

      <div className="site-card p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-trex-muted">Order number</span>
          <span className="font-semibold">{order.order_number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-trex-muted">Status</span>
          <span className="font-semibold capitalize">{order.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-trex-muted">Name</span>
          <span>{order.customer_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-trex-muted">Email</span>
          <span>{order.customer_email}</span>
        </div>

        <div className="site-divider" />

        <div className="space-y-3">
          {order.items.map((item: CartItem, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.name}
                {item.size && ` (${item.size})`} &times; {item.quantity}
              </span>
              <span>SGD {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="site-divider" />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>SGD {order.total_amount.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/" className="site-button inline-block">
          Back to home
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { ClearCart } from "@/components/shop/clear-cart";
import { notFound } from "next/navigation";
import type { Order, CartItem } from "@/types";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: order } = await (supabase as any)
    .from("orders")
    .select("*")
    .eq("id", id)
    .single() as { data: Order | null };

  if (!order) return notFound();

  return (
    <div>
      <ClearCart />

      {/* Dark header */}
      <section className="bg-[#080808] pt-32 pb-16">
        <div className="site-container-wide text-center">
          <div className="w-16 h-16 bg-trex-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-[#080808]"
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
          <h1 className="editorial-heading text-5xl md:text-7xl text-white mb-4">
            Order Confirmed
          </h1>
          <p className="text-white/50 text-sm font-mono max-w-md mx-auto">
            Thanks for your purchase! You&apos;ll receive a confirmation email
            shortly.
          </p>
        </div>
      </section>

      {/* Light content */}
      <section className="bg-[#F5F5F0] py-12">
        <div className="max-w-lg mx-auto px-6">
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-trex-muted font-mono text-xs uppercase tracking-wider">
                Order number
              </span>
              <span className="font-mono font-semibold">
                {order.order_number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-trex-muted font-mono text-xs uppercase tracking-wider">
                Status
              </span>
              <span className="font-mono font-semibold capitalize">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-trex-muted font-mono text-xs uppercase tracking-wider">
                Name
              </span>
              <span className="text-sm">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-trex-muted font-mono text-xs uppercase tracking-wider">
                Email
              </span>
              <span className="text-sm">{order.customer_email}</span>
            </div>

            <div className="border-t border-trex-fg/10 my-4" />

            <div className="space-y-3">
              {order.items.map((item: CartItem, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.name}
                    {item.size && ` (${item.size})`} &times; {item.quantity}
                  </span>
                  <span className="font-mono">
                    SGD {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-trex-fg/10 my-4" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="font-mono">
                SGD {order.total_amount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-block bg-[#080808] text-white font-mono text-xs tracking-[0.15em] uppercase py-3.5 px-8 rounded-lg hover:bg-trex-accent hover:text-[#080808] transition-all duration-200"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

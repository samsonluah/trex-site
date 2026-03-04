"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div>
        <section className="bg-[#080808] pt-32 pb-16">
          <div className="site-container-wide">
            <h1 className="editorial-heading text-7xl md:text-9xl text-white">
              Your Cart
            </h1>
          </div>
        </section>
        <section className="bg-[#F5F5F0] py-24 text-center">
          <p className="text-trex-muted mb-8 text-lg">Nothing here yet.</p>
          <Link
            href="/products"
            className="inline-block bg-[#080808] text-white font-mono text-xs tracking-[0.15em] uppercase py-3.5 px-8 rounded-lg hover:bg-trex-accent hover:text-[#080808] transition-all duration-200"
          >
            Browse shop
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Dark header */}
      <section className="bg-[#080808] pt-32 pb-16">
        <div className="site-container-wide">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-trex-accent">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
          <h1 className="editorial-heading text-7xl md:text-9xl text-white mt-2">
            Your Cart
          </h1>
        </div>
      </section>

      {/* Light content */}
      <section className="bg-[#F5F5F0] py-12">
        <div className="site-container-wide max-w-4xl">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="bg-white rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-trex-fg">{item.name}</h3>
                  {item.size && (
                    <p className="font-mono text-[10px] tracking-wider uppercase text-trex-muted mt-1">
                      Size: {item.size}
                    </p>
                  )}
                  <p className="font-mono font-medium mt-1">
                    SGD {item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        Math.max(1, item.quantity - 1),
                        item.size
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-trex-card flex items-center justify-center hover:bg-trex-accent hover:text-[#080808] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1, item.size)
                    }
                    className="w-8 h-8 rounded-lg bg-trex-card flex items-center justify-center hover:bg-trex-accent hover:text-[#080808] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.productId, item.size)}
                  className="text-trex-muted hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-trex-fg/10 my-10" />

          <div className="flex items-center justify-between">
            <p className="text-xl font-mono font-semibold">
              Total: SGD {totalPrice().toFixed(2)}
            </p>
            <Link
              href="/checkout"
              className="bg-[#080808] text-white font-mono text-xs tracking-[0.15em] uppercase py-3.5 px-8 rounded-lg hover:bg-trex-accent hover:text-[#080808] transition-all duration-200"
            >
              Checkout
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

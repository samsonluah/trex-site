"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="site-container py-24 text-center">
        <h1 className="site-header">Cart empty.</h1>
        <p className="text-trex-muted mb-8">
          Nothing here yet.
        </p>
        <Link href="/products" className="site-button inline-block">
          Browse shop
        </Link>
      </div>
    );
  }

  return (
    <div className="site-container py-24">
      <h1 className="site-header mb-12">Your cart.</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="site-card flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
          >
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              {item.size && (
                <p className="text-sm text-trex-muted mt-1">
                  Size: {item.size}
                </p>
              )}
              <p className="font-medium mt-1">
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
                className="w-8 h-8 rounded-lg bg-trex-bg flex items-center justify-center hover:bg-trex-accent transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1, item.size)
                }
                className="w-8 h-8 rounded-lg bg-trex-bg flex items-center justify-center hover:bg-trex-accent transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.productId, item.size)}
              className="text-trex-muted hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="site-divider" />

      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold">
          Total: SGD {totalPrice().toFixed(2)}
        </p>
        <Link href="/checkout" className="site-button">
          Checkout
        </Link>
      </div>
    </div>
  );
}

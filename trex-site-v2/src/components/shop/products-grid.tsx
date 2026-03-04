"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";

const CATEGORIES = ["all", "apparel", "accessories"] as const;

export function ProductsGrid({ products }: { products: Product[] }) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("all");

  const filtered =
    active === "all"
      ? products
      : products.filter((p) => p.category === active);

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`font-mono text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer ${
              active === cat
                ? "bg-[#080808] text-white"
                : "bg-transparent text-trex-muted border border-trex-fg/10 hover:border-trex-fg/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/products/${product.slug}`}
                className="group block"
              >
                <div className="aspect-square bg-trex-card rounded-xl overflow-hidden relative mb-4">
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  {product.pre_order && (
                    <span className="absolute top-3 left-3 bg-trex-accent text-[#080808] font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Pre-order
                    </span>
                  )}
                </div>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-trex-muted mb-1">
                  {product.category}
                </p>
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-medium group-hover:text-trex-accent transition-colors duration-200">
                    {product.name}
                  </h3>
                  <span className="text-sm font-mono text-trex-fg shrink-0 ml-4">
                    SGD {product.price.toFixed(2)}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

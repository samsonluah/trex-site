"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = products.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="py-24 bg-[#080808]">
      <div className="site-container-wide">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-trex-accent">
              Shop
            </span>
            <h2 className="editorial-heading text-6xl md:text-8xl text-white mt-2">
              Gear Up
            </h2>
          </div>
          <Link
            href="/products"
            className="group font-mono text-xs tracking-widest uppercase text-white/50 hover:text-trex-accent transition-colors duration-200 relative"
          >
            View All
            <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px bg-trex-accent transition-all duration-300" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={`/products/${product.slug}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden bg-white/5 rounded-lg mb-4">
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  )}
                  {product.pre_order && (
                    <span className="absolute top-3 left-3 bg-trex-accent text-[#080808] font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Pre-order
                    </span>
                  )}
                </div>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">
                  {product.category}
                </p>
                <h3 className="text-white text-sm font-medium mb-1 group-hover:text-trex-accent transition-colors duration-200">
                  {product.name}
                </h3>
                <p className="text-white/60 text-sm font-mono">
                  SGD {product.price.toFixed(2)}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

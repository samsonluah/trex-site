"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Ruler, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product } from "@/types";

const DELIVERY_NOTE =
  "Free shipping in Singapore only. Delivery will take approximately 3 weeks after the final day of pre-order (5 July 2026).";
const SIZE_CHART_SRC =
  "https://totvcvcdgsssjsbwtocg.supabase.co/storage/v1/object/public/product-images/sizing_chart.png";

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart() {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size.");
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize || undefined,
      image: product.images[0],
    });

    toast.success(`${product.name} added to cart.`);
    setQuantity(1);
  }

  return (
    <div className="bg-[#F5F5F0] min-h-screen">
      {/* Dark header strip */}
      <div className="bg-[#080808] pt-28 pb-8">
        <div className="site-container-wide">
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="font-mono text-xs tracking-wider uppercase text-white/40 hover:text-trex-accent transition-colors"
                >
                  Products
                </Link>
              </li>
              <li className="text-white/20">/</li>
              <li className="font-mono text-xs tracking-wider uppercase text-white/70">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="site-container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="aspect-square bg-trex-card rounded-xl overflow-hidden relative mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                      i === selectedImage
                        ? "border-trex-accent"
                        : "border-transparent hover:border-trex-fg/20"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-trex-muted mb-2">
              {product.category}
            </p>
            <h1 className="editorial-heading text-4xl md:text-5xl text-trex-fg mb-3">
              {product.name}
            </h1>
            <p className="text-2xl font-mono font-medium mb-6">
              SGD {product.price.toFixed(2)}
            </p>

            {/* Badges */}
            <div className="flex gap-2 mb-6">
              {product.pre_order ? (
                <span className="bg-trex-accent text-[#080808] font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                  Pre-order
                </span>
              ) : product.in_stock ? (
                <span className="bg-green-100 text-green-800 font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                  In stock
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                  Out of stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-trex-muted leading-relaxed mb-8 text-sm">
              {product.long_description || product.description}
            </p>

            <div className="mb-8 rounded-lg border border-trex-fg/10 bg-white p-4">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-trex-muted mb-2">
                Delivery
              </p>
              <p className="text-sm text-trex-fg">{DELIVERY_NOTE}</p>
            </div>

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-trex-muted">
                    Size
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-trex-fg underline-offset-4 transition-colors hover:text-trex-accent hover:underline"
                      >
                        <Ruler className="h-3.5 w-3.5" />
                        Size chart
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-[min(96vw,980px)] overflow-y-auto bg-[#F5F5F0] p-3 sm:p-5">
                      <div className="pr-9">
                        <DialogTitle className="font-mono text-xs tracking-[0.18em] uppercase text-trex-fg">
                          Size chart
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-sm text-trex-muted">
                          Measurements for {product.name}.
                        </DialogDescription>
                      </div>
                      <div className="mt-4 overflow-hidden rounded-lg border border-trex-fg/10 bg-white">
                        <Image
                          src={SIZE_CHART_SRC}
                          alt={`${product.name} size chart`}
                          width={4861}
                          height={6250}
                          className="h-auto w-full"
                          sizes="(max-width: 1024px) 96vw, 980px"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 rounded-lg text-sm font-mono transition-all duration-200 cursor-pointer ${
                        selectedSize === size
                          ? "bg-trex-accent text-[#080808] font-medium"
                          : "bg-trex-card text-trex-fg hover:bg-trex-card-hover"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-trex-muted mb-3">
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-trex-card flex items-center justify-center hover:bg-trex-accent hover:text-[#080808] transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono font-medium text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-trex-card flex items-center justify-center hover:bg-trex-accent hover:text-[#080808] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="w-full bg-[#080808] text-white font-mono text-sm tracking-[0.15em] uppercase py-4 px-8 rounded-lg flex items-center justify-center gap-3 hover:bg-trex-accent hover:text-[#080808] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {product.in_stock ? "Add to cart" : "Out of stock"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

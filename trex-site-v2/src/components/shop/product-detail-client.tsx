"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart";
import type { Product } from "@/types";

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
    <div className="site-container py-24">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-trex-muted">
          <li>
            <Link href="/products" className="hover:text-trex-fg transition-colors">
              Products
            </Link>
          </li>
          <li>/</li>
          <li className="text-trex-fg">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-trex-card rounded-2xl overflow-hidden relative mb-4">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
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
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
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
        </div>

        {/* Info */}
        <div>
          <p className="site-label mb-2">{product.category}</p>
          <h1 className="site-header mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold mb-6">
            SGD {product.price.toFixed(2)}
          </p>

          {/* Badges */}
          <div className="flex gap-2 mb-6">
            {product.pre_order && (
              <span className="bg-trex-accent/20 text-trex-fg text-xs font-medium px-3 py-1 rounded-full">
                Pre-order
              </span>
            )}
            {product.in_stock ? (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                In stock
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                Out of stock
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-trex-muted leading-relaxed mb-8">
            {product.long_description || product.description}
          </p>

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="site-label mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "bg-trex-fg text-trex-bg"
                        : "bg-trex-card hover:bg-trex-card-hover"
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
            <p className="site-label mb-3">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl bg-trex-card flex items-center justify-center hover:bg-trex-card-hover transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-medium text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl bg-trex-card flex items-center justify-center hover:bg-trex-card-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className="site-button w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-5 h-5" />
            {product.in_stock ? "Add to cart" : "Out of stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

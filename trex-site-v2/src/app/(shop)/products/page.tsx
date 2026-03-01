import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/supabase/queries";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="site-container py-24">
      <p className="site-label mb-2">Shop</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="site-card group block"
          >
            <div className="aspect-square bg-trex-bg rounded-xl mb-4 overflow-hidden relative">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-base group-hover:text-trex-fg transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-trex-muted mt-1">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </p>
              </div>
              <span className="font-medium">
                SGD {product.price.toFixed(2)}
              </span>
            </div>
            {product.pre_order && (
              <span className="inline-block mt-3 bg-trex-accent/20 text-trex-fg text-xs font-medium px-3 py-1 rounded-full">
                Pre-order
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

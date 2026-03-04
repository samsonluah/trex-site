import { getProducts } from "@/lib/supabase/queries";
import { ProductsGrid } from "@/components/shop/products-grid";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      {/* Dark hero banner */}
      <section className="bg-[#080808] pt-32 pb-16">
        <div className="site-container-wide">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-trex-accent">
            Merchandise
          </span>
          <h1 className="editorial-heading text-7xl md:text-9xl text-white mt-2">
            Shop
          </h1>
        </div>
      </section>

      {/* Light background product grid */}
      <section className="bg-[#F5F5F0] py-16">
        <div className="site-container-wide">
          <ProductsGrid products={products} />
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/supabase/queries";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/running-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-trex-fg/50" />
        <div className="relative z-10 text-center site-container text-white">
          <h1 className="text-6xl md:text-9xl font-semibold tracking-tight leading-none mb-4">
            TREX.
          </h1>
          <p className="text-lg md:text-xl tracking-wide mb-10 text-white/80">
            Athletics Club
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-trex-fg font-medium py-3 px-8 rounded-xl hover:bg-trex-accent transition-all duration-200 text-center"
            >
              Shop
            </Link>
            <Link
              href="/coaching"
              className="bg-white/10 text-white font-medium py-3 px-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 text-center backdrop-blur-sm"
            >
              Coaching
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="site-container py-24">
        <p className="site-label mb-4">About</p>
        <h2 className="site-subheader">
          Run hard. Run together.
        </h2>
        <p className="text-trex-muted max-w-2xl text-lg leading-relaxed mt-4">
          TREX Athletics Club is a community of runners pushing limits together.
          Whether you&apos;re training for your first 5K or chasing a marathon PR,
          you belong here.
        </p>
      </section>

      {/* Merchandise preview */}
      <section className="site-container py-24">
        <div className="site-divider" />
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="site-label mb-2">Shop</p>
            <h2 className="site-subheader mb-0">Merch.</h2>
          </div>
          <Link
            href="/products"
            className="text-sm text-trex-muted hover:text-trex-fg transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product) => (
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
                  <h3 className="font-medium text-base">
                    {product.name}
                  </h3>
                  <p className="text-sm text-trex-muted mt-1">
                    {product.category}
                  </p>
                </div>
                <span className="font-medium">
                  SGD {product.price.toFixed(2)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Coaching */}
      <section className="site-container py-24">
        <div className="site-divider" />
        <p className="site-label mb-2">Services</p>
        <h2 className="site-subheader">Coaching.</h2>
        <p className="text-trex-muted max-w-2xl text-lg leading-relaxed mt-4 mb-8">
          Looking for personalised coaching? We offer tailored training plans
          for runners of all levels.
        </p>
        <Link href="/coaching" className="site-button inline-block">
          Enquire now
        </Link>
      </section>
    </>
  );
}

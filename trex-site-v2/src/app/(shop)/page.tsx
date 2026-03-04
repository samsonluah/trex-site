import { getGalleryImages, getProducts } from "@/lib/supabase/queries";
import { HeroSection } from "@/components/ui/hero-section";
import { MarqueeStrip } from "@/components/ui/marquee-strip";
import { FeaturedProducts } from "@/components/ui/featured-products";
import { GalleryTeaser } from "@/components/ui/gallery-teaser";

export const dynamic = "force-dynamic";
import { CoachingCTA } from "@/components/ui/coaching-cta";

export default async function HomePage() {
  const [products, galleryImages] = await Promise.all([
    getProducts(),
    getGalleryImages(),
  ]);

  return (
    <div className="bg-[#080808] min-h-screen">
      <HeroSection />
      <MarqueeStrip />
      <FeaturedProducts products={products} />
      <GalleryTeaser images={galleryImages} />
      <CoachingCTA />
    </div>
  );
}

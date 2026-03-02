import { getGalleryImages } from "@/lib/supabase/queries";
import { HeroSection } from "@/components/ui/hero-section";
import { MarqueeStrip } from "@/components/ui/marquee-strip";
import { GalleryTeaser } from "@/components/ui/gallery-teaser";

export default async function HomePage() {
  const galleryImages = await getGalleryImages();

  return (
    <div className="bg-[#080808] min-h-screen">
      <HeroSection />
      <MarqueeStrip />
      <GalleryTeaser images={galleryImages} />
    </div>
  );
}

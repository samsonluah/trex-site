import { getGalleryImages } from "@/lib/supabase/queries";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div>
      {/* Dark hero */}
      <section className="bg-[#080808] pt-32 pb-16">
        <div className="site-container-wide">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-trex-accent">
            Photos &nbsp;/&nbsp; Moments
          </span>
          <h1 className="editorial-heading text-7xl md:text-9xl text-white mt-2">
            Culture
          </h1>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="bg-[#080808] pb-24">
        <div className="site-container-wide">
          {images.length === 0 ? (
            <p className="font-mono text-xs tracking-widest text-white/20 uppercase text-center py-12">
              No photos yet. Check back soon!
            </p>
          ) : (
            <GalleryGrid images={images} />
          )}
        </div>
      </section>
    </div>
  );
}

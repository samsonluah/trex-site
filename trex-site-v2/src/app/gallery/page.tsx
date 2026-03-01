import { getGalleryImages } from "@/lib/supabase/queries";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="site-container py-24">
      <p className="site-label mb-2">Photos</p>
      <h1 className="site-header">Gallery.</h1>
      <p className="text-trex-muted text-lg mb-12">
        Moments from our runs and events.
      </p>

      {images.length === 0 ? (
        <p className="text-trex-muted text-center py-12">
          No photos yet. Check back soon!
        </p>
      ) : (
        <GalleryGrid images={images} />
      )}
    </div>
  );
}

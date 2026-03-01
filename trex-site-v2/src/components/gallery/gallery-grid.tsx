"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { GalleryImage } from "@/types";

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((image, i) => (
          <div
            key={image.id}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => setLightboxIndex(i)}
          >
            <div className="site-card overflow-hidden">
              <Image
                src={image.url}
                alt={image.caption || "Gallery photo"}
                width={600}
                height={600}
                className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
              />
              {image.caption && (
                <p className="p-3 text-sm text-trex-muted">{image.caption}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].caption || "Gallery photo"}
              width={1200}
              height={1200}
              className="w-full h-auto max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {images[lightboxIndex].caption && (
              <p className="text-white/70 text-center mt-4 text-sm">
                {images[lightboxIndex].caption}
              </p>
            )}
          </div>

          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl p-2"
            >
              &lsaquo;
            </button>
          )}
          {lightboxIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl p-2"
            >
              &rsaquo;
            </button>
          )}
        </div>
      )}
    </>
  );
}

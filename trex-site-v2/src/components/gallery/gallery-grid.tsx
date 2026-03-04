"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/types";

const ASPECT_PATTERNS = [
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[16/9]",
  "aspect-square",
  "aspect-[4/3]",
  "aspect-[3/4]",
];

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const next = useCallback(() => {
    setLightboxIndex((c) =>
      c !== null ? (c + 1) % images.length : null
    );
  }, [images.length]);

  const prev = useCallback(() => {
    setLightboxIndex((c) =>
      c !== null ? (c - 1 + images.length) % images.length : null
    );
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") closeLightbox();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, next, prev]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  return (
    <>
      {/* Masonry grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: (i % 8) * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="break-inside-avoid overflow-hidden group cursor-pointer"
            onClick={() => openLightbox(i)}
          >
            <div
              className={`relative w-full overflow-hidden ${ASPECT_PATTERNS[i % ASPECT_PATTERNS.length]}`}
            >
              <Image
                src={img.url}
                alt={img.caption ?? `TREX Gallery ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <p className="font-mono text-[10px] tracking-wider text-white/80">
                    @{img.caption}
                  </p>
                </div>
              )}
              <div className="absolute inset-0 border border-transparent group-hover:border-trex-accent transition-all duration-300 pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 md:left-8 text-white/40 hover:text-white transition-colors z-10 cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative w-[90vw] h-[80vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex].url}
                alt={
                  images[lightboxIndex].caption ??
                  `TREX Gallery ${lightboxIndex + 1}`
                }
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 md:right-8 text-white/40 hover:text-white transition-colors z-10 cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Caption + counter */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              {images[lightboxIndex].caption && (
                <p className="font-mono text-xs tracking-wider text-white/60 mb-2">
                  Photo by @{images[lightboxIndex].caption}
                </p>
              )}
              <p className="font-mono text-[10px] tracking-wider text-white/30 uppercase">
                {lightboxIndex + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

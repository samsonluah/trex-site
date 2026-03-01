"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { GalleryImage } from "@/types";

const AUTO_SCROLL_INTERVAL = 5000;

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-scroll
  useEffect(() => {
    if (!playing || images.length <= 1) return;
    const timer = setInterval(next, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(timer);
  }, [playing, next, images.length]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  if (images.length === 0) return null;

  return (
    <div className="fixed inset-0 top-16 z-10 bg-trex-bg">
      {/* Full-screen image */}
      <div className="relative w-full h-full">
        {images.map((image, i) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={image.url}
              alt={image.caption || "Gallery photo"}
              fill
              className="object-contain"
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Caption */}
        {images[current]?.caption && (
          <div className="absolute bottom-24 left-0 right-0 text-center">
            <p className="inline-block bg-black/50 backdrop-blur-sm text-white/90 text-sm px-4 py-2 rounded-full">
              {images[current].caption}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            className="text-trex-muted hover:text-trex-fg transition-colors p-2"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setPlaying((p) => !p)}
            className="text-trex-muted hover:text-trex-fg transition-colors p-2"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={next}
            className="text-trex-muted hover:text-trex-fg transition-colors p-2"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === current
                  ? "bg-trex-fg w-4"
                  : "bg-trex-muted/40 hover:bg-trex-muted"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

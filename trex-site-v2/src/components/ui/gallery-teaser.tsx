"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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

export function GalleryTeaser({ images }: { images: GalleryImage[] }) {
  const tiles = images.slice(0, 8);

  return (
    <section className="py-24 bg-[#080808]">
      <div className="site-container-wide">
        {/* Section heading */}
        <div className="flex items-end justify-between mb-12">
          <div className="border-l-2 border-trex-accent pl-4">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-trex-accent">
              Culture &nbsp;/&nbsp; 2020&mdash;
            </span>
            <h2 className="editorial-heading text-6xl md:text-8xl text-white mt-2">
              Culture
            </h2>
          </div>
          <Link
            href="/gallery"
            className="group font-mono text-xs tracking-widest uppercase text-white/50 hover:text-trex-accent transition-colors duration-200 relative"
          >
            View All
            <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px bg-trex-accent transition-all duration-300" />
          </Link>
        </div>

        {/* Masonry grid */}
        {tiles.length === 0 ? (
          <p className="font-mono text-xs tracking-widest text-white/20 uppercase">
            No images yet.
          </p>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {tiles.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.07,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                className="break-inside-avoid overflow-hidden group"
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
        )}
      </div>
    </section>
  );
}

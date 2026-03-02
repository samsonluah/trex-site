"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const LETTERS = ["T", "R", "E", "X"];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const letter = {
  hidden: { y: 120, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[#080808]">
      {/* Main TREX wordmark */}
      <div className="flex-1 flex items-center px-6 md:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex leading-none select-none"
          style={{ fontFamily: "var(--font-display)" }}
          aria-label="TREX"
        >
          {LETTERS.map((l) => (
            <motion.span
              key={l}
              variants={letter}
              className="font-black italic text-white uppercase"
              style={{ fontSize: "clamp(5rem, 22vw, 22rem)", lineHeight: 0.9 }}
            >
              {l}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Strapline — offset right */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="absolute top-1/2 right-6 md:right-10 -translate-y-1/2 mt-8 flex flex-col items-end gap-1 pointer-events-none"
      >
        <span
          className="font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase text-white/40"
        >
          Athletics Club
        </span>
        <span className="w-8 h-px bg-[#F2C94C]" />
      </motion.div>

      {/* Bottom bar: location tag + CTAs */}
      <div className="relative z-10 flex items-end justify-between px-6 md:px-10 pb-10">
        {/* SG — EST. 2020 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/30"
        >
          SG &mdash; EST. 2020
        </motion.p>

        {/* Ghost CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex gap-3"
        >
          <Link
            href="/products"
            className="font-mono text-xs tracking-[0.25em] uppercase text-white border border-white/20 px-5 py-2.5 rounded-full hover:border-[#F2C94C] hover:text-[#F2C94C] transition-all duration-200"
          >
            Shop
          </Link>
          <Link
            href="/coaching"
            className="font-mono text-xs tracking-[0.25em] uppercase text-white border border-white/20 px-5 py-2.5 rounded-full hover:border-[#F2C94C] hover:text-[#F2C94C] transition-all duration-200"
          >
            Coaching
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <div
          className="w-px h-10 bg-white/20 origin-top"
          style={{ animation: "scroll-line 2s ease-in-out infinite" }}
        />
      </motion.div>
    </section>
  );
}

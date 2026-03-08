"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import NeuralBackground from "@/components/ui/flow-field-background";

const MORPH_TEXTS = ["TREX", "ATHLETICS", "CLUB"];

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#080808]">
      {/* Layer 1 — z-10: Background gradient + grain */}
      <div className="absolute inset-0 z-10 hero-grain">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808]" />
      </div>

      {/* Layer 1.5 — z-15: Flow field particle background */}
      <div className="absolute inset-0 z-[15]">
        <NeuralBackground
          color="#e8ff00"
          trailOpacity={0.08}
          particleCount={700}
          speed={0.7}
        />
      </div>

      {/* Layer 2 — z-20: Gooey morphing title */}
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <GooeyText
          texts={MORPH_TEXTS}
          morphTime={0.5}
          cooldownTime={1}
          className="w-full"
          textClassName="editorial-heading text-white leading-none text-[clamp(5rem,20vw,22rem)]"
        />
      </motion.div>

      {/* Layer 3 — z-30: Overlay UI elements */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {/* /Athletics tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/3 right-6 md:right-10 flex flex-col items-end gap-1.5"
        >
          <span className="text-trex-accent font-mono text-xs md:text-sm tracking-[0.3em] uppercase">
            /Athletics
          </span>
          <span className="w-8 h-px bg-trex-accent" />
        </motion.div>

        {/* SG — EST. 2020 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="absolute bottom-10 left-6 md:left-10 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/30"
        >
          SG &mdash; EST. 2020
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-10 right-6 md:right-10 flex gap-3 pointer-events-auto"
        >
          <Link
            href="/products"
            className="font-mono text-xs tracking-[0.25em] uppercase text-white border border-white/20 px-5 py-2.5 rounded-full hover:border-trex-accent hover:text-trex-accent transition-all duration-200"
          >
            Shop
          </Link>
          <Link
            href="/coaching"
            className="font-mono text-xs tracking-[0.25em] uppercase text-white border border-white/20 px-5 py-2.5 rounded-full hover:border-trex-accent hover:text-trex-accent transition-all duration-200"
          >
            Coaching
          </Link>
        </motion.div>

        {/* Scroll indicator */}
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
      </div>
    </section>
  );
}

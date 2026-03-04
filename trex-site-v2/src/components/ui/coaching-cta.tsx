"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CoachingCTA() {
  return (
    <section className="relative py-32 bg-[#080808] overflow-hidden">
      {/* Yellow diagonal accent */}
      <div
        aria-hidden
        className="absolute -right-20 top-1/2 -translate-y-1/2 w-40 h-[120%] bg-trex-accent/10 rotate-12 blur-3xl pointer-events-none"
      />

      <div className="site-container-wide relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-trex-accent mb-4 block">
            Coaching
          </span>
          <h2 className="editorial-heading text-5xl md:text-7xl lg:text-8xl text-white mb-6">
            Level Up
            <br />
            Your Running
          </h2>
          <p className="text-white/50 max-w-md mx-auto mb-10 text-sm leading-relaxed">
            Personalised training plans, race preparation, and group sessions
            designed to push your limits.
          </p>
          <Link
            href="/coaching"
            className="group relative inline-flex overflow-hidden rounded-full border border-white/20 px-8 py-3.5 font-semibold text-white cursor-pointer"
          >
            <span className="relative inline-block transition-all duration-300 group-hover:translate-x-10 group-hover:opacity-0">
              Learn More
            </span>
            <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 translate-x-10 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 text-trex-fg">
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
            <span className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-full bg-trex-accent transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.8]" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

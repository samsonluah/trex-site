"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cart";

const NAV_LINKS = [
  { href: "/products", label: "SHOP" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/coaching", label: "COACHING" },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#080808]/95 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="site-container-wide flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-extrabold text-2xl md:text-3xl uppercase tracking-tight text-white"
          >
            TREX
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.15em] text-white/70 hover:text-trex-accent transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/cart" className="relative group">
              <ShoppingBag className="w-5 h-5 text-white/70 group-hover:text-trex-accent transition-colors duration-200" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-trex-accent text-[#080808] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile hamburger + cart */}
          <div className="flex md:hidden items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingBag className="w-5 h-5 text-white/70" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-trex-accent text-[#080808] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="text-white"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#080808] flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="editorial-heading text-5xl text-white/50 hover:text-trex-accent transition-colors block py-3"
                >
                  HOME
                </Link>
              </motion.div>
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="editorial-heading text-5xl text-white/50 hover:text-trex-accent transition-colors block py-3"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

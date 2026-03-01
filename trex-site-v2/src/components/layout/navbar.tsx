"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/coaching", label: "Coaching" },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-trex-bg/90 backdrop-blur-md border-b border-trex-fg/5">
      <div className="site-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-semibold text-xl tracking-tight">
          TREX
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-trex-muted hover:text-trex-fg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="relative">
            <ShoppingBag className="w-5 h-5 text-trex-muted hover:text-trex-fg transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-trex-accent text-trex-fg text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile hamburger + cart */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingBag className="w-5 h-5 text-trex-muted" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-trex-accent text-trex-fg text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-trex-fg/5 bg-trex-bg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-4 text-lg border-b border-trex-fg/5 hover:bg-trex-card transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

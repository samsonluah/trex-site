"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerEmail: email,
          customerName: name,
          customerPhone: phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Checkout failed. Please try again.");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Could not start checkout. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div>
        <section className="bg-[#080808] pt-32 pb-16">
          <div className="site-container-wide">
            <h1 className="editorial-heading text-7xl md:text-9xl text-white">
              Checkout
            </h1>
          </div>
        </section>
        <section className="bg-[#F5F5F0] py-24 text-center">
          <p className="text-trex-muted text-lg">Nothing to checkout.</p>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Dark header */}
      <section className="bg-[#080808] pt-32 pb-16">
        <div className="site-container-wide">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-trex-accent">
            Final step
          </span>
          <h1 className="editorial-heading text-7xl md:text-9xl text-white mt-2">
            Checkout
          </h1>
        </div>
      </section>

      {/* Light content */}
      <section className="bg-[#F5F5F0] py-12">
        <div className="max-w-lg mx-auto px-6">
          <form onSubmit={handleCheckout} className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="font-mono text-[10px] tracking-[0.2em] uppercase text-trex-muted"
              >
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 bg-white border border-trex-fg/10 rounded-lg focus:border-trex-accent focus:ring-trex-accent"
              />
            </div>

            <div>
              <Label
                htmlFor="email"
                className="font-mono text-[10px] tracking-[0.2em] uppercase text-trex-muted"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 bg-white border border-trex-fg/10 rounded-lg focus:border-trex-accent focus:ring-trex-accent"
              />
            </div>

            <div>
              <Label
                htmlFor="phone"
                className="font-mono text-[10px] tracking-[0.2em] uppercase text-trex-muted"
              >
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-2 bg-white border border-trex-fg/10 rounded-lg focus:border-trex-accent focus:ring-trex-accent"
              />
            </div>

            <div className="border-t border-trex-fg/10 my-8" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-trex-muted font-mono text-sm">Total</span>
              <span className="text-xl font-mono font-semibold">
                SGD {totalPrice().toFixed(2)}
              </span>
            </div>

            {error && (
              <p className="text-red-600 text-sm font-mono text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#080808] text-white font-mono text-sm tracking-[0.15em] uppercase py-4 rounded-lg hover:bg-trex-accent hover:text-[#080808] transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Redirecting to payment..." : "Pay now"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

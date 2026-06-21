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
  const [country, setCountry] = useState("SG");

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
        <div className="site-container-wide max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-start">
            <div className="rounded-xl bg-white p-6">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-trex-muted mb-5">
                Order summary
              </p>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex items-start justify-between gap-4 border-b border-trex-fg/10 pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-trex-fg">
                        {item.name}
                      </p>
                      <p className="mt-1 font-mono text-[10px] tracking-wider uppercase text-trex-muted">
                        {item.size ? `Size: ${item.size}` : "One size"} x{" "}
                        {item.quantity}
                      </p>
                      <p className="mt-1 font-mono text-xs text-trex-muted">
                        SGD {item.price.toFixed(2)} each
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-sm font-medium">
                      SGD {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-trex-fg/10 pt-5">
                <span className="font-mono text-sm text-trex-muted">Total</span>
                <span className="text-xl font-mono font-semibold">
                  SGD {totalPrice().toFixed(2)}
                </span>
              </div>
            </div>

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

              <div>
                <Label
                  htmlFor="country"
                  className="font-mono text-[10px] tracking-[0.2em] uppercase text-trex-muted"
                >
                  Country
                </Label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="mt-2 h-10 w-full rounded-lg border border-trex-fg/10 bg-white px-3 text-sm text-trex-fg focus:border-trex-accent focus:outline-none focus:ring-2 focus:ring-trex-accent/30"
                >
                  <option value="SG">Singapore</option>
                </select>
              </div>

              <div className="border-t border-trex-fg/10 my-8" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-trex-muted font-mono text-sm">
                  Total
                </span>
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
                disabled={loading || country !== "SG"}
                className="w-full bg-[#080808] text-white font-mono text-sm tracking-[0.15em] uppercase py-4 rounded-lg hover:bg-trex-accent hover:text-[#080808] transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Redirecting to payment..." : "Pay now"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

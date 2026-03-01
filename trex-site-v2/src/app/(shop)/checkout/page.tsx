"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

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

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="site-container py-24 text-center">
        <h1 className="site-header">Nothing to checkout.</h1>
      </div>
    );
  }

  return (
    <div className="site-container py-24 max-w-lg mx-auto">
      <h1 className="site-header mb-12">Checkout.</h1>

      <form onSubmit={handleCheckout} className="space-y-6">
        <div>
          <Label htmlFor="name" className="site-label">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-2 bg-trex-card border-0 rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="email" className="site-label">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 bg-trex-card border-0 rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="site-label">
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-2 bg-trex-card border-0 rounded-xl"
          />
        </div>

        <div className="site-divider" />

        <div className="flex items-center justify-between mb-4">
          <span className="text-trex-muted">Total</span>
          <span className="text-xl font-semibold">
            SGD {totalPrice().toFixed(2)}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="site-button w-full text-center disabled:opacity-50"
        >
          {loading ? "Redirecting to payment..." : "Pay now"}
        </button>
      </form>
    </div>
  );
}

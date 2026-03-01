"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus } from "lucide-react";

const emptyProduct = {
  name: "",
  slug: "",
  description: "",
  long_description: "",
  price: 0,
  stripe_price_id: "",
  images: [] as string[],
  category: "apparel" as const,
  sizes: [] as string[],
  in_stock: true,
  pre_order: false,
  stock_quantity: 0,
  sort_order: 0,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;

    const isNew = !editing.id;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      toast.success(isNew ? "Product created" : "Product updated");
      setEditing(null);
      fetchProducts();
    } else {
      const { error } = await res.json();
      toast.error(error || "Failed to save");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;

    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      toast.success("Product deleted");
      fetchProducts();
    }
  }

  if (loading) {
    return (
      <div className="text-trex-muted">Loading products...</div>
    );
  }

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            {editing.id ? "Edit Product" : "New Product"}
          </h1>
          <button
            onClick={() => setEditing(null)}
            className="text-sm text-trex-muted hover:text-trex-fg"
          >
            Cancel
          </button>
        </div>

        <div className="site-card p-6 space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="site-label">Name</Label>
              <Input
                value={editing.name || ""}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className="mt-1 bg-trex-bg border-0 rounded-xl"
              />
            </div>
            <div>
              <Label className="site-label">Slug</Label>
              <Input
                value={editing.slug || ""}
                onChange={(e) =>
                  setEditing({ ...editing, slug: e.target.value })
                }
                className="mt-1 bg-trex-bg border-0 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label className="site-label">Description</Label>
            <Input
              value={editing.description || ""}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
              className="mt-1 bg-trex-bg border-0 rounded-xl"
            />
          </div>

          <div>
            <Label className="site-label">Long Description</Label>
            <textarea
              value={editing.long_description || ""}
              onChange={(e) =>
                setEditing({ ...editing, long_description: e.target.value })
              }
              rows={3}
              className="mt-1 w-full bg-trex-bg border-0 rounded-xl p-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="site-label">Price (SGD)</Label>
              <Input
                type="number"
                step="0.01"
                value={editing.price || 0}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    price: parseFloat(e.target.value),
                  })
                }
                className="mt-1 bg-trex-bg border-0 rounded-xl"
              />
            </div>
            <div>
              <Label className="site-label">Stripe Price ID</Label>
              <Input
                value={editing.stripe_price_id || ""}
                onChange={(e) =>
                  setEditing({ ...editing, stripe_price_id: e.target.value })
                }
                className="mt-1 bg-trex-bg border-0 rounded-xl"
              />
            </div>
            <div>
              <Label className="site-label">Category</Label>
              <select
                value={editing.category || "apparel"}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    category: e.target.value as "apparel" | "accessories",
                  })
                }
                className="mt-1 w-full bg-trex-bg border-0 rounded-xl p-2.5 text-sm"
              >
                <option value="apparel">Apparel</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="site-label">
                Sizes (comma-separated)
              </Label>
              <Input
                value={editing.sizes?.join(", ") || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    sizes: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="XS, S, M, L, XL"
                className="mt-1 bg-trex-bg border-0 rounded-xl"
              />
            </div>
            <div>
              <Label className="site-label">
                Images (comma-separated URLs)
              </Label>
              <Input
                value={editing.images?.join(", ") || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    images: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="mt-1 bg-trex-bg border-0 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.in_stock ?? true}
                onChange={(e) =>
                  setEditing({ ...editing, in_stock: e.target.checked })
                }
              />
              In Stock
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.pre_order ?? false}
                onChange={(e) =>
                  setEditing({ ...editing, pre_order: e.target.checked })
                }
              />
              Pre-order
            </label>
          </div>

          <button onClick={handleSave} className="site-button">
            {editing.id ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <button
          onClick={() => setEditing({ ...emptyProduct })}
          className="site-button flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="site-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-trex-bg">
              <th className="text-left p-4 font-medium text-trex-muted">
                Name
              </th>
              <th className="text-left p-4 font-medium text-trex-muted">
                Price
              </th>
              <th className="text-left p-4 font-medium text-trex-muted">
                Category
              </th>
              <th className="text-left p-4 font-medium text-trex-muted">
                Stock
              </th>
              <th className="text-right p-4 font-medium text-trex-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-trex-bg last:border-0"
              >
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">SGD {product.price.toFixed(2)}</td>
                <td className="p-4 capitalize">{product.category}</td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                      product.in_stock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.in_stock ? "In stock" : "Out of stock"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setEditing({ ...product })}
                    className="p-2 hover:bg-trex-bg rounded-lg text-trex-muted hover:text-trex-fg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-trex-muted hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Order, CartItem } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  fulfilled: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (res.ok) {
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    }
  }

  if (loading) {
    return <div className="text-trex-muted">Loading orders...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-trex-muted">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="site-card overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() =>
                  setExpandedId(expandedId === order.id ? null : order.id)
                }
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-medium">
                    {order.order_number}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      statusColors[order.status] || ""
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-trex-muted">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <span className="font-medium">
                    SGD {order.total_amount.toFixed(2)}
                  </span>
                  {expandedId === order.id ? (
                    <ChevronUp className="w-4 h-4 text-trex-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-trex-muted" />
                  )}
                </div>
              </div>

              {expandedId === order.id && (
                <div className="border-t border-trex-bg p-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-trex-muted">Customer</p>
                      <p className="font-medium">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-trex-muted">Email</p>
                      <p>{order.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-trex-muted">Phone</p>
                      <p>{order.customer_phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-trex-muted text-sm mb-2">Items</p>
                    <div className="space-y-1">
                      {order.items.map((item: CartItem, i: number) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.name}
                            {item.size && ` (${item.size})`} &times;{" "}
                            {item.quantity}
                          </span>
                          <span>
                            SGD {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {order.status !== "paid" && (
                      <button
                        onClick={() => updateStatus(order.id, "paid")}
                        className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      >
                        Mark Paid
                      </button>
                    )}
                    {order.status !== "fulfilled" && (
                      <button
                        onClick={() => updateStatus(order.id, "fulfilled")}
                        className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        Mark Fulfilled
                      </button>
                    )}
                    {order.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(order.id, "cancelled")}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCartStore } from "@/stores/cart";
import type { CartItem } from "@/types";

const mockItem: CartItem = {
  productId: "prod-1",
  name: "TREX Singlet",
  price: 45.0,
  quantity: 1,
  size: "M",
  image: "/singlet.jpg",
};

const mockItem2: CartItem = {
  productId: "prod-2",
  name: "TREX Cap",
  price: 30.0,
  quantity: 1,
  image: "/cap.jpg",
};

beforeEach(() => {
  // Reset cart state between tests
  act(() => {
    useCartStore.getState().clearCart();
  });
});

describe("cart store — addItem", () => {
  it("adds a new item to an empty cart", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.addItem(mockItem));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject(mockItem);
  });

  it("increments quantity when the same productId + size is added", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.addItem(mockItem));
    act(() => result.current.addItem({ ...mockItem, quantity: 2 }));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it("treats same productId with different sizes as distinct items", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.addItem(mockItem));
    act(() => result.current.addItem({ ...mockItem, size: "L" }));
    expect(result.current.items).toHaveLength(2);
  });

  it("adds multiple distinct products", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.addItem(mockItem));
    act(() => result.current.addItem(mockItem2));
    expect(result.current.items).toHaveLength(2);
  });
});

describe("cart store — removeItem", () => {
  it("removes an item by productId and size", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.addItem(mockItem));
    act(() => result.current.removeItem(mockItem.productId, mockItem.size));
    expect(result.current.items).toHaveLength(0);
  });

  it("only removes the matching size variant", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.addItem(mockItem));
    act(() => result.current.addItem({ ...mockItem, size: "L" }));
    act(() => result.current.removeItem(mockItem.productId, "M"));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].size).toBe("L");
  });

  it("does nothing when item does not exist", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.addItem(mockItem));
    act(() => result.current.removeItem("non-existent", "M"));
    expect(result.current.items).toHaveLength(1);
  });
});

describe("cart store — updateQuantity", () => {
  it("updates the quantity of a matching item", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.addItem(mockItem));
    act(() => result.current.updateQuantity(mockItem.productId, 5, mockItem.size));
    expect(result.current.items[0].quantity).toBe(5);
  });

  it("does not affect other items when updating", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.addItem(mockItem));
    act(() => result.current.addItem(mockItem2));
    act(() => result.current.updateQuantity(mockItem.productId, 10, mockItem.size));
    expect(result.current.items.find((i) => i.productId === mockItem2.productId)?.quantity).toBe(1);
  });
});

describe("cart store — clearCart", () => {
  it("removes all items", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.addItem(mockItem));
    act(() => result.current.addItem(mockItem2));
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
  });
});

describe("cart store — totalItems", () => {
  it("returns 0 for empty cart", () => {
    const { result } = renderHook(() => useCartStore());
    expect(result.current.totalItems()).toBe(0);
  });

  it("sums quantities across all items", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.addItem(mockItem));
    act(() => result.current.addItem({ ...mockItem2, quantity: 3 }));
    expect(result.current.totalItems()).toBe(4);
  });
});

describe("cart store — totalPrice", () => {
  it("returns 0 for empty cart", () => {
    const { result } = renderHook(() => useCartStore());
    expect(result.current.totalPrice()).toBe(0);
  });

  it("calculates price * quantity for each item", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => result.current.addItem({ ...mockItem, quantity: 2 })); // 45 * 2 = 90
    act(() => result.current.addItem({ ...mockItem2, quantity: 3 })); // 30 * 3 = 90
    expect(result.current.totalPrice()).toBe(180);
  });
});

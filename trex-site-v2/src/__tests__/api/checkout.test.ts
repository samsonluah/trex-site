import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// --- Mocks ---

const mockStripeSessionCreate = vi.fn();
const mockStripeServer = {
  checkout: {
    sessions: {
      create: mockStripeSessionCreate,
    },
  },
};
vi.mock("@/lib/stripe/server", () => ({
  getStripeServer: () => mockStripeServer,
}));

const mockSupabaseFrom = vi.fn();
const mockSupabase = { from: mockSupabaseFrom };
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => mockSupabase,
}));

vi.mock("nanoid", () => ({ nanoid: () => "TESTID12" }));

// Valid v4 UUID (version nibble is '4' in the 3rd group)
const PRODUCT_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

const validPayload = {
  items: [
    {
      productId: PRODUCT_ID,
      name: "TREX Singlet",
      price: 45.0,
      quantity: 2,
      size: "M",
      image: "/singlet.jpg",
    },
  ],
  customerEmail: "runner@example.com",
  customerName: "Sam Runner",
  customerPhone: "+65 9123 4567",
};

const validProducts = [
  {
    id: PRODUCT_ID,
    name: "TREX Singlet",
    price: 45.0,
    in_stock: true,
    visible: true,
    stripe_price_id: "price_test_123",
  },
];

function makeProductsChain(products: object[]) {
  return {
    select: vi.fn().mockReturnValue({
      in: vi.fn().mockResolvedValue({ data: products, error: null }),
    }),
  };
}

function makeOrderInsertChain(orderId: string) {
  const insertMock = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: { id: orderId },
        error: null,
      }),
    }),
  });
  return { insert: insertMock };
}

function makeOrderUpdateChain() {
  return {
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    }),
  };
}

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/stripe/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when items array is empty", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    const res = await POST(makeRequest({ ...validPayload, items: [] }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when customerEmail is invalid", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    const res = await POST(makeRequest({ ...validPayload, customerEmail: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when a required field is missing", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { customerName, ...payload } = validPayload;
    const res = await POST(makeRequest(payload));
    expect(res.status).toBe(400);
  });

  it("returns 400 when quantity is zero", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    const res = await POST(makeRequest({
      ...validPayload,
      items: [{ ...validPayload.items[0], quantity: 0 }],
    }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when quantity exceeds max (100)", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    const res = await POST(makeRequest({
      ...validPayload,
      items: [{ ...validPayload.items[0], quantity: 101 }],
    }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when product is not found in DB", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    // products table returns empty — no matching product
    mockSupabaseFrom.mockReturnValueOnce(makeProductsChain([]));

    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("not found");
  });

  it("returns 400 when product is out of stock", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    mockSupabaseFrom.mockReturnValueOnce(
      makeProductsChain([{ ...validProducts[0], in_stock: false }])
    );

    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("out of stock");
  });

  it("returns 400 when product is hidden", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    mockSupabaseFrom.mockReturnValueOnce(
      makeProductsChain([{ ...validProducts[0], visible: false }])
    );

    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("no longer available");
  });

  it("returns 400 when product has no Stripe Price ID", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    mockSupabaseFrom.mockReturnValueOnce(
      makeProductsChain([{ ...validProducts[0], stripe_price_id: null }])
    );

    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("not configured for checkout");
  });

  it("uses Stripe Price IDs and collects Singapore shipping", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    const dbProduct = { ...validProducts[0], price: 99.0 }; // DB price differs from client
    const insertChain = makeOrderInsertChain("order-abc");

    mockSupabaseFrom
      .mockReturnValueOnce(makeProductsChain([dbProduct]))    // products fetch
      .mockReturnValueOnce(insertChain)                        // order insert
      .mockReturnValueOnce(makeOrderUpdateChain());            // session_id update

    mockStripeSessionCreate.mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/pay/cs_test_123",
    });

    const res = await POST(makeRequest({
      ...validPayload,
      items: [{ ...validPayload.items[0], price: 1.0 }], // tampered client price
    }));

    expect(res.status).toBe(200);
    expect(mockStripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price: "price_test_123",
            quantity: 2,
          }),
        ]),
        shipping_address_collection: {
          allowed_countries: ["SG"],
        },
      })
    );
  });

  it("creates order with TREX-XXXXXXXX order number and 'pending' status", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    const insertChain = makeOrderInsertChain("order-xyz");

    mockSupabaseFrom
      .mockReturnValueOnce(makeProductsChain(validProducts))
      .mockReturnValueOnce(insertChain)
      .mockReturnValueOnce(makeOrderUpdateChain());

    mockStripeSessionCreate.mockResolvedValue({
      id: "cs_test_456",
      url: "https://checkout.stripe.com/pay/cs_test_456",
    });

    await POST(makeRequest(validPayload));

    const insertedRecord = insertChain.insert.mock.calls[0][0];
    expect(insertedRecord.order_number).toMatch(/^TREX-[A-Z0-9]{8}$/);
    expect(insertedRecord.status).toBe("pending");
  });

  it("returns the Stripe checkout session URL on success", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    const expectedUrl = "https://checkout.stripe.com/pay/cs_test_789";

    mockSupabaseFrom
      .mockReturnValueOnce(makeProductsChain(validProducts))
      .mockReturnValueOnce(makeOrderInsertChain("order-def"))
      .mockReturnValueOnce(makeOrderUpdateChain());
    mockStripeSessionCreate.mockResolvedValue({ id: "cs_test_789", url: expectedUrl });

    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe(expectedUrl);
  });

  it("returns 500 when Supabase order insert fails", async () => {
    const { POST } = await import("@/app/api/stripe/checkout/route");
    mockSupabaseFrom
      .mockReturnValueOnce(makeProductsChain(validProducts))
      .mockReturnValueOnce({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: "DB error" } }),
          }),
        }),
      });

    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(500);
  });
});

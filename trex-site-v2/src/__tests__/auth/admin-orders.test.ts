import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// --- Mocks ---

const mockGetUser = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () =>
    Promise.resolve({
      auth: { getUser: mockGetUser },
    }),
}));

const mockSupabaseFrom = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: mockSupabaseFrom }),
}));

function makeRequest(method: string, body?: unknown) {
  const init: RequestInit = { method };
  if (body) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }
  return new NextRequest("http://localhost/api/admin/orders", init);
}

function makeExportChain(orders: object[]) {
  const orderMock = vi.fn().mockResolvedValue({ data: orders, error: null });
  const gteMock = vi.fn().mockReturnValue({ order: orderMock });
  const inMock = vi.fn().mockReturnValue({ gte: gteMock });
  const selectMock = vi.fn().mockReturnValue({ in: inMock });

  return {
    chain: { select: selectMock },
    inMock,
    gteMock,
    orderMock,
  };
}

describe("Admin orders API auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when unauthenticated", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: null } });
    });

    it("GET returns 401", async () => {
      const { GET } = await import("@/app/api/admin/orders/route");
      const res = await GET();
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("Unauthorized");
    });

    it("PUT returns 401", async () => {
      const { PUT } = await import("@/app/api/admin/orders/route");
      const res = await PUT(makeRequest("PUT", { id: "1", status: "paid" }));
      expect(res.status).toBe(401);
    });

    it("export returns 401", async () => {
      const { GET } = await import("@/app/api/admin/orders/export/route");
      const res = await GET();
      expect(res.status).toBe(401);
    });

    it("does not call Supabase admin client when unauthorized", async () => {
      const { GET } = await import("@/app/api/admin/orders/route");
      await GET();
      expect(mockSupabaseFrom).not.toHaveBeenCalled();
    });
  });

  describe("when authenticated", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123", email: "admin@trex.com" } },
      });
    });

    it("GET returns order data", async () => {
      const orders = [
        { id: "1", order_number: "TREX-ABC12345", status: "paid" },
      ];
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: orders, error: null }),
        }),
      });

      const { GET } = await import("@/app/api/admin/orders/route");
      const res = await GET();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual(orders);
    });

    it("PUT updates order status", async () => {
      const updated = { id: "1", status: "fulfilled" };
      mockSupabaseFrom.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi
                .fn()
                .mockResolvedValue({ data: updated, error: null }),
            }),
          }),
        }),
      });

      const { PUT } = await import("@/app/api/admin/orders/route");
      const res = await PUT(
        makeRequest("PUT", { id: "1", status: "fulfilled" })
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe("fulfilled");
    });

    it("PUT returns 400 for invalid status even when authenticated", async () => {
      const { PUT } = await import("@/app/api/admin/orders/route");
      const res = await PUT(
        makeRequest("PUT", { id: "1", status: "invalid_status" })
      );
      expect(res.status).toBe(400);
    });

    it("export returns CSV headers and filters paid/fulfilled orders", async () => {
      const orders = [
        {
          id: "1",
          order_number: "TREX-PAID1",
          created_at: "2026-06-21T04:00:00.000Z",
          status: "paid",
          customer_name: 'Yang, "Jun"',
          customer_email: "yang@example.com",
          customer_phone: "+65 9770 5205",
          items: [
            {
              productId: "product-1",
              name: 'Yunnan Training Tee "Black"',
              size: "S",
              quantity: 1,
              price: 30,
              image: "/tee.jpg",
            },
          ],
          total_amount: 30,
          shipping_name: "Jun Yang",
          shipping_address: {
            line1: "10 Test, Road",
            line2: "#02-03",
            postal_code: "123456",
            city: "Singapore",
            country: "SG",
          },
          stripe_session_id: "cs_test_123",
        },
        {
          id: "2",
          order_number: "TREX-PENDING",
          created_at: "2026-06-21T05:00:00.000Z",
          status: "pending",
          customer_name: "Pending Customer",
          customer_email: "pending@example.com",
          customer_phone: "+65 9000 0000",
          items: [
            {
              productId: "product-2",
              name: "Pending Tee",
              quantity: 1,
              price: 30,
              image: "/tee.jpg",
            },
          ],
          total_amount: 30,
        },
      ];
      const exportChain = makeExportChain(orders);
      mockSupabaseFrom.mockReturnValue(exportChain.chain);

      const { GET } = await import("@/app/api/admin/orders/export/route");
      const res = await GET();
      const csv = await res.text();

      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("text/csv");
      expect(res.headers.get("content-disposition")).toContain("trex-orders-");
      expect(exportChain.inMock).toHaveBeenCalledWith("status", [
        "paid",
        "fulfilled",
      ]);
      expect(exportChain.gteMock).toHaveBeenCalledWith(
        "created_at",
        expect.any(String)
      );
      expect(csv).toContain(
        '"order_number","order_date","status","customer_name","customer_email","customer_phone","product_name","size","quantity","line_total_sgd","shipping_name","address_line_1","address_line_2","postal_code","city","country","stripe_session_id"'
      );
      expect(csv).toContain(
        '"TREX-PAID1","2026-06-21","paid","Yang, ""Jun""","yang@example.com","+65 9770 5205","Yunnan Training Tee ""Black""","S","1","30.00","Jun Yang","10 Test, Road","#02-03","123456","Singapore","SG","cs_test_123"'
      );
      expect(csv).not.toContain("TREX-PENDING");
    });

    it("export creates one CSV row per order item", async () => {
      const exportChain = makeExportChain([
        {
          id: "1",
          order_number: "TREX-MULTI",
          created_at: "2026-06-21T04:00:00.000Z",
          status: "fulfilled",
          customer_name: "Multi Runner",
          customer_email: "multi@example.com",
          customer_phone: "+65 9123 4567",
          items: [
            {
              productId: "product-1",
              name: "Yunnan Training Tee",
              size: "S",
              quantity: 1,
              price: 30,
              image: "/tee.jpg",
            },
            {
              productId: "product-1",
              name: "Yunnan Training Tee",
              size: "M",
              quantity: 2,
              price: 30,
              image: "/tee.jpg",
            },
          ],
          total_amount: 90,
          shipping_name: "Multi Runner",
          shipping_address: {
            line1: "20 Supplier Lane",
            country: "SG",
          },
          stripe_session_id: "cs_test_multi",
        },
      ]);
      mockSupabaseFrom.mockReturnValue(exportChain.chain);

      const { GET } = await import("@/app/api/admin/orders/export/route");
      const res = await GET();
      const csv = await res.text();

      expect(csv.match(/TREX-MULTI/g)).toHaveLength(2);
      expect(csv).toContain('"Yunnan Training Tee","S","1","30.00"');
      expect(csv).toContain('"Yunnan Training Tee","M","2","60.00"');
    });
  });
});

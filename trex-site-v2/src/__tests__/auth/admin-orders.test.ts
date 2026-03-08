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
  });
});

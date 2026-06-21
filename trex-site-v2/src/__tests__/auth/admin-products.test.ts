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
  return new NextRequest("http://localhost/api/admin/products", init);
}

describe("Admin products API auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when unauthenticated", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: null } });
    });

    it("GET returns 401", async () => {
      const { GET } = await import("@/app/api/admin/products/route");
      const res = await GET();
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("Unauthorized");
    });

    it("POST returns 401", async () => {
      const { POST } = await import("@/app/api/admin/products/route");
      const res = await POST(makeRequest("POST", { name: "Test" }));
      expect(res.status).toBe(401);
    });

    it("PUT returns 401", async () => {
      const { PUT } = await import("@/app/api/admin/products/route");
      const res = await PUT(makeRequest("PUT", { id: "1", name: "Updated" }));
      expect(res.status).toBe(401);
    });

    it("DELETE returns 401", async () => {
      const { DELETE } = await import("@/app/api/admin/products/route");
      const res = await DELETE(makeRequest("DELETE", { id: "1" }));
      expect(res.status).toBe(401);
    });

    it("does not call Supabase admin client when unauthorized", async () => {
      const { GET } = await import("@/app/api/admin/products/route");
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

    it("GET returns product data", async () => {
      const products = [{ id: "1", name: "Singlet", price: 45 }];
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: products, error: null }),
        }),
      });

      const { GET } = await import("@/app/api/admin/products/route");
      const res = await GET();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual(products);
    });

    it("POST creates a product and returns 201", async () => {
      const created = { id: "2", name: "New Product" };
      const insert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: created, error: null }),
        }),
      });
      mockSupabaseFrom.mockReturnValue({
        insert,
      });

      const { POST } = await import("@/app/api/admin/products/route");
      const res = await POST(makeRequest("POST", { name: "New Product" }));
      expect(res.status).toBe(201);
      expect(insert).toHaveBeenCalledWith({
        name: "New Product",
        slug: "new-product",
      });
      const body = await res.json();
      expect(body.name).toBe("New Product");
    });

    it("POST normalizes manually entered product slugs", async () => {
      const insert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi
            .fn()
            .mockResolvedValue({ data: { id: "2" }, error: null }),
        }),
      });
      mockSupabaseFrom.mockReturnValue({ insert });

      const { POST } = await import("@/app/api/admin/products/route");
      const res = await POST(
        makeRequest("POST", { name: "Training Tee", slug: "Training Tee!!" })
      );
      expect(res.status).toBe(201);
      expect(insert).toHaveBeenCalledWith({
        name: "Training Tee",
        slug: "training-tee",
      });
    });

    it("PUT visibility toggles do not require a product slug", async () => {
      const updated = { id: "1", visible: false };
      const update = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: updated, error: null }),
          }),
        }),
      });
      mockSupabaseFrom.mockReturnValue({ update });

      const { PUT } = await import("@/app/api/admin/products/route");
      const res = await PUT(makeRequest("PUT", { id: "1", visible: false }));
      expect(res.status).toBe(200);
      expect(update).toHaveBeenCalledWith({ visible: false });
      const body = await res.json();
      expect(body.visible).toBe(false);
    });

    it("DELETE returns success when authenticated", async () => {
      mockSupabaseFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      });

      const { DELETE } = await import("@/app/api/admin/products/route");
      const res = await DELETE(makeRequest("DELETE", { id: "1" }));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
    });
  });
});

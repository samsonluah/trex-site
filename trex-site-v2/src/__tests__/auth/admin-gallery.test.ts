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
const mockStorageFrom = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: mockSupabaseFrom,
    storage: { from: mockStorageFrom },
  }),
}));

function makeRequest(method: string, body?: unknown) {
  const init: RequestInit = { method };
  if (body) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }
  return new NextRequest("http://localhost/api/admin/gallery", init);
}

describe("Admin gallery API auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when unauthenticated", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: null } });
    });

    it("GET returns 401", async () => {
      const { GET } = await import("@/app/api/admin/gallery/route");
      const res = await GET();
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("Unauthorized");
    });

    it("POST returns 401", async () => {
      const { POST } = await import("@/app/api/admin/gallery/route");
      // POST expects formData, but auth check runs first
      const req = new NextRequest("http://localhost/api/admin/gallery", {
        method: "POST",
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("PATCH returns 401", async () => {
      const { PATCH } = await import("@/app/api/admin/gallery/route");
      const res = await PATCH(
        makeRequest("PATCH", { storage_path: "gallery/test.jpg", caption: "Test" })
      );
      expect(res.status).toBe(401);
    });

    it("DELETE returns 401", async () => {
      const { DELETE } = await import("@/app/api/admin/gallery/route");
      const res = await DELETE(
        makeRequest("DELETE", { id: "123", storage_path: "gallery/test.jpg" })
      );
      expect(res.status).toBe(401);
    });

    it("does not call Supabase admin client when unauthorized", async () => {
      const { GET } = await import("@/app/api/admin/gallery/route");
      await GET();
      expect(mockSupabaseFrom).not.toHaveBeenCalled();
      expect(mockStorageFrom).not.toHaveBeenCalled();
    });
  });

  describe("when authenticated", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123", email: "admin@trex.com" } },
      });
    });

    it("GET returns gallery data", async () => {
      const storageFiles = [{ name: "photo1.jpg", created_at: "2024-01-01" }];
      const dbRows = [
        {
          id: "abc-123",
          url: "https://test.supabase.co/gallery/photo1.jpg",
          storage_path: "gallery/photo1.jpg",
          caption: "Test",
          sort_order: 0,
        },
      ];

      mockStorageFrom.mockReturnValue({
        list: vi.fn().mockResolvedValue({ data: storageFiles, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: "https://test.supabase.co/gallery/photo1.jpg" },
        }),
      });
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: dbRows, error: null }),
        }),
      });

      const { GET } = await import("@/app/api/admin/gallery/route");
      const res = await GET();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveLength(1);
      expect(body[0].synced).toBe(true);
    });

    it("POST returns 400 for missing file when authenticated (proves auth passed)", async () => {
      const { POST } = await import("@/app/api/admin/gallery/route");
      // Send empty formData — auth passes, then validation rejects missing file
      const formData = new FormData();
      const req = new NextRequest("http://localhost/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      const res = await POST(req);
      // 400 (not 401) proves the auth guard allowed the request through
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBe("No file provided");
    });
  });
});

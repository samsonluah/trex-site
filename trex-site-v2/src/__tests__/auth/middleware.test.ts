import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// --- Mocks ---

const mockGetUser = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
  }),
}));

// Mock NextResponse to avoid internal Headers validation in test env
const mockNextResponse = vi.fn();
const mockRedirect = vi.fn();

vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      next: (...args: unknown[]) => {
        mockNextResponse(...args);
        return new actual.NextResponse(null, { status: 200 });
      },
      redirect: (url: URL | string) => {
        mockRedirect(url);
        return actual.NextResponse.redirect(url);
      },
    },
  };
});

function makeRequest(path: string, headers?: Record<string, string>) {
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: headers ?? {},
  });
}

describe("Admin auth middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  });

  it("allows /admin/login through without auth check", async () => {
    const { middleware } = await import("@/middleware");
    const res = await middleware(makeRequest("/admin/login"));
    expect(res.status).toBe(200);
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it("allows non-admin routes through without auth check", async () => {
    const { middleware } = await import("@/middleware");
    const res = await middleware(makeRequest("/products"));
    expect(res.status).toBe(200);
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated users from /admin to /admin/login", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const { middleware } = await import("@/middleware");
    const res = await middleware(makeRequest("/admin"));
    expect(res.status).toBe(307);
    expect(mockRedirect).toHaveBeenCalled();
    const redirectUrl = mockRedirect.mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe("/admin/login");
    expect(redirectUrl.searchParams.get("redirect")).toBe("/admin");
  });

  it("redirects unauthenticated users from /admin/products to /admin/login", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const { middleware } = await import("@/middleware");
    const res = await middleware(makeRequest("/admin/products"));
    expect(res.status).toBe(307);
    const redirectUrl = mockRedirect.mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe("/admin/login");
    expect(redirectUrl.searchParams.get("redirect")).toBe("/admin/products");
  });

  it("redirects unauthenticated users from /admin/gallery to /admin/login", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const { middleware } = await import("@/middleware");
    const res = await middleware(makeRequest("/admin/gallery"));
    expect(res.status).toBe(307);
    const redirectUrl = mockRedirect.mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe("/admin/login");
    expect(redirectUrl.searchParams.get("redirect")).toBe("/admin/gallery");
  });

  it("redirects unauthenticated users from /admin/orders to /admin/login", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const { middleware } = await import("@/middleware");
    const res = await middleware(makeRequest("/admin/orders"));
    expect(res.status).toBe(307);
    const redirectUrl = mockRedirect.mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe("/admin/login");
    expect(redirectUrl.searchParams.get("redirect")).toBe("/admin/orders");
  });

  it("allows authenticated users through to /admin", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123", email: "admin@trex.com" } },
    });
    const { middleware } = await import("@/middleware");
    const res = await middleware(makeRequest("/admin"));
    expect(res.status).toBe(200);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("allows authenticated users through to /admin/products", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123", email: "admin@trex.com" } },
    });
    const { middleware } = await import("@/middleware");
    const res = await middleware(makeRequest("/admin/products"));
    expect(res.status).toBe(200);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("strips x-middleware-subrequest header to prevent bypass attacks", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const { middleware } = await import("@/middleware");
    const res = await middleware(
      makeRequest("/admin", { "x-middleware-subrequest": "1" })
    );
    // Should still redirect — the header must not bypass auth
    expect(res.status).toBe(307);
    expect(mockRedirect).toHaveBeenCalled();
  });

  it("passes stripped headers (without x-middleware-subrequest) to NextResponse.next()", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123", email: "admin@trex.com" } },
    });
    const { middleware } = await import("@/middleware");
    await middleware(
      makeRequest("/admin", { "x-middleware-subrequest": "1", "x-custom": "keep" })
    );
    // Verify NextResponse.next was called with headers that exclude x-middleware-subrequest
    const callArgs = mockNextResponse.mock.calls;
    const lastCall = callArgs[callArgs.length - 1][0];
    const passedHeaders = lastCall.request.headers;
    expect(passedHeaders.get("x-middleware-subrequest")).toBeNull();
    expect(passedHeaders.get("x-custom")).toBe("keep");
  });

  it("passes stripped headers for non-admin routes too", async () => {
    const { middleware } = await import("@/middleware");
    await middleware(
      makeRequest("/products", { "x-middleware-subrequest": "1", "x-custom": "keep" })
    );
    const callArgs = mockNextResponse.mock.calls;
    const lastCall = callArgs[callArgs.length - 1][0];
    const passedHeaders = lastCall.request.headers;
    expect(passedHeaders.get("x-middleware-subrequest")).toBeNull();
    expect(passedHeaders.get("x-custom")).toBe("keep");
  });

  it("preserves redirect path in query params for post-login navigation", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const { middleware } = await import("@/middleware");
    await middleware(makeRequest("/admin/orders"));
    const redirectUrl = mockRedirect.mock.calls[0][0] as URL;
    expect(redirectUrl.searchParams.get("redirect")).toBe("/admin/orders");
  });

  it("exports matcher config for /admin/:path*", async () => {
    const { config } = await import("@/middleware");
    expect(config.matcher).toContain("/admin/:path*");
  });
});

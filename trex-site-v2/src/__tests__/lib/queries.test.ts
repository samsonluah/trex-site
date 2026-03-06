import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mocks ---

const mockCreateClient = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: mockCreateClient,
}));

// --- Chain builders ---

/**
 * Builds the fluent chain for getProducts():
 * .from("products").select("*").eq("in_stock", true).eq("visible", true).order(...)
 */
function makeProductsChain(result: { data: object[] | null; error: object | null }) {
  const eqCalls: Array<[string, unknown]> = [];
  const orderMock = vi.fn().mockResolvedValue(result);
  const eqMock: ReturnType<typeof vi.fn> = vi.fn().mockImplementation((col: string, val: unknown) => {
    eqCalls.push([col, val]);
    return { eq: eqMock, order: orderMock };
  });
  const selectMock = vi.fn().mockReturnValue({ eq: eqMock, order: orderMock });
  const fromMock = vi.fn().mockReturnValue({ select: selectMock });

  return { client: { from: fromMock }, eqCalls, orderMock, selectMock, fromMock };
}

/**
 * Builds the fluent chain for getAllProducts():
 * .from("products").select("*").order(...)
 */
function makeAllProductsChain(result: { data: object[] | null; error: object | null }) {
  const orderMock = vi.fn().mockResolvedValue(result);
  const selectMock = vi.fn().mockReturnValue({ order: orderMock });
  const fromMock = vi.fn().mockReturnValue({ select: selectMock });

  return { client: { from: fromMock }, orderMock, selectMock };
}

/**
 * Builds the fluent chain for getProductBySlug():
 * .from("products").select("*").eq("slug", slug).single()
 */
function makeSlugChain(result: { data: object | null; error: object | null }) {
  const singleMock = vi.fn().mockResolvedValue(result);
  const eqMock = vi.fn().mockReturnValue({ single: singleMock });
  const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
  const fromMock = vi.fn().mockReturnValue({ select: selectMock });

  return { client: { from: fromMock }, eqMock, singleMock };
}

// --- Sample data ---

const visibleInStock = { id: "1", name: "Singlet", in_stock: true, visible: true, sort_order: 1 };
const visibleOutOfStock = { id: "2", name: "Shorts", in_stock: false, visible: true, sort_order: 2 };
const hiddenInStock = { id: "3", name: "Cap", in_stock: true, visible: false, sort_order: 3 };

describe("getProducts()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("returns products where in_stock=true AND visible=true", async () => {
    const { client, eqCalls } = makeProductsChain({ data: [visibleInStock], error: null });
    mockCreateClient.mockResolvedValue(client);

    const { getProducts } = await import("@/lib/supabase/queries");
    const result = await getProducts();

    expect(result).toEqual([visibleInStock]);
    expect(eqCalls).toContainEqual(["in_stock", true]);
    expect(eqCalls).toContainEqual(["visible", true]);
  });

  it("excludes out-of-stock products even if visible=true", async () => {
    // Supabase enforces the filter — mock returns only what matches in_stock=true
    const { client, eqCalls } = makeProductsChain({ data: [], error: null });
    mockCreateClient.mockResolvedValue(client);

    const { getProducts } = await import("@/lib/supabase/queries");
    const result = await getProducts();

    expect(result).toEqual([]);
    // Confirm the in_stock filter was applied
    expect(eqCalls).toContainEqual(["in_stock", true]);
  });

  it("excludes hidden products even if in_stock=true", async () => {
    const { client, eqCalls } = makeProductsChain({ data: [], error: null });
    mockCreateClient.mockResolvedValue(client);

    const { getProducts } = await import("@/lib/supabase/queries");
    const result = await getProducts();

    expect(result).toEqual([]);
    expect(eqCalls).toContainEqual(["visible", true]);
  });

  it("orders results by sort_order ascending", async () => {
    const { client, orderMock } = makeProductsChain({ data: [visibleInStock], error: null });
    mockCreateClient.mockResolvedValue(client);

    const { getProducts } = await import("@/lib/supabase/queries");
    await getProducts();

    expect(orderMock).toHaveBeenCalledWith("sort_order", { ascending: true });
  });

  it("returns [] when query returns no data", async () => {
    const { client } = makeProductsChain({ data: null, error: null });
    mockCreateClient.mockResolvedValue(client);

    const { getProducts } = await import("@/lib/supabase/queries");
    const result = await getProducts();

    expect(result).toEqual([]);
  });

  it("throws when Supabase returns an error", async () => {
    const { client } = makeProductsChain({ data: null, error: { message: "DB error" } });
    mockCreateClient.mockResolvedValue(client);

    const { getProducts } = await import("@/lib/supabase/queries");
    await expect(getProducts()).rejects.toMatchObject({ message: "DB error" });
  });
});

describe("getProductBySlug()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("returns a product matching the slug regardless of in_stock/visible", async () => {
    const product = { ...hiddenInStock, slug: "cap" };
    const { client, eqMock } = makeSlugChain({ data: product, error: null });
    mockCreateClient.mockResolvedValue(client);

    const { getProductBySlug } = await import("@/lib/supabase/queries");
    const result = await getProductBySlug("cap");

    expect(result).toEqual(product);
    expect(eqMock).toHaveBeenCalledWith("slug", "cap");
  });

  it("returns null when Supabase returns an error (slug not found)", async () => {
    const { client } = makeSlugChain({ data: null, error: { message: "No rows found" } });
    mockCreateClient.mockResolvedValue(client);

    const { getProductBySlug } = await import("@/lib/supabase/queries");
    const result = await getProductBySlug("nonexistent-slug");

    expect(result).toBeNull();
  });
});

describe("getAllProducts()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("returns all products regardless of in_stock or visible status", async () => {
    const allProducts = [visibleInStock, visibleOutOfStock, hiddenInStock];
    const { client } = makeAllProductsChain({ data: allProducts, error: null });
    mockCreateClient.mockResolvedValue(client);

    const { getAllProducts } = await import("@/lib/supabase/queries");
    const result = await getAllProducts();

    expect(result).toEqual(allProducts);
    expect(result).toHaveLength(3);
  });

  it("orders results by sort_order ascending", async () => {
    const { client, orderMock } = makeAllProductsChain({ data: [visibleInStock], error: null });
    mockCreateClient.mockResolvedValue(client);

    const { getAllProducts } = await import("@/lib/supabase/queries");
    await getAllProducts();

    expect(orderMock).toHaveBeenCalledWith("sort_order", { ascending: true });
  });

  it("returns [] when query returns no data", async () => {
    const { client } = makeAllProductsChain({ data: null, error: null });
    mockCreateClient.mockResolvedValue(client);

    const { getAllProducts } = await import("@/lib/supabase/queries");
    const result = await getAllProducts();

    expect(result).toEqual([]);
  });

  it("throws when Supabase returns an error", async () => {
    const { client } = makeAllProductsChain({ data: null, error: { message: "Connection failed" } });
    mockCreateClient.mockResolvedValue(client);

    const { getAllProducts } = await import("@/lib/supabase/queries");
    await expect(getAllProducts()).rejects.toMatchObject({ message: "Connection failed" });
  });
});

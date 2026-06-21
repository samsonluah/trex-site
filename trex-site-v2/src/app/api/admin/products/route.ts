import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/supabase/auth-guard";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeProductPayload(body: Record<string, unknown>) {
  const payload = { ...body };
  const hasProductFields = "name" in payload || "slug" in payload;

  if (!hasProductFields) {
    return { payload };
  }

  if (typeof payload.name === "string") {
    payload.name = payload.name.trim();
  }

  const name = typeof payload.name === "string" ? payload.name : "";
  const rawSlug = typeof payload.slug === "string" ? payload.slug : "";
  payload.slug = rawSlug ? slugify(rawSlug) : slugify(name);

  if (!payload.slug) {
    return { error: "Product slug is required" };
  }

  return { payload };
}

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = await request.json();
  const normalized = normalizeProductPayload(body);

  if (normalized.error) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("products")
    .insert(normalized.payload)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = await request.json();
  const { id, ...updates } = body;
  const normalized = normalizeProductPayload(updates);

  if (normalized.error) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("products")
    .update(normalized.payload)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { id } = await request.json();
  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("products")
    .delete()
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

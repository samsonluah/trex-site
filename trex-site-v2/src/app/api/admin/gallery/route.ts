import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/supabase/auth-guard";

export const maxDuration = 30;

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const supabase = createAdminClient();

  // List all files in storage under the gallery/ prefix
  const { data: storageFiles, error: storageError } = await supabase.storage
    .from("gallery")
    .list("gallery", { limit: 1000, sortBy: { column: "created_at", order: "asc" } });

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  // Fetch all DB rows
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dbRows, error: dbError } = await (supabase as any)
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Build map: storage_path → DB row
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbMap = new Map<string, any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const row of dbRows as any[]) {
    dbMap.set(row.storage_path, row);
  }

  // Merge: for each storage file, produce an entry
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const merged: any[] = [];
  for (const file of storageFiles ?? []) {
    const storagePath = `gallery/${file.name}`;
    const dbRow = dbMap.get(storagePath);
    const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(storagePath);

    if (dbRow) {
      merged.push({ ...dbRow, synced: true });
    } else {
      merged.push({
        id: storagePath, // use path as temporary id
        url: publicUrl,
        storage_path: storagePath,
        caption: null,
        sort_order: null,
        created_at: file.created_at ?? new Date().toISOString(),
        synced: false,
      });
    }
  }

  return NextResponse.json(merged);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const caption = formData.get("caption") as string | null;

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const storagePath = `gallery/${Date.now()}.${ext}`;

  // Convert File to ArrayBuffer for reliable upload across runtimes
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(storagePath, arrayBuffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("gallery").getPublicUrl(storagePath);

  // Get current max sort_order
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from("gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder =
    existing && existing.length > 0 ? (existing[0].sort_order ?? 0) + 1 : 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("gallery_images")
    .insert({
      url: publicUrl,
      storage_path: storagePath,
      caption: caption?.trim() || null,
      sort_order: nextOrder,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { storage_path, caption } = await request.json();

  if (!storage_path) {
    return NextResponse.json({ error: "storage_path required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: { publicUrl: url } } = supabase.storage.from("gallery").getPublicUrl(storage_path);

  // Check if a DB row already exists for this storage_path
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from("gallery_images")
    .select("id")
    .eq("storage_path", storage_path)
    .maybeSingle();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let error: any;

  if (existing) {
    // Update existing row
    ({ data: result, error } = await (supabase as any)
      .from("gallery_images")
      .update({ caption: caption?.trim() || null })
      .eq("storage_path", storage_path)
      .select()
      .single());
  } else {
    // Insert new row — get next sort_order first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: maxRow } = await (supabase as any)
      .from("gallery_images")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextOrder =
      maxRow && maxRow.length > 0 ? (maxRow[0].sort_order ?? 0) + 1 : 0;

    ({ data: result, error } = await (supabase as any)
      .from("gallery_images")
      .insert({
        url,
        storage_path,
        caption: caption?.trim() || null,
        sort_order: nextOrder,
      })
      .select()
      .single());
  }

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...result, synced: true });
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id, storage_path } = await request.json();
  const supabase = createAdminClient();

  // Always remove from storage
  if (storage_path) {
    await supabase.storage.from("gallery").remove([storage_path]);
  }

  // Only delete from DB if a real UUID id was provided (synced images)
  // For unsynced images id === storage_path, which is not a UUID
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (id && uuidPattern.test(id)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

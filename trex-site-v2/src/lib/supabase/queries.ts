import { createClient } from "@/lib/supabase/server";
import type { Product, GalleryImage } from "@/types";

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as Product;
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createClient();

  // Fetch DB records for metadata (caption, sort_order)
  const { data: dbImages, error: dbError } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });

  if (dbError) throw dbError;

  // List all files in the storage bucket's gallery/ folder
  const { data: files } = await supabase.storage
    .from("gallery")
    .list("gallery", { sortBy: { column: "created_at", order: "asc" } });

  if (!files || files.length === 0) {
    return (dbImages ?? []) as GalleryImage[];
  }

  // Build a set of storage paths that actually exist in the bucket
  const bucketPaths = new Set(
    files
      .filter((f) => !f.name.startsWith("."))
      .map((f) => `gallery/${f.name}`)
  );

  // Merge: use DB record if it exists, otherwise create entry from storage file
  const merged: GalleryImage[] = [];

  // First, add all DB images that still exist in storage
  for (const img of (dbImages ?? []) as GalleryImage[]) {
    if (bucketPaths.has(img.storage_path)) {
      merged.push(img);
      bucketPaths.delete(img.storage_path);
    }
  }

  // Then, add storage-only files (uploaded directly, no DB record)
  const maxOrder = merged.length > 0
    ? Math.max(...merged.map((m) => m.sort_order))
    : -1;

  let orderCounter = maxOrder + 1;
  for (const storagePath of bucketPaths) {
    const { data: { publicUrl } } = supabase.storage
      .from("gallery")
      .getPublicUrl(storagePath);

    merged.push({
      id: storagePath,
      url: publicUrl,
      storage_path: storagePath,
      sort_order: orderCounter++,
      created_at: new Date().toISOString(),
    });
  }

  return merged;
}

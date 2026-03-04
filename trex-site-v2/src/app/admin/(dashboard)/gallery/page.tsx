"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Trash2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

interface AdminGalleryImage {
  id: string;
  url: string;
  storage_path: string;
  caption: string | null;
  sort_order: number | null;
  created_at: string;
  synced: boolean;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<AdminGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadCaption, setUploadCaption] = useState("");
  const [editingCaptions, setEditingCaptions] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const res = await fetch("/api/admin/gallery");
    const data: AdminGalleryImage[] = await res.json();
    setImages(data);
    const captions: Record<string, string> = {};
    for (const img of data) {
      captions[img.id] = img.caption ?? "";
    }
    setEditingCaptions(captions);
    setLoading(false);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (uploadCaption) formData.append("caption", uploadCaption.replace(/^@+/, ""));

    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("Image uploaded");
      setUploadCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchImages();
    } else {
      const { error } = await res.json();
      toast.error(error || "Upload failed");
    }
    setUploading(false);
  }

  async function handleSaveCaption(image: AdminGalleryImage) {
    setSaving((prev) => ({ ...prev, [image.id]: true }));
    const handle = (editingCaptions[image.id] ?? "").replace(/^@+/, "").trim();

    const res = await fetch("/api/admin/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storage_path: image.storage_path,
        url: image.url,
        caption: handle || null,
      }),
    });

    if (res.ok) {
      const saved: AdminGalleryImage = await res.json();
      toast.success("Caption saved");
      setImages((prev) =>
        prev.map((img) =>
          img.storage_path === image.storage_path ? saved : img
        )
      );
      setEditingCaptions((prev) => {
        const next = { ...prev };
        if (image.id !== saved.id) {
          next[saved.id] = next[image.id] ?? handle;
          delete next[image.id];
        }
        return next;
      });
    } else {
      const { error } = await res.json();
      toast.error(error || "Save failed");
    }
    setSaving((prev) => ({ ...prev, [image.id]: false }));
  }

  async function handleDelete(image: AdminGalleryImage) {
    if (!confirm("Delete this image?")) return;

    const res = await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: image.id, storage_path: image.storage_path }),
    });

    if (res.ok) {
      toast.success("Image deleted");
      setImages((prev) => prev.filter((img) => img.storage_path !== image.storage_path));
    } else {
      const { error } = await res.json();
      toast.error(error || "Delete failed");
    }
  }

  const unsyncedCount = images.filter((img) => !img.synced).length;

  if (loading) {
    return <div className="text-trex-muted">Loading gallery...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Gallery</h1>

      {/* Upload form */}
      <form
        onSubmit={handleUpload}
        className="site-card p-6 mb-6 flex items-end gap-4"
      >
        <div className="flex-1">
          <label className="site-label block mb-1">Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            required
            className="text-sm file:border file:border-trex-fg/20 file:rounded-full file:px-3 file:py-1 file:text-xs file:font-medium file:bg-transparent file:text-trex-fg file:cursor-pointer file:mr-3 file:transition-colors file:hover:bg-trex-fg/5"
          />
        </div>
        <div className="flex-1">
          <label className="site-label block mb-1">Photographer Instagram (optional)</label>
          <div className="flex items-center bg-trex-bg rounded-xl overflow-hidden">
            <span className="pl-3 text-sm text-trex-muted select-none">@</span>
            <input
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              placeholder="handle"
              className="flex-1 bg-transparent border-0 p-2.5 text-sm outline-none"
            />
          </div>
        </div>
        <InteractiveHoverButton
          type="submit"
          disabled={uploading}
          text={uploading ? "Uploading..." : "Upload"}
        />
      </form>

      {/* Unsynced alert */}
      {unsyncedCount > 0 && (
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-amber-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            {unsyncedCount} image{unsyncedCount > 1 ? "s were" : " was"} uploaded directly to
            storage and {unsyncedCount > 1 ? "have" : "has"} no photographer credit yet. Add a
            handle and click Save to sync.
          </span>
        </div>
      )}

      {images.length === 0 ? (
        <p className="text-trex-muted">No images yet. Upload one above.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.storage_path} className="site-card overflow-hidden group relative flex flex-col">
              {/* Unsynced badge */}
              {!image.synced && (
                <span className="absolute top-2 left-2 z-10 text-[10px] font-bold tracking-wider bg-amber-500 text-black px-1.5 py-0.5 rounded">
                  UNSYNCED
                </span>
              )}

              {/* Thumbnail */}
              <div className="relative w-full aspect-square">
                <Image
                  src={image.url}
                  alt={image.caption ? `@${image.caption}` : "Gallery image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              {/* Caption input + actions */}
              <div className="p-3 flex flex-col gap-2">
                <div className="flex items-center bg-trex-bg rounded-lg overflow-hidden">
                  <span className="pl-2 text-xs text-trex-muted select-none">@</span>
                  <input
                    value={editingCaptions[image.id] ?? ""}
                    onChange={(e) =>
                      setEditingCaptions((prev) => ({ ...prev, [image.id]: e.target.value }))
                    }
                    placeholder="handle"
                    className="flex-1 bg-transparent border-0 px-1.5 py-1.5 text-xs outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <InteractiveHoverButton
                    onClick={() => handleSaveCaption(image)}
                    disabled={saving[image.id]}
                    text={saving[image.id] ? "Saving…" : "Save"}
                    className="flex-1 text-xs py-1.5 px-2"
                  />
                  <button
                    onClick={() => handleDelete(image)}
                    className="p-1.5 rounded-full border border-trex-fg/10 bg-trex-bg text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

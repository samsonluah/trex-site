"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import type { GalleryImage } from "@/types";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setImages(data);
    setLoading(false);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (caption) formData.append("caption", caption);

    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("Image uploaded");
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchImages();
    } else {
      const { error } = await res.json();
      toast.error(error || "Upload failed");
    }
    setUploading(false);
  }

  async function handleDelete(image: GalleryImage) {
    if (!confirm("Delete this image?")) return;

    const res = await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: image.id, storage_path: image.storage_path }),
    });

    if (res.ok) {
      toast.success("Image deleted");
      fetchImages();
    }
  }

  if (loading) {
    return <div className="text-trex-muted">Loading gallery...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Gallery</h1>

      <form
        onSubmit={handleUpload}
        className="site-card p-6 mb-8 flex items-end gap-4"
      >
        <div className="flex-1">
          <label className="site-label block mb-1">Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            required
            className="text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="site-label block mb-1">Caption (optional)</label>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full bg-trex-bg border-0 rounded-xl p-2.5 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="site-button flex items-center gap-2 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {images.length === 0 ? (
        <p className="text-trex-muted">No images yet. Upload one above.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="site-card overflow-hidden group relative">
              <Image
                src={image.url}
                alt={image.caption || "Gallery image"}
                width={400}
                height={400}
                className="w-full aspect-square object-cover"
              />
              {image.caption && (
                <p className="p-3 text-sm text-trex-muted">{image.caption}</p>
              )}
              <button
                onClick={() => handleDelete(image)}
                className="absolute top-2 right-2 p-2 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

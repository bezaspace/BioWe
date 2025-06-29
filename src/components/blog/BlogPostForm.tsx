import React, { useState, useRef } from "react";
import { BlogPost } from "@/types";

type BlogPostFormProps = {
  initial?: Partial<BlogPost>;
  onSubmit: (data: Omit<BlogPost, "id">) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  getIdToken?: () => Promise<string | null>;
};

export default function BlogPostForm({
  initial = {},
  onSubmit,
  onCancel,
  loading = false,
  getIdToken,
}: BlogPostFormProps) {
  const [form, setForm] = useState<Omit<BlogPost, "id" | "slug">>({
    title: initial.title || "",
    excerpt: initial.excerpt || "",
    content: initial.content || "",
    imageSrc: initial.imageSrc || "",
    imageAlt: initial.imageAlt || "",
    dataAiHint: initial.dataAiHint || "",
    author: initial.author || "",
    date: initial.date || new Date().toISOString(),
  });
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);

    try {
      let token: string | null = null;
      if (getIdToken) {
        token = await getIdToken();
      }
      if (!token) {
        setUploadError("Not authenticated.");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/products/upload", { // Reusing the product image upload endpoint
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setForm((prev) => ({ ...prev, imageSrc: data.url }));
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.excerpt || !form.content || !form.imageSrc || !form.author || !form.date) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      const slug = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      await onSubmit({ ...form, slug });
    } catch (err: any) {
      setError(err.message || "Failed to save blog post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <label className="block font-medium">Title*</label>
        <input
          className="border px-2 py-1 rounded w-full"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium">Excerpt*</label>
        <textarea
          className="border px-2 py-1 rounded w-full"
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium">Content*</label>
        <textarea
          className="border px-2 py-1 rounded w-full h-48"
          name="content"
          value={form.content}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium">Blog Post Image*</label>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={uploading || loading}
          />
          {uploading && <span className="text-blue-600">Uploading...</span>}
          {uploadError && <span className="text-red-600">{uploadError}</span>}
          {form.imageSrc && (
            <img
              src={form.imageSrc}
              alt="Preview"
              className="w-32 h-32 object-contain border rounded"
            />
          )}
          <input
            className="border px-2 py-1 rounded w-full"
            name="imageSrc"
            value={form.imageSrc}
            onChange={handleChange}
            required
            placeholder="Image URL or upload above"
          />
        </div>
      </div>
      <div>
        <label className="block font-medium">Image Alt*</label>
        <input
          className="border px-2 py-1 rounded w-full"
          name="imageAlt"
          value={form.imageAlt}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium">Author*</label>
        <input
          className="border px-2 py-1 rounded w-full"
          name="author"
          value={form.author}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium">Date*</label>
        <input
          className="border px-2 py-1 rounded w-full"
          name="date"
          type="date"
          value={form.date.substring(0, 10)}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Save
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

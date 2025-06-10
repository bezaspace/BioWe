import React, { useState, useRef } from "react";
import { Product } from "@/types";

type ProductFormProps = {
  initial?: Partial<Product>;
  onSubmit: (data: Omit<Product, "id">) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  getIdToken?: () => Promise<string | null>;
};

export default function ProductForm({
  initial = {},
  onSubmit,
  onCancel,
  loading = false,
  getIdToken,
}: ProductFormProps) {
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: initial.name || "",
    description: initial.description || "",
    price: initial.price || 0,
    imageSrc: initial.imageSrc || "",
    imageAlt: initial.imageAlt || "",
    category: initial.category || "",
    dataAiHint: initial.dataAiHint || "",
    rating: initial.rating || 0,
    reviewCount: initial.reviewCount || 0,
    availability: initial.availability || "In Stock",
    features: Array.isArray(initial.features) ? initial.features : [],
    howToUse: Array.isArray(initial.howToUse) ? initial.howToUse : [],
    ingredients: Array.isArray(initial.ingredients) ? initial.ingredients : [],
    safetyInfo: initial.safetyInfo || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initial.imageSrc || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "rating" || name === "reviewCount"
        ? Number(value)
        : value,
    }));
  };

  // Handle file input change and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    setUploadProgress(null);

    try {
      // Get admin token from prop or localStorage
      let token: string | null = null;
      if (getIdToken) {
        token = await getIdToken();
      }
      if (!token) {
        token = localStorage.getItem("idToken");
      }
      if (!token) {
        setUploadError("Not authenticated.");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/products/upload", {
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
      setForm((prev) => ({
        ...prev,
        imageSrc: data.url,
      }));
      setImagePreview(data.url);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.description || !form.price || !form.imageSrc || !form.imageAlt || !form.category) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err.message || "Failed to save product.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <label className="block font-medium">Name*</label>
        <input
          className="border px-2 py-1 rounded w-full"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium">Description*</label>
        <textarea
          className="border px-2 py-1 rounded w-full"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium">Price (₹)*</label>
        <input
          className="border px-2 py-1 rounded w-full"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium">Product Image*</label>
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
          {imagePreview && (
            <img
              src={imagePreview}
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
        <label className="block font-medium">Category*</label>
        <input
          className="border px-2 py-1 rounded w-full"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />
      </div>
      {/* Add more fields as needed */}
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

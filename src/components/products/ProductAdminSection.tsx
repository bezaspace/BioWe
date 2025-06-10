import React, { useEffect, useState } from "react";
import { Product } from "@/types";
import ProductForm from "./ProductForm";
type ProductAdminSectionProps = {
  getIdToken: () => Promise<string | null>;
};

export default function ProductAdminSection({ getIdToken }: ProductAdminSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // Edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Save (add or edit)
  const handleSaveProduct = async (data: Omit<Product, "id">) => {
    setFormLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      let res;
      if (editingProduct) {
        // Edit
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
      } else {
        // Add
        res = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
      }
      if (!res.ok) {
        const resp = await res.json();
        throw new Error(resp.error || "Failed to save product");
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product");
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        {showForm ? (
          <ProductForm
            initial={editingProduct || undefined}
            onSubmit={handleSaveProduct}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            loading={formLoading}
            getIdToken={getIdToken}
          />
        ) : (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAddProduct}
          >
            + Add Product
          </button>
        )}
      </div>
      {loading && <div>Loading products...</div>}
      {error && <div className="text-red-600 mb-2">Error: {error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">{p.category}</td>
                <td className="px-4 py-2 border">₹{p.price}</td>
                <td className="px-4 py-2 border">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEditProduct(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="text-gray-500 py-4 text-center">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

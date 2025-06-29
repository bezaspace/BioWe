import React, { useEffect, useState } from "react";
import { BlogPost } from "@/types";
import BlogPostForm from "./BlogPostForm";

type BlogAdminSectionProps = {
  getIdToken: () => Promise<string | null>;
};

export default function BlogAdminSection({ getIdToken }: BlogAdminSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleSavePost = async (data: Omit<BlogPost, "id">) => {
    setFormLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      let res;
      if (editingPost) {
        res = await fetch(`/api/blog/${editingPost.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
      } else {
        res = await fetch("/api/blog", {
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
        throw new Error(resp.error || "Failed to save blog post");
      }
      setShowForm(false);
      setEditingPost(null);
      fetchPosts();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete blog post");
      }
      setPosts((prev) => prev.filter((p) => p.id !== id));
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
          <BlogPostForm
            initial={editingPost || undefined}
            onSubmit={handleSavePost}
            onCancel={() => {
              setShowForm(false);
              setEditingPost(null);
            }}
            loading={formLoading}
            getIdToken={getIdToken}
          />
        ) : (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAddPost}
          >
            + Add Blog Post
          </button>
        )}
      </div>
      {loading && <div>Loading blog posts...</div>}
      {error && <div className="text-red-600 mb-2">Error: {error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Author</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2 border">{p.title}</td>
                <td className="px-4 py-2 border">{p.author}</td>
                <td className="px-4 py-2 border">{new Date(p.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEditPost(p)}
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
            {posts.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="text-gray-500 py-4 text-center">
                  No blog posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

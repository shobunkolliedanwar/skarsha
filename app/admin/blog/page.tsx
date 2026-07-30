"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import type { BlogPost } from "@/lib/types";

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  is_published: false,
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadPosts() {
    setLoading(true);
    const res = await fetch("/api/blog");
    const body = await res.json();
    setPosts(body.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setModalOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content,
      cover_image_url: post.cover_image_url ?? "",
      is_published: post.is_published,
    });
    setError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(editingId ? `/api/blog/${editingId}` : "/api/blog", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const body = await res.json();

    if (!res.ok) {
      setError(body.error ?? "Gagal menyimpan tulisan");
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    loadPosts();
  }

  async function togglePublish(post: BlogPost) {
    await fetch(`/api/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !post.is_published }),
    });
    loadPosts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus tulisan ini?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    loadPosts();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white">Blog</h1>
          <p className="mt-1 text-sm text-white/40">Kelola tulisan yang tampil di halaman Blog.</p>
        </div>
        <button
          onClick={openCreate}
          className="focus-ring flex items-center gap-2 rounded-lg bg-gradient-to-r from-gilt-400 to-gilt-500 px-4 py-2.5 text-sm font-medium text-ink-950 transition hover:opacity-90"
        >
          <Plus size={16} />
          Tulisan Baru
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <p className="py-10 text-center text-sm text-white/30">Memuat...</p>
        ) : posts.length === 0 ? (
          <p className="py-10 text-center text-sm text-white/30">Belum ada tulisan.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wide text-white/35">
                <th className="px-5 py-3 font-medium">Judul</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-5 py-3.5">
                    <p className="text-white/85">{post.title}</p>
                    <p className="text-xs text-white/35">/blog/{post.slug}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => togglePublish(post)}
                      className={`focus-ring flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${
                        post.is_published
                          ? "bg-aurora-teal/15 text-aurora-teal"
                          : "bg-white/[0.06] text-white/40"
                      }`}
                    >
                      {post.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                      {post.is_published ? "Terbit" : "Draft"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(post)}
                        className="focus-ring rounded-md p-2 text-white/40 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="focus-ring rounded-md p-2 text-white/40 transition hover:bg-aurora-rose/10 hover:text-aurora-rose"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editingId ? "Edit Tulisan" : "Tulisan Baru"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              Judul
              <input
                required
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({ ...f, title, slug: editingId ? f.slug : slugify(title) }));
                }}
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              Slug
              <input
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              Ringkasan
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={2}
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              URL Gambar Sampul
              <input
                value={form.cover_image_url}
                onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
                placeholder="https://..."
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              Konten
              <textarea
                required
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={8}
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-white/60">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                className="h-4 w-4 rounded border-white/20 bg-white/[0.03]"
              />
              Publikasikan sekarang
            </label>

            {error && (
              <p className="rounded-lg border border-aurora-rose/30 bg-aurora-rose/10 px-3 py-2 text-sm text-aurora-rose">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="focus-ring mt-1 rounded-lg bg-gradient-to-r from-gilt-400 to-gilt-500 py-2.5 font-medium text-ink-950 transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

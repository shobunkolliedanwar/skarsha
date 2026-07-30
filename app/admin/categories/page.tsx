"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ICON_NAMES, resolveIcon } from "@/lib/icon-map";
import type { Category } from "@/lib/types";

type CategoryRow = Category & { links: { count: number }[] };

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  icon: "sparkles",
  accent_color: "#C9A24C",
  sort_order: 0,
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadCategories() {
    setLoading(true);
    const res = await fetch("/api/categories");
    const body = await res.json();
    setCategories(body.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setModalOpen(true);
  }

  function openEdit(category: CategoryRow) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      icon: category.icon ?? "sparkles",
      accent_color: category.accent_color ?? "#C9A24C",
      sort_order: category.sort_order,
    });
    setError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(
      editingId ? `/api/categories/${editingId}` : "/api/categories",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    const body = await res.json();

    if (!res.ok) {
      setError(body.error ?? "Gagal menyimpan kategori");
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    loadCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus kategori ini beserta seluruh sub kategorinya?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    loadCategories();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white">Kategori</h1>
          <p className="mt-1 text-sm text-white/40">
            Kelola kategori utama, contoh: CPNS, Music, Film.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="focus-ring flex items-center gap-2 rounded-lg bg-gradient-to-r from-gilt-400 to-gilt-500 px-4 py-2.5 text-sm font-medium text-ink-950 transition hover:opacity-90"
        >
          <Plus size={16} />
          Tambah Kategori
        </button>
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <p className="py-10 text-center text-sm text-white/30">Memuat...</p>
        ) : categories.length === 0 ? (
          <p className="py-10 text-center text-sm text-white/30">
            Belum ada kategori.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wide text-white/35">
                <th className="px-5 py-3 font-medium">Kategori</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium">Sub Kategori</th>
                <th className="px-5 py-3 font-medium">Urutan</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const Icon = resolveIcon(category.icon);
                return (
                  <tr key={category.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: `${category.accent_color}22`,
                            color: category.accent_color ?? "#C9A24C",
                          }}
                        >
                          <Icon size={15} />
                        </span>
                        <span className="text-white/85">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white/45">{category.slug}</td>
                    <td className="px-5 py-3.5 text-white/45">
                      {category.links?.[0]?.count ?? 0}
                    </td>
                    <td className="px-5 py-3.5 text-white/45">{category.sort_order}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(category)}
                          className="focus-ring rounded-md p-2 text-white/40 transition hover:bg-white/[0.06] hover:text-white"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="focus-ring rounded-md p-2 text-white/40 transition hover:bg-aurora-rose/10 hover:text-aurora-rose"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal
          title={editingId ? "Edit Kategori" : "Tambah Kategori"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              Nama Kategori
              <input
                required
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name,
                    slug: editingId ? f.slug : slugify(name),
                  }));
                }}
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
                placeholder="Music"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              Slug
              <input
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
                placeholder="music"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              Deskripsi
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
                placeholder="Streaming dan koleksi musik pilihan"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-sm text-white/60">
                Ikon
                <select
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
                >
                  {ICON_NAMES.map((name) => (
                    <option key={name} value={name} className="bg-ink-850">
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-sm text-white/60">
                Warna Aksen
                <input
                  type="color"
                  value={form.accent_color}
                  onChange={(e) => setForm((f) => ({ ...f, accent_color: e.target.value }))}
                  className="focus-ring h-[41px] rounded-lg border border-white/10 bg-white/[0.03] px-2"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              Urutan Tampil
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                }
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
              />
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

"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, MousePointerClick } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ICON_NAMES, resolveIcon } from "@/lib/icon-map";
import type { Category, LinkItem } from "@/lib/types";

const EMPTY_FORM = {
  category_id: "",
  name: "",
  slug: "",
  url: "",
  description: "",
  icon: "link",
  sort_order: 0,
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);
    const [linksRes, categoriesRes] = await Promise.all([
      fetch("/api/links"),
      fetch("/api/categories"),
    ]);
    const linksBody = await linksRes.json();
    const categoriesBody = await categoriesRes.json();
    setLinks(linksBody.data ?? []);
    setCategories(categoriesBody.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, category_id: categories[0]?.id ?? "" });
    setError(null);
    setModalOpen(true);
  }

  function openEdit(link: LinkItem) {
    setEditingId(link.id);
    setForm({
      category_id: link.category_id,
      name: link.name,
      slug: link.slug,
      url: link.url,
      description: link.description ?? "",
      icon: link.icon ?? "link",
      sort_order: link.sort_order,
    });
    setError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(editingId ? `/api/links/${editingId}` : "/api/links", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const body = await res.json();

    if (!res.ok) {
      setError(body.error ?? "Gagal menyimpan sub kategori");
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus sub kategori ini?")) return;
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    loadData();
  }

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const filteredLinks =
    filterCategory === "all"
      ? links
      : links.filter((l) => l.category_id === filterCategory);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-white">Sub Kategori</h1>
          <p className="mt-1 text-sm text-white/40">
            Website di dalam tiap kategori, lengkap dengan URL dan jumlah klik.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
          >
            <option value="all" className="bg-ink-850">Semua kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink-850">
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={openCreate}
            disabled={categories.length === 0}
            className="focus-ring flex items-center gap-2 rounded-lg bg-gradient-to-r from-gilt-400 to-gilt-500 px-4 py-2.5 text-sm font-medium text-ink-950 transition hover:opacity-90 disabled:opacity-50"
          >
            <Plus size={16} />
            Tambah Sub Kategori
          </button>
        </div>
      </div>

      {categories.length === 0 && (
        <p className="rounded-lg border border-dashed border-white/10 px-4 py-3 text-sm text-white/40">
          Buat kategori terlebih dahulu di menu Kategori sebelum menambah sub kategori.
        </p>
      )}

      <div className="admin-card overflow-hidden">
        {loading ? (
          <p className="py-10 text-center text-sm text-white/30">Memuat...</p>
        ) : filteredLinks.length === 0 ? (
          <p className="py-10 text-center text-sm text-white/30">
            Belum ada sub kategori.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wide text-white/35">
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Kategori</th>
                <th className="px-5 py-3 font-medium">URL</th>
                <th className="px-5 py-3 font-medium">Klik</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link) => {
                const Icon = resolveIcon(link.icon);
                const category = categoryMap[link.category_id];
                return (
                  <tr key={link.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-white/60">
                          <Icon size={15} />
                        </span>
                        <span className="text-white/85">{link.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white/45">
                      {category?.name ?? "-"}
                    </td>
                    <td className="max-w-[220px] truncate px-5 py-3.5 text-white/45">
                      {link.url}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-gilt-300">
                        <MousePointerClick size={13} />
                        {link.click_count}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(link)}
                          className="focus-ring rounded-md p-2 text-white/40 transition hover:bg-white/[0.06] hover:text-white"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
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
          title={editingId ? "Edit Sub Kategori" : "Tambah Sub Kategori"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              Kategori
              <select
                required
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-ink-850">
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              Nama
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
                placeholder="SKARSHA CPNS"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              Slug
              <input
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
                placeholder="skarsha-cpns"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              URL Tujuan
              <input
                required
                type="url"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
                placeholder="https://cpns.skarsha.com"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-white/60">
              Deskripsi
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
                placeholder="Latihan soal & tryout CPNS terbaru"
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
            </div>

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

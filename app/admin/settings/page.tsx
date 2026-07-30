"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const EMPTY_FORM = {
  contact_email: "",
  contact_phone: "",
  contact_address: "",
  whatsapp_url: "",
  instagram_url: "",
  tiktok_url: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((body: { data: SiteSettings | null }) => {
        if (body.data) {
          setForm({
            contact_email: body.data.contact_email ?? "",
            contact_phone: body.data.contact_phone ?? "",
            contact_address: body.data.contact_address ?? "",
            whatsapp_url: body.data.whatsapp_url ?? "",
            instagram_url: body.data.instagram_url ?? "",
            tiktok_url: body.data.tiktok_url ?? "",
          });
        }
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return <p className="py-10 text-center text-sm text-white/30">Memuat...</p>;
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-white">Pengaturan</h1>
        <p className="mt-1 text-sm text-white/40">
          Informasi ini tampil di halaman Kontak publik.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="admin-card flex flex-col gap-4 p-6">
        <label className="flex flex-col gap-1.5 text-sm text-white/60">
          Email Kontak
          <input
            value={form.contact_email}
            onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
            className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-white/60">
          Nomor Telepon
          <input
            value={form.contact_phone}
            onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
            className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-white/60">
          Alamat
          <input
            value={form.contact_address}
            onChange={(e) => setForm((f) => ({ ...f, contact_address: e.target.value }))}
            className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-white/60">
          URL WhatsApp
          <input
            value={form.whatsapp_url}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp_url: e.target.value }))}
            className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
            placeholder="https://wa.me/62..."
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-white/60">
          URL Instagram
          <input
            value={form.instagram_url}
            onChange={(e) => setForm((f) => ({ ...f, instagram_url: e.target.value }))}
            className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
            placeholder="https://instagram.com/..."
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-white/60">
          URL TikTok
          <input
            value={form.tiktok_url}
            onChange={(e) => setForm((f) => ({ ...f, tiktok_url: e.target.value }))}
            className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
            placeholder="https://tiktok.com/@..."
          />
        </label>

        {saved && (
          <p className="rounded-lg border border-aurora-teal/30 bg-aurora-teal/10 px-3 py-2 text-sm text-aurora-teal">
            Pengaturan tersimpan.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="focus-ring flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gilt-400 to-gilt-500 py-2.5 font-medium text-ink-950 transition hover:opacity-90 disabled:opacity-60"
        >
          <Save size={15} />
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </form>
    </div>
  );
}

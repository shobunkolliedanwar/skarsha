"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm text-white/60">
          Nama
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-white/60">
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-white/60">
        Subjek
        <input
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-white/60">
        Pesan
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="focus-ring rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white"
        />
      </label>

      {status === "sent" && (
        <p className="rounded-lg border border-aurora-teal/30 bg-aurora-teal/10 px-3 py-2 text-sm text-aurora-teal">
          Pesan terkirim. Terima kasih sudah menghubungi kami!
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg border border-aurora-rose/30 bg-aurora-rose/10 px-3 py-2 text-sm text-aurora-rose">
          Gagal mengirim pesan. Coba lagi sebentar lagi.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="focus-ring flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gilt-400 to-gilt-500 py-2.5 font-medium text-ink-950 transition hover:opacity-90 disabled:opacity-60"
      >
        <Send size={15} />
        {status === "sending" ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
  );
}

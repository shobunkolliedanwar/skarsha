"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import type { ContactMessage } from "@/lib/types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    setLoading(true);
    const res = await fetch("/api/messages");
    const body = await res.json();
    setMessages(body.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function toggleRead(msg: ContactMessage) {
    await fetch(`/api/messages/${msg.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: !msg.is_read }),
    });
    loadMessages();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus pesan ini?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    loadMessages();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-white">Pesan Masuk</h1>
        <p className="mt-1 text-sm text-white/40">Pesan yang dikirim lewat form halaman Kontak.</p>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <p className="py-10 text-center text-sm text-white/30">Memuat...</p>
        ) : messages.length === 0 ? (
          <p className="admin-card py-10 text-center text-sm text-white/30">
            Belum ada pesan masuk.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`admin-card flex flex-col gap-2 p-5 ${!msg.is_read ? "border-gilt-400/30" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white/85">
                    {msg.name} <span className="font-normal text-white/40">— {msg.email}</span>
                  </p>
                  {msg.subject && <p className="text-xs text-white/40">{msg.subject}</p>}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    onClick={() => toggleRead(msg)}
                    className="focus-ring rounded-md p-2 text-white/40 transition hover:bg-white/[0.06] hover:text-white"
                    title={msg.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                  >
                    {msg.is_read ? <MailOpen size={15} /> : <Mail size={15} />}
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="focus-ring rounded-md p-2 text-white/40 transition hover:bg-aurora-rose/10 hover:text-aurora-rose"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-white/60">{msg.message}</p>
              <p className="text-[11px] text-white/25">
                {new Date(msg.created_at).toLocaleString("id-ID")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

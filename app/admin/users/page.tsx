"use client";

import { useEffect, useState } from "react";
import { Crown, Users as UsersIcon } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  is_premium: boolean;
  premium_plan: "monthly" | "lifetime" | null;
  premium_expires_at: string | null;
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((body) => setUsers(body.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.full_name ?? "").toLowerCase().includes(q)
    );
  });

  const premiumCount = users.filter((u) => u.is_premium).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white">Pengguna</h1>
          <p className="mt-1 text-sm text-white/40">
            {users.length} akun terdaftar &middot; {premiumCount} premium
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari email/nama..."
          className="focus-ring w-64 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/25"
        />
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <p className="py-10 text-center text-sm text-white/30">Memuat...</p>
        ) : filtered.length === 0 ? (
          <p className="flex flex-col items-center gap-2 py-12 text-sm text-white/30">
            <UsersIcon size={22} className="text-white/15" />
            Belum ada pengguna terdaftar.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-white/35">
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Berlaku Hingga</th>
                <th className="px-5 py-3 font-medium">Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filtered.map((u) => (
                <tr key={u.id} className="text-white/75">
                  <td className="px-5 py-3">{u.full_name || "—"}</td>
                  <td className="px-5 py-3 text-white/55">{u.email}</td>
                  <td className="px-5 py-3">
                    {u.is_premium ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gilt-400/15 px-2 py-1 text-xs font-medium text-gilt-300">
                        <Crown size={11} />
                        Premium {u.premium_plan === "lifetime" ? "Lifetime" : "Bulanan"}
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/[0.05] px-2 py-1 text-xs text-white/40">
                        Gratis
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-white/40">
                    {u.premium_plan === "lifetime"
                      ? "Selamanya"
                      : u.premium_expires_at
                        ? new Date(u.premium_expires_at).toLocaleDateString("id-ID")
                        : "—"}
                  </td>
                  <td className="px-5 py-3 text-xs text-white/40">
                    {new Date(u.created_at).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

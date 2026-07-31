"use client";

import { useEffect, useState } from "react";
import { Receipt, TrendingUp } from "lucide-react";

type AdminTransaction = {
  id: string;
  plan: "monthly" | "lifetime";
  amount: number;
  status: "pending" | "paid" | "failed" | "expired";
  tripay_merchant_ref: string;
  tripay_reference: string | null;
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
  users: { email: string; full_name: string | null }[] | { email: string; full_name: string | null } | null;
};

const STATUS_STYLE: Record<string, string> = {
  paid: "bg-emerald-400/15 text-emerald-300",
  pending: "bg-gilt-400/15 text-gilt-300",
  failed: "bg-aurora-rose/15 text-aurora-rose",
  expired: "bg-white/[0.06] text-white/40",
};

const STATUS_LABEL: Record<string, string> = {
  paid: "Lunas",
  pending: "Menunggu",
  failed: "Gagal",
  expired: "Kedaluwarsa",
};

function getUserInfo(users: AdminTransaction["users"]) {
  if (!users) return null;
  return Array.isArray(users) ? users[0] ?? null : users;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/transactions")
      .then((res) => res.json())
      .then((body) => setTransactions(body.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-white">Transaksi Premium</h1>
        <p className="mt-1 text-sm text-white/40">
          Riwayat pembayaran upgrade premium via Tripay.
        </p>
      </div>

      <div className="admin-card flex items-center gap-4 p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gilt-400/15 text-gilt-300">
          <TrendingUp size={20} />
        </span>
        <div>
          <p className="text-xs text-white/40">Total Pendapatan (lunas)</p>
          <p className="font-display text-2xl text-white">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <p className="py-10 text-center text-sm text-white/30">Memuat...</p>
        ) : transactions.length === 0 ? (
          <p className="flex flex-col items-center gap-2 py-12 text-sm text-white/30">
            <Receipt size={22} className="text-white/15" />
            Belum ada transaksi.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-white/35">
                <th className="px-5 py-3 font-medium">Pengguna</th>
                <th className="px-5 py-3 font-medium">Paket</th>
                <th className="px-5 py-3 font-medium">Jumlah</th>
                <th className="px-5 py-3 font-medium">Metode</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Ref Tripay</th>
                <th className="px-5 py-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {transactions.map((t) => {
                const user = getUserInfo(t.users);
                return (
                  <tr key={t.id} className="text-white/75">
                    <td className="px-5 py-3">
                      <p>{user?.full_name || "—"}</p>
                      <p className="text-xs text-white/40">{user?.email || "—"}</p>
                    </td>
                    <td className="px-5 py-3 text-white/60">
                      {t.plan === "lifetime" ? "Lifetime" : "Bulanan"}
                    </td>
                    <td className="px-5 py-3">Rp {t.amount.toLocaleString("id-ID")}</td>
                    <td className="px-5 py-3 text-white/60">
                      {t.payment_method || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          STATUS_STYLE[t.status] ?? "bg-white/[0.05] text-white/40"
                        }`}
                      >
                        {STATUS_LABEL[t.status] ?? t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-white/35">
                      {t.tripay_reference || t.tripay_merchant_ref}
                    </td>
                    <td className="px-5 py-3 text-xs text-white/40">
                      {new Date(t.created_at).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

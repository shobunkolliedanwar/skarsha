"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Crown, Zap } from "lucide-react";
import { useBookmarks } from "@/lib/bookmark-context";
import { PREMIUM_PRICING, formatRupiah } from "@/lib/pricing";

const PLANS = [
  {
    id: "monthly" as const,
    label: "Bulanan",
    price: formatRupiah(PREMIUM_PRICING.monthly),
    period: "/ bulan",
    tagline: "Cocok buat masa persiapan aktif",
  },
  {
    id: "lifetime" as const,
    label: "Lifetime",
    price: formatRupiah(PREMIUM_PRICING.lifetime),
    period: "sekali bayar",
    tagline: "Bayar sekali, premium selamanya",
    highlight: true,
  },
];

const PERKS = [
  "Tanpa iklan — langsung diarahkan ke link tujuan",
  "Simpan link favorit (bookmark) tanpa batas",
  "Notifikasi saat ada materi/link baru",
];

type Channel = { code: string; name: string; type: string };

export default function PremiumPage() {
  const { isLoggedIn, isPremium } = useBookmarks();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime">("lifetime");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/premium/channels")
      .then((res) => res.json())
      .then((body) => setChannels(body.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingChannels(false));
  }, []);

  async function handleCheckout() {
    if (!isLoggedIn) {
      window.location.href = "/masuk?next=/premium";
      return;
    }

    if (!selectedMethod) {
      setNotice("Pilih metode pembayaran dulu ya.");
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const res = await fetch("/api/premium/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, method: selectedMethod }),
      });
      const body = await res.json();

      if (!res.ok) {
        setNotice(body.error ?? "Gagal memproses. Coba lagi.");
        return;
      }

      if (body.checkout_url) {
        window.location.href = body.checkout_url;
      }
    } catch {
      setNotice("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-900 px-6 py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/3 h-[380px] w-[380px] rounded-full bg-aurora-violet/20 blur-[110px] animate-aurora-drift" />
        <div className="absolute bottom-[-120px] right-[10%] h-[340px] w-[340px] rounded-full bg-gilt-500/15 blur-[110px] animate-aurora-drift [animation-delay:4s]" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <p className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.2em] text-gilt-300">
          <Crown size={13} /> SKARSHA Premium
        </p>
        <h1 className="mt-3 font-display text-3xl text-white sm:text-4xl">
          Belajar tanpa gangguan iklan
        </h1>
        <p className="mt-3 text-white/50">
          Upgrade sekali, nikmati akses tanpa iklan dan fitur bookmark selama
          persiapan CPNS kamu.
        </p>
      </div>

      {isPremium ? (
        <div className="animate-rise-in mx-auto mt-10 max-w-md rounded-2xl border border-gilt-400/30 bg-gilt-400/10 p-6 text-center">
          <p className="flex items-center justify-center gap-2 text-gilt-300">
            <Check size={18} /> Kamu sudah Premium
          </p>
          <Link
            href="/akun"
            className="focus-ring mt-3 inline-block text-sm text-white/60 hover:underline"
          >
            Lihat akun saya
          </Link>
        </div>
      ) : (
        <>
          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`focus-ring animate-rise-in rounded-2xl border p-6 text-left transition ${
                  selectedPlan === plan.id
                    ? "border-gilt-400/60 bg-gilt-400/10"
                    : "border-white/[0.08] bg-ink-850/60 hover:border-white/[0.16]"
                }`}
              >
                {plan.highlight && (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-gilt-400/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gilt-300">
                    <Zap size={10} /> Paling hemat
                  </span>
                )}
                <p className="text-sm text-white/50">{plan.label}</p>
                <p className="mt-1 font-display text-2xl text-white">
                  {plan.price}{" "}
                  <span className="text-sm font-normal text-white/40">
                    {plan.period}
                  </span>
                </p>
                <p className="mt-2 text-xs text-white/40">{plan.tagline}</p>
              </button>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/[0.08] bg-ink-850/60 p-6">
            <ul className="flex flex-col gap-2.5 text-sm text-white/70">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 shrink-0 text-gilt-400" />
                  {perk}
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <p className="mb-2 text-xs uppercase tracking-[0.15em] text-white/35">
                Metode Pembayaran
              </p>
              {loadingChannels ? (
                <p className="text-xs text-white/30">Memuat metode pembayaran...</p>
              ) : channels.length === 0 ? (
                <p className="rounded-lg border border-dashed border-white/10 px-3 py-2.5 text-xs text-white/30">
                  Metode pembayaran belum tersedia — pastikan kredensial
                  Tripay sudah dikonfigurasi di server.
                </p>
              ) : (
                <select
                  value={selectedMethod ?? ""}
                  onChange={(e) => setSelectedMethod(e.target.value || null)}
                  className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white"
                >
                  <option value="" disabled>
                    Pilih metode pembayaran
                  </option>
                  {channels.map((c) => (
                    <option key={c.code} value={c.code} className="bg-ink-850">
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {notice && (
              <p className="mt-4 rounded-lg border border-aurora-rose/30 bg-aurora-rose/10 px-3 py-2 text-sm text-aurora-rose">
                {notice}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="focus-ring mt-5 w-full rounded-lg bg-gradient-to-r from-gilt-400 to-gilt-500 py-2.5 font-medium text-ink-950 transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Upgrade Sekarang"}
            </button>
          </div>
        </>
      )}

      <div className="mt-10 text-center">
        <Link href="/" className="focus-ring text-xs text-white/30 hover:text-white/60">
          &larr; Kembali ke landing page
        </Link>
      </div>
    </main>
  );
}

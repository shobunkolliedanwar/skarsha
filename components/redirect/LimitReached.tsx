import Link from "next/link";
import { Crown, Lock } from "lucide-react";

export function LimitReached() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-5 overflow-hidden bg-ink-900 px-6 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/3 h-[380px] w-[380px] rounded-full bg-aurora-violet/20 blur-[110px] animate-aurora-drift" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="animate-rise-in w-full max-w-md rounded-2xl border border-white/[0.08] bg-ink-850/80 p-8 backdrop-blur">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
          <Lock size={20} className="text-white/50" />
        </span>
        <h1 className="font-display text-xl text-white">
          Jatah link gratis kamu udah habis
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Akun gratis cuma bisa buka link sampai 3 kali. Upgrade ke Premium
          buat akses tanpa batas dan tanpa iklan.
        </p>

        <Link
          href="/premium"
          className="focus-ring mt-6 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gilt-400 to-gilt-500 py-2.5 font-medium text-ink-950 transition hover:opacity-90"
        >
          <Crown size={16} />
          Upgrade ke Premium
        </Link>

        <Link
          href="/"
          className="focus-ring mt-4 block text-xs text-white/30 transition hover:text-white/60"
        >
          &larr; Kembali ke landing page
        </Link>
      </div>
    </main>
  );
}

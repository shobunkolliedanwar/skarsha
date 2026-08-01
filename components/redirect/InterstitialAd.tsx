"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Crown } from "lucide-react";
import { AdSlot } from "./AdSlot";

const COUNTDOWN_SECONDS = 5;

export function InterstitialAd({
  targetUrl,
  linkName,
  remainingOpens,
}: {
  targetUrl: string;
  linkName: string;
  remainingOpens?: number;
}) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) {
      window.location.href = targetUrl;
    }
  }, [secondsLeft, targetUrl]);

  const targetHost = (() => {
    try {
      return new URL(targetUrl).hostname.replace(/^www\./, "");
    } catch {
      return targetUrl;
    }
  })();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-ink-900 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/3 h-[380px] w-[380px] rounded-full bg-aurora-violet/20 blur-[110px] animate-aurora-drift" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="animate-rise-in w-full max-w-md rounded-2xl border border-white/[0.08] bg-ink-850/80 p-6 text-center backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-white/35">
          Mengalihkan ke
        </p>
        <p className="mt-1 truncate font-display text-lg text-white">
          {linkName}
        </p>
        <p className="truncate text-xs text-white/40">{targetHost}</p>
      </div>

      <AdSlot />

      {typeof remainingOpens === "number" && (
        <p className="text-xs text-white/35">
          Sisa <span className="text-gilt-400">{remainingOpens}</span> kali buka
          link gratis
        </p>
      )}

      {secondsLeft > 0 ? (
        <p className="text-sm text-white/50">
          Lanjut otomatis dalam{" "}
          <span className="font-medium text-gilt-400">{secondsLeft}</span> detik...
        </p>
      ) : (
        <a
          href={targetUrl}
          className="focus-ring flex items-center gap-2 rounded-lg bg-gradient-to-r from-gilt-400 to-gilt-500 px-5 py-2.5 font-medium text-ink-950 transition hover:opacity-90"
        >
          Lanjutkan Sekarang
          <ArrowRight size={16} />
        </a>
      )}

      <a
        href="/daftar"
        className="focus-ring flex items-center gap-1.5 text-xs text-white/35 transition hover:text-gilt-400"
      >
        <Crown size={13} />
        Malas nunggu iklan? Upgrade ke Premium
      </a>
    </main>
  );
}

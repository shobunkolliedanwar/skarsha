"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, User } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });
      const body = await res.json();

      if (!res.ok) {
        setError(body.error ?? "Gagal mendaftar");
        return;
      }

      router.push(searchParams.get("next") || "/akun");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-900 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/3 h-[380px] w-[380px] rounded-full bg-aurora-violet/20 blur-[110px] animate-aurora-drift" />
        <div className="absolute bottom-[-120px] right-[10%] h-[340px] w-[340px] rounded-full bg-gilt-500/15 blur-[110px] animate-aurora-drift [animation-delay:4s]" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="animate-rise-in w-full max-w-sm rounded-2xl border border-white/[0.08] bg-ink-850/80 p-8 backdrop-blur">
        <div className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="SKARSHA"
            width={44}
            height={44}
            className="mx-auto mb-3 rounded-xl"
          />
          <p className="font-display text-2xl text-white">
            <span className="gilt-text">SKARSHA</span>
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">
            Buat Akun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-white/60">
            Nama Lengkap
            <span className="focus-ring flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <User size={16} className="text-white/30" />
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-white placeholder:text-white/25"
                placeholder="Nama kamu"
              />
            </span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-white/60">
            Email
            <span className="focus-ring flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <Mail size={16} className="text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-white placeholder:text-white/25"
                placeholder="kamu@email.com"
              />
            </span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-white/60">
            Password
            <span className="focus-ring flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <Lock size={16} className="text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-transparent text-white placeholder:text-white/25"
                placeholder="Minimal 8 karakter"
              />
            </span>
          </label>

          {error && (
            <p className="rounded-lg border border-aurora-rose/30 bg-aurora-rose/10 px-3 py-2 text-sm text-aurora-rose">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-2 rounded-lg bg-gradient-to-r from-gilt-400 to-gilt-500 py-2.5 font-medium text-ink-950 transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          Sudah punya akun?{" "}
          <a href="/masuk" className="focus-ring text-gilt-400 hover:underline">
            Masuk
          </a>
        </p>

        <a
          href="/"
          className="focus-ring mt-4 block text-center text-xs text-white/30 transition hover:text-white/60"
        >
          &larr; Kembali ke landing page
        </a>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

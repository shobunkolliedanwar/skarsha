"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, User as UserIcon } from "lucide-react";
import { resolveIcon } from "@/lib/icon-map";
import type { Category } from "@/lib/types";

const STATIC_LINKS = [
  { href: "/jelajahi", label: "Sub Kategori" },
  { href: "/blog", label: "Blog" },
  { href: "/kontak", label: "Kontak" },
];

type SessionUser = { full_name: string | null; email: string } | null;

export function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SessionUser>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((body) => setCategories(body.data ?? []))
      .catch(() => {});

    fetch("/api/user/me")
      .then((res) => res.json())
      .then((body) => setUser(body.user ?? null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-900/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl tracking-tight text-white">
          <Image src="/logo.png" alt="SKARSHA" width={30} height={30} className="rounded-lg" />
          <span className="gilt-text">SKARSHA</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="focus-ring rounded-lg px-3 py-2 text-sm text-white/60 transition hover:text-white"
          >
            Beranda
          </Link>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="focus-ring flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-white/60 transition hover:text-white"
            >
              Kategori
              <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="animate-rise-in absolute left-0 top-full mt-2 w-56 rounded-xl border border-white/[0.08] bg-ink-850 p-2 shadow-2xl">
                {categories.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-white/30">Belum ada kategori</p>
                ) : (
                  categories.map((c) => {
                    const Icon = resolveIcon(c.icon);
                    return (
                      <a
                        key={c.id}
                        href={`/#kategori-${c.slug}`}
                        onClick={() => setDropdownOpen(false)}
                        className="focus-ring flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/[0.05] hover:text-white"
                      >
                        <Icon size={15} style={{ color: c.accent_color ?? "#C9A24C" }} />
                        {c.name}
                      </a>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {STATIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded-lg px-3 py-2 text-sm text-white/60 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-2 flex items-center gap-2 border-l border-white/[0.08] pl-3">
            {user ? (
              <Link
                href="/akun"
                className="focus-ring flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:text-white"
              >
                <UserIcon size={15} />
                {user.full_name || "Akun"}
              </Link>
            ) : (
              <>
                <Link
                  href="/masuk"
                  className="focus-ring rounded-lg px-3 py-2 text-sm text-white/60 transition hover:text-white"
                >
                  Masuk
                </Link>
                <Link
                  href="/daftar"
                  className="focus-ring rounded-lg bg-gradient-to-r from-gilt-400 to-gilt-500 px-3.5 py-2 text-sm font-medium text-ink-950 transition hover:opacity-90"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </nav>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="focus-ring rounded-lg p-2 text-white/70 md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/[0.06] px-6 py-4 md:hidden">
          <Link href="/" className="rounded-lg px-3 py-2 text-sm text-white/70" onClick={() => setMobileOpen(false)}>
            Beranda
          </Link>
          <p className="px-3 pt-2 text-[11px] uppercase tracking-wide text-white/30">Kategori</p>
          {categories.map((c) => (
            <a
              key={c.id}
              href={`/#kategori-${c.slug}`}
              className="rounded-lg px-3 py-2 text-sm text-white/70"
              onClick={() => setMobileOpen(false)}
            >
              {c.name}
            </a>
          ))}
          <div className="my-2 h-px bg-white/[0.06]" />
          {STATIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-white/70"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-white/[0.06]" />
          {user ? (
            <Link
              href="/akun"
              className="rounded-lg px-3 py-2 text-sm text-white/70"
              onClick={() => setMobileOpen(false)}
            >
              Akun Saya
            </Link>
          ) : (
            <>
              <Link
                href="/masuk"
                className="rounded-lg px-3 py-2 text-sm text-white/70"
                onClick={() => setMobileOpen(false)}
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gilt-400"
                onClick={() => setMobileOpen(false)}
              >
                Daftar Akun
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

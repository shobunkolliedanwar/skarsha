"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderTree, Link2, LogOut, ExternalLink, Newspaper, Mail, Settings } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Kategori", icon: FolderTree },
  { href: "/admin/links", label: "Sub Kategori", icon: Link2 },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/messages", label: "Pesan Masuk", icon: Mail },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/[0.06] bg-ink-850 px-4 py-6">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <Image src="/logo.png" alt="SKARSHA" width={28} height={28} className="rounded-lg" />
        <div>
          <p className="font-display text-xl text-white">
            <span className="gilt-text">SKARSHA</span>
          </p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/30">
            CMS Admin
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-gilt-500/15 text-gilt-300"
                  : "text-white/55 hover:bg-white/[0.04] hover:text-white/85"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-white/[0.06] pt-4">
        <a
          href="/"
          target="_blank"
          className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/55 transition hover:bg-white/[0.04] hover:text-white/85"
        >
          <ExternalLink size={17} />
          Lihat landing page
        </a>
        <button
          onClick={handleLogout}
          className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/55 transition hover:bg-aurora-rose/10 hover:text-aurora-rose"
        >
          <LogOut size={17} />
          Keluar
        </button>
      </div>
    </aside>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PortalLink } from "@/components/landing/PortalLink";
import { BannerAd } from "@/components/redirect/BannerAd";
import { resolveIcon } from "@/lib/icon-map";
import type { Category, LinkItem } from "@/lib/types";

export default function JelajahiPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/links").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([linksBody, categoriesBody]) => {
      setLinks((linksBody.data ?? []).filter((l: LinkItem) => l.is_active));
      setCategories(categoriesBody.data ?? []);
      setLoading(false);
    });
  }, []);

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );

  const filtered = links.filter((link) => {
    const matchesQuery =
      query.trim() === "" ||
      link.name.toLowerCase().includes(query.toLowerCase()) ||
      (link.description ?? "").toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === "all" || link.category_id === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-ink-900">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 pb-20 pt-14">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gilt-300">Jelajahi</p>
          <h1 className="mt-3 font-display text-4xl text-white">Semua Sub Kategori</h1>
          <p className="mt-3 text-white/50">
            Cari dan telusuri seluruh portal di dalam SKARSHA dalam satu tampilan.
          </p>
        </div>

        <div className="mb-6">
          <span className="focus-ring flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <Search size={16} className="text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari sub kategori..."
              className="w-full bg-transparent text-white placeholder:text-white/25"
            />
          </span>
        </div>

        <div className="-mx-6 mb-8 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveCategory("all")}
            className={`focus-ring shrink-0 rounded-full px-3.5 py-1.5 text-sm transition ${
              activeCategory === "all"
                ? "bg-gilt-400 text-ink-950 font-medium"
                : "border border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
            }`}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`focus-ring shrink-0 rounded-full px-3.5 py-1.5 text-sm transition ${
                activeCategory === c.id
                  ? "bg-gilt-400 text-ink-950 font-medium"
                  : "border border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="-mx-6">
          <BannerAd />
        </div>

        {loading ? (
          <p className="py-16 text-center text-sm text-white/30">Memuat...</p>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-white/30">
            Tidak ada sub kategori yang cocok.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((link) => {
              const category = categoryMap[link.category_id];
              const CategoryIcon = resolveIcon(category?.icon);
              return (
                <div key={link.id} className="flex flex-col gap-1.5">
                  {category && (
                    <span className="flex items-center gap-1.5 px-1 text-[11px] uppercase tracking-wide text-white/30">
                      <CategoryIcon size={12} />
                      {category.name}
                    </span>
                  )}
                  <PortalLink link={link} accent={category?.accent_color ?? "#C9A24C"} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

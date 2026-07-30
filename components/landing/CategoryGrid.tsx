import { CategoryCard } from "./CategoryCard";
import type { CategoryWithLinks } from "@/lib/types";

export function CategoryGrid({ categories }: { categories: CategoryWithLinks[] }) {
  if (categories.length === 0) {
    return (
      <div id="materi" className="mx-auto max-w-lg scroll-mt-24 rounded-2xl border border-dashed border-white/10 p-10 text-center text-white/40">
        Belum ada kategori. Masuk ke dashboard admin untuk menambahkan
        kategori pertama.
      </div>
    );
  }

  return (
    <section id="materi" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 pb-16">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gilt-300">Materi & Tryout</p>
        <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
          Semua yang kamu butuhkan untuk lolos CPNS
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, i) => (
          <CategoryCard key={category.id} category={category} index={i} />
        ))}
      </div>
    </section>
  );
}

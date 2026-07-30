import { resolveIcon } from "@/lib/icon-map";
import { PortalLink } from "./PortalLink";
import type { CategoryWithLinks } from "@/lib/types";

export function CategoryCard({ category, index }: { category: CategoryWithLinks; index: number }) {
  const Icon = resolveIcon(category.icon);
  const accent = category.accent_color ?? "#C9A24C";

  return (
    <div
      id={`kategori-${category.slug}`}
      className="portal-card animate-rise-in flex scroll-mt-24 flex-col gap-5 p-6 sm:p-7"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-center gap-4">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: `${accent}1F`,
            color: accent,
            boxShadow: `0 0 24px -6px ${accent}66`,
          }}
        >
          <Icon size={22} strokeWidth={2} />
        </span>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
            SKARSHA
          </p>
          <h3 className="font-display text-xl text-white">{category.name}</h3>
        </div>
      </div>

      {category.description && (
        <p className="text-sm leading-relaxed text-white/50">
          {category.description}
        </p>
      )}

      {category.links.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {category.links.map((link) => (
            <PortalLink key={link.id} link={link} accent={accent} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-center text-xs text-white/30">
          Belum ada sub kategori di sini
        </p>
      )}
    </div>
  );
}

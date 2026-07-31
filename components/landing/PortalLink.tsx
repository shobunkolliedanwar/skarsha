"use client";

import { ArrowUpRight, Bookmark } from "lucide-react";
import { resolveIcon } from "@/lib/icon-map";
import { useBookmarks } from "@/lib/bookmark-context";
import type { LinkItem } from "@/lib/types";

export function PortalLink({ link, accent }: { link: LinkItem; accent: string }) {
  const Icon = resolveIcon(link.icon);
  const { isLoggedIn, isPremium, bookmarkedIds, toggleBookmark } = useBookmarks();
  const isBookmarked = bookmarkedIds.has(link.id);

  async function handleBookmarkClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      window.location.href = "/masuk";
      return;
    }

    if (!isPremium) {
      window.alert(
        "Fitur bookmark khusus untuk pengguna Premium. Upgrade dulu yuk di halaman /premium."
      );
      return;
    }

    await toggleBookmark(link.id);
  }

  return (
    <a
      href={`/lanjut/${link.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring group relative z-10 flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.05]"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        <Icon size={17} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 font-medium text-white/90">
          {link.name}
          <ArrowUpRight
            size={14}
            className="shrink-0 text-white/30 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/70"
          />
        </span>
        {link.description && (
          <span className="mt-0.5 block truncate text-xs text-white/45">
            {link.description}
          </span>
        )}
      </span>
      <button
        onClick={handleBookmarkClick}
        aria-label={isBookmarked ? "Hapus bookmark" : "Simpan bookmark"}
        className="focus-ring shrink-0 rounded-lg p-1.5 text-white/25 transition hover:bg-white/[0.06] hover:text-gilt-400"
      >
        <Bookmark
          size={15}
          fill={isBookmarked ? "currentColor" : "none"}
          className={isBookmarked ? "text-gilt-400" : ""}
        />
      </button>
    </a>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type BookmarkContextValue = {
  isLoggedIn: boolean;
  isPremium: boolean;
  bookmarkedIds: Set<string>;
  toggleBookmark: (linkId: string) => Promise<{ error?: string; requiresPremium?: boolean }>;
  ready: boolean;
};

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/user/me")
      .then((res) => res.json())
      .then((body) => {
        if (cancelled) return;
        const user = body.user;
        setIsLoggedIn(Boolean(user));
        setIsPremium(Boolean(user?.is_premium));

        if (user?.is_premium) {
          return fetch("/api/bookmarks")
            .then((res) => res.json())
            .then((bmBody) => {
              if (cancelled) return;
              const ids = (bmBody.data ?? []).map((b: { link_id: string }) => b.link_id);
              setBookmarkedIds(new Set(ids));
            });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleBookmark = useCallback(
    async (linkId: string) => {
      const alreadyBookmarked = bookmarkedIds.has(linkId);
      const method = alreadyBookmarked ? "DELETE" : "POST";

      const res = await fetch("/api/bookmarks", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link_id: linkId }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { error: body.error, requiresPremium: body.requiresPremium };
      }

      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (alreadyBookmarked) next.delete(linkId);
        else next.add(linkId);
        return next;
      });

      return {};
    },
    [bookmarkedIds]
  );

  const value = useMemo(
    () => ({ isLoggedIn, isPremium, bookmarkedIds, toggleBookmark, ready }),
    [isLoggedIn, isPremium, bookmarkedIds, toggleBookmark, ready]
  );

  return (
    <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) {
    throw new Error("useBookmarks harus dipakai di dalam BookmarkProvider");
  }
  return ctx;
}

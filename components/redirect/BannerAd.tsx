"use client";

import { useEffect, useState } from "react";
import { AdSlot } from "./AdSlot";

/**
 * Banner iklan yang otomatis sembunyi untuk user premium.
 * Dipakai di halaman publik (landing, jelajahi, dll) - cukup taruh
 * <BannerAd /> di mana pun, tidak perlu passing status premium manual.
 */
export function BannerAd() {
  const [isPremium, setIsPremium] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((body) => setIsPremium(Boolean(body.user?.is_premium)))
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  if (!checked || isPremium) return null;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-6">
      <AdSlot label="Ruang Iklan Banner" />
    </div>
  );
}

/**
 * Slot iklan generik. Isi HTML/script dari ad network (Adsterra, PropellerAds,
 * AdSense, dll) ditaruh di env var NEXT_PUBLIC_AD_SLOT_INTERSTITIAL.
 * Kalau belum di-set, tampil placeholder biar layout tetap kelihatan pas dev.
 *
 * Cara ganti network nanti: tinggal isi env var itu dengan snippet embed
 * dari network yang kamu pakai, tanpa perlu ubah kode lagi.
 */
export function AdSlot({ label = "Ruang Iklan" }: { label?: string }) {
  const adSnippet = process.env.NEXT_PUBLIC_AD_SLOT_INTERSTITIAL;

  if (adSnippet) {
    return (
      <div
        className="mx-auto w-full max-w-md overflow-hidden rounded-xl"
        dangerouslySetInnerHTML={{ __html: adSnippet }}
      />
    );
  }

  return (
    <div className="mx-auto flex h-[250px] w-full max-w-md items-center justify-center rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] text-xs text-white/25">
      {label}
    </div>
  );
}

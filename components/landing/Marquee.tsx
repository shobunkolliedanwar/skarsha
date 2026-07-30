const ITEMS = [
  "Materi TWK Lengkap",
  "Bank Soal TIU 5000+",
  "Simulasi TKP Terbaru",
  "Tryout SKD Real-time",
  "Pembahasan Tryout SKB",
  "Update Kisi-Kisi & Formasi",
];

export function Marquee() {
  const track = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee-mask overflow-hidden border-y border-white/[0.06] bg-white/[0.02] py-3.5">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-sm text-white/45">
            <span className="h-1 w-1 rounded-full bg-gilt-400" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

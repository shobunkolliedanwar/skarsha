const TESTIMONIALS = [
  {
    name: "Rina A.",
    role: "Peserta CPNS 2026",
    quote:
      "Materi TWK-nya runtut banget, jadi gampang dihafal. Tryout SKD-nya juga bikin lebih siap hadapi waktu ujian asli.",
  },
  {
    name: "Bagus P.",
    role: "Peserta CPNS 2026",
    quote:
      "Suka bagian TKP karena pembahasannya jelas kenapa satu jawaban lebih tepat dari yang lain, bukan cuma kunci jawaban doang.",
  },
  {
    name: "Dewi S.",
    role: "Peserta CPNS 2025",
    quote:
      "Update kisi-kisi dan formasi di blog-nya membantu banget buat nentuin strategi belajar tiap minggu.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gilt-300">Cerita Peserta</p>
        <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
          Dipercaya calon ASN dari berbagai daerah
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={t.name}
            className="portal-card animate-rise-in flex flex-col gap-4 p-6"
            style={{ animationDelay: `${i * 110}ms` }}
          >
            <p className="text-sm leading-relaxed text-white/60">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gilt-500/15 text-xs font-medium text-gilt-300">
                {initials(t.name)}
              </span>
              <div>
                <p className="text-sm text-white/85">{t.name}</p>
                <p className="text-xs text-white/35">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-white/25">
        *Nama disamarkan, kutipan bersifat ilustratif.
      </p>
    </section>
  );
}

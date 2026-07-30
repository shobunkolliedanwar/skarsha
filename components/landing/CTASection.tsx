export function CTASection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div className="portal-card relative overflow-hidden px-8 py-14 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-gilt-500/20 blur-[100px] animate-aurora-drift" />
        </div>

        <p className="text-xs uppercase tracking-[0.2em] text-gilt-300">Siap Mulai?</p>
        <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
          Jadikan SKARSHA teman belajar CPNS-mu
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
          Jelajahi materi, ikuti tryout, dan pantau update kisi-kisi terbaru —
          semua dalam satu portal.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/jelajahi"
            className="focus-ring rounded-full bg-gradient-to-r from-gilt-400 to-gilt-500 px-7 py-3 text-sm font-medium text-ink-950 transition hover:opacity-90"
          >
            Jelajahi Sub Kategori
          </a>
          <a
            href="/kontak"
            className="focus-ring rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Hubungi Kami
          </a>
        </div>
      </div>
    </section>
  );
}

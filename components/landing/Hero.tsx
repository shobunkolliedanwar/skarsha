const FLOATING_BADGES = [
  { label: "TWK", top: "8%", left: "6%", delay: "0s", tilt: "-8deg" },
  { label: "TIU", top: "18%", left: "82%", delay: "1.2s", tilt: "6deg" },
  { label: "TKP", top: "68%", left: "4%", delay: "2.4s", tilt: "5deg" },
  { label: "SKD", top: "72%", left: "86%", delay: "0.6s", tilt: "-6deg" },
  { label: "SKB", top: "4%", left: "46%", delay: "1.8s", tilt: "3deg" },
];

export function Hero({ totalCategories, totalLinks }: { totalCategories: number; totalLinks: number }) {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-16 sm:pt-24">
      {/* Aurora blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-aurora-violet/25 blur-[110px] animate-aurora-drift" />
        <div className="absolute top-10 right-[8%] h-[360px] w-[360px] rounded-full bg-aurora-rose/20 blur-[110px] animate-aurora-drift [animation-delay:3s]" />
        <div className="absolute bottom-[-140px] left-[10%] h-[380px] w-[380px] rounded-full bg-aurora-teal/20 blur-[110px] animate-aurora-drift [animation-delay:6s]" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      {/* Floating exam-type badges */}
      <div className="pointer-events-none absolute inset-0 -z-[5] hidden sm:block">
        {FLOATING_BADGES.map((badge) => (
          <span
            key={badge.label}
            className="absolute animate-float rounded-full border border-gilt-400/25 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium tracking-wide text-gilt-300 backdrop-blur-sm"
            style={{
              top: badge.top,
              left: badge.left,
              animationDelay: badge.delay,
              // @ts-expect-error custom property used by the float keyframe
              "--tilt": badge.tilt,
            }}
          >
            {badge.label}
          </span>
        ))}
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center animate-rise-in">
        <div className="mb-8 flex items-center gap-3 rounded-full border border-gilt-400/25 bg-white/[0.03] px-4 py-1.5 text-xs tracking-[0.2em] text-gilt-300">
          <span className="h-1.5 w-1.5 rounded-full bg-gilt-400 animate-pulse-glow" />
          PORTAL PERSIAPAN CPNS #1
        </div>

        <h1 className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-7xl">
          Lolos CPNS Dimulai dari{" "}
          <span className="gilt-text">SKARSHA</span>
        </h1>

        <p className="mt-6 max-w-xl text-balance text-base text-white/60 sm:text-lg">
          Materi TWK, TIU, TKP, tryout SKD & SKB, sampai info kisi-kisi dan
          formasi terbaru — semua persiapan CPNS-mu terkumpul rapi dalam satu
          portal.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#materi"
            className="focus-ring rounded-full bg-gradient-to-r from-gilt-400 to-gilt-500 px-7 py-3 text-sm font-medium text-ink-950 transition hover:opacity-90"
          >
            Mulai Belajar Sekarang
          </a>
          <a
            href="/blog"
            className="focus-ring rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Baca Tips & Update CPNS
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl text-white">{totalCategories}</span>
            Kategori materi
          </div>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl text-white">{totalLinks}</span>
            Tryout &amp; sumber belajar
          </div>
        </div>

        <div className="mt-4 h-px w-40 shimmer-line animate-shimmer" />
      </div>
    </section>
  );
}

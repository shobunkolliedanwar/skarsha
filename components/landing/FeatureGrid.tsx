import { Target, LineChart, BellRing, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    title: "Materi Terarah",
    desc: "TWK, TIU, dan TKP disusun rapi per topik supaya belajar lebih fokus dan efisien.",
    accent: "#C9A24C",
  },
  {
    icon: LineChart,
    title: "Tryout Realistis",
    desc: "Simulasi SKD & SKB mendekati format ujian asli, lengkap dengan pembahasan.",
    accent: "#7C6CF6",
  },
  {
    icon: BellRing,
    title: "Update Terkini",
    desc: "Info kisi-kisi, jadwal, dan formasi CPNS selalu diperbarui lewat Blog.",
    accent: "#3FCFB4",
  },
  {
    icon: Users,
    title: "Komunitas Peserta",
    desc: "Terhubung dengan sesama pejuang CPNS lewat kanal kontak & sosial media kami.",
    accent: "#F4667C",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gilt-300">Kenapa SKARSHA</p>
        <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
          Satu portal, persiapan lebih matang
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="portal-card animate-rise-in flex flex-col gap-3 p-6"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${f.accent}22`, color: f.accent }}
            >
              <f.icon size={20} />
            </span>
            <h3 className="font-display text-lg text-white">{f.title}</h3>
            <p className="text-sm leading-relaxed text-white/50">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

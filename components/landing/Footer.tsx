import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-white/30 sm:flex-row">
        <p className="flex items-center gap-2 font-display text-sm tracking-wide text-white/50">
          <Image src="/logo.png" alt="SKARSHA" width={20} height={20} className="rounded-md" />
          SKARSHA
        </p>
        <p>&copy; {new Date().getFullYear()} SKARSHA. Portal persiapan CPNS-mu.</p>
        <a href="/login" className="focus-ring text-white/25 transition hover:text-white/60">
          Admin
        </a>
      </div>
    </footer>
  );
}

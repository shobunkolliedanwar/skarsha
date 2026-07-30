import { Crown, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/get-current-user";
import { LogoutButton } from "@/components/akun/LogoutButton";

export const revalidate = 0;

export default async function AkunPage() {
  const user = await getCurrentUser();

  // Middleware sudah menjamin ini tidak null untuk path /akun, tapi tetap
  // dijaga di sini untuk keamanan tipe.
  if (!user) {
    return null;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-900 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/3 h-[380px] w-[380px] rounded-full bg-aurora-violet/20 blur-[110px] animate-aurora-drift" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="animate-rise-in mx-auto w-full max-w-lg rounded-2xl border border-white/[0.08] bg-ink-850/80 p-8 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <UserIcon size={20} className="text-white/60" />
          </span>
          <div>
            <p className="text-lg text-white">{user.full_name || "Pengguna SKARSHA"}</p>
            <p className="text-sm text-white/40">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
          <div className="flex items-center gap-2">
            <Crown size={16} className={user.is_premium ? "text-gilt-400" : "text-white/30"} />
            <span className="text-sm text-white/70">
              {user.is_premium ? "Akun Premium" : "Akun Gratis"}
            </span>
          </div>
          {!user.is_premium && (
            <Link
              href="/premium"
              className="focus-ring rounded-lg bg-gradient-to-r from-gilt-400 to-gilt-500 px-3 py-1.5 text-xs font-medium text-ink-950 transition hover:opacity-90"
            >
              Upgrade
            </Link>
          )}
        </div>

        {user.is_premium && user.premium_plan === "monthly" && user.premium_expires_at && (
          <p className="mt-3 text-xs text-white/40">
            Berlaku hingga{" "}
            {new Date(user.premium_expires_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        <p className="mt-6 text-xs text-white/30">
          Fitur bookmark, riwayat, dan notifikasi akan muncul di sini pada tahap
          berikutnya.
        </p>

        <LogoutButton />
      </div>
    </main>
  );
}

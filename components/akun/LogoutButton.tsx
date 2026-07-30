"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/user/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="focus-ring mt-6 flex items-center gap-2 text-xs text-white/40 transition hover:text-white/70"
    >
      <LogOut size={14} />
      Keluar
    </button>
  );
}

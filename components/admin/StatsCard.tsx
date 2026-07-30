import type { LucideIcon } from "lucide-react";

export function StatsCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <div className="admin-card flex items-center gap-4 p-5">
      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xs text-white/40">{label}</p>
        <p className="font-display text-2xl text-white">{value}</p>
      </div>
    </div>
  );
}

import { FolderTree, Link2, MousePointerClick, TrendingUp } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import { StatsCard } from "@/components/admin/StatsCard";

export const revalidate = 0;

async function getDashboardData() {
  const supabase = supabaseServer();

  const [{ count: categoryCount }, { data: links }] = await Promise.all([
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase
      .from("links")
      .select("id, name, click_count, category_id, categories(name)")
      .order("click_count", { ascending: false })
      .limit(8),
  ]);

  const totalClicks = (links ?? []).reduce((sum, l) => sum + (l.click_count ?? 0), 0);
  const { count: linkCount } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true });

  return {
    categoryCount: categoryCount ?? 0,
    linkCount: linkCount ?? 0,
    totalClicks,
    topLinks: links ?? [],
  };
}

export default async function AdminDashboardPage() {
  const { categoryCount, linkCount, totalClicks, topLinks } = await getDashboardData();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-white">Ringkasan</h1>
        <p className="mt-1 text-sm text-white/40">
          Pantau performa seluruh portal SKARSHA dari satu tempat.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard label="Total Kategori" value={categoryCount} icon={FolderTree} accent="#C9A24C" />
        <StatsCard label="Total Sub Kategori" value={linkCount} icon={Link2} accent="#7C6CF6" />
        <StatsCard label="Total Klik" value={totalClicks} icon={MousePointerClick} accent="#3FCFB4" />
      </div>

      <div className="admin-card p-6">
        <div className="mb-4 flex items-center gap-2 text-white/80">
          <TrendingUp size={18} className="text-gilt-400" />
          <h2 className="font-display text-lg">Sub Kategori Terpopuler</h2>
        </div>

        {topLinks.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/30">
            Belum ada data klik.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {topLinks.map((link: any, i: number) => (
              <div key={link.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-sm text-white/25">{i + 1}</span>
                  <div>
                    <p className="text-sm text-white/85">{link.name}</p>
                    <p className="text-xs text-white/35">{link.categories?.name}</p>
                  </div>
                </div>
                <span className="font-display text-lg text-gilt-300">
                  {link.click_count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

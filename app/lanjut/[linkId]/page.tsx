import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/get-current-user";
import { logLinkClick } from "@/lib/click-log";
import { InterstitialAd } from "@/components/redirect/InterstitialAd";

export const revalidate = 0;

export default async function LanjutPage({
  params,
}: {
  params: { linkId: string };
}) {
  const supabase = supabaseServer();

  const { data: link, error } = await supabase
    .from("links")
    .select("id, name, url, is_active")
    .eq("id", params.linkId)
    .maybeSingle();

  if (error || !link || !link.is_active) {
    redirect("/");
  }

  await logLinkClick(link.id);

  const user = await getCurrentUser();

  if (user?.is_premium) {
    // Premium: skip iklan, langsung redirect.
    redirect(link.url);
  }

  return <InterstitialAd targetUrl={link.url} linkName={link.name} />;
}

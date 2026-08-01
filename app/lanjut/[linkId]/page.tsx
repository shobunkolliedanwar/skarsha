import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/get-current-user";
import { logLinkClick } from "@/lib/click-log";
import { FREE_LINK_LIMIT } from "@/lib/premium";
import { InterstitialAd } from "@/components/redirect/InterstitialAd";
import { LimitReached } from "@/components/redirect/LimitReached";

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

  // Wajib login buat buka link mana pun.
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/masuk?next=/lanjut/${link.id}`);
  }

  if (user.is_premium) {
    // Premium: skip iklan & skip pembatasan, langsung redirect.
    await logLinkClick(link.id);
    redirect(link.url);
  }

  // User gratis: cek jatah buka link.
  if (user.free_link_opens >= FREE_LINK_LIMIT) {
    return <LimitReached />;
  }

  await logLinkClick(link.id);
  await supabase
    .from("users")
    .update({ free_link_opens: user.free_link_opens + 1 })
    .eq("id", user.id);

  const remainingOpens = FREE_LINK_LIMIT - (user.free_link_opens + 1);

  return (
    <InterstitialAd
      targetUrl={link.url}
      linkName={link.name}
      remainingOpens={remainingOpens}
    />
  );
}

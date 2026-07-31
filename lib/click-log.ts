import { headers } from "next/headers";
import { supabaseServer } from "./supabase/server";

export async function logLinkClick(linkId: string) {
  const supabase = supabaseServer();
  const headerList = headers();

  await Promise.allSettled([
    supabase.rpc("increment_link_click", { target_link_id: linkId }),
    supabase.from("click_logs").insert({
      link_id: linkId,
      user_agent: headerList.get("user-agent") ?? undefined,
      referrer: headerList.get("referer") ?? undefined,
    }),
  ]);
}

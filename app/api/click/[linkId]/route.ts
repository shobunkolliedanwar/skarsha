import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { linkId: string } }
) {
  const supabase = supabaseServer();

  const { data: link, error } = await supabase
    .from("links")
    .select("id, url, is_active")
    .eq("id", params.linkId)
    .maybeSingle();

  if (error || !link || !link.is_active) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Increment atomik + catat log, tanpa memblokir redirect terlalu lama
  await Promise.allSettled([
    supabase.rpc("increment_link_click", { target_link_id: link.id }),
    supabase.from("click_logs").insert({
      link_id: link.id,
      user_agent: request.headers.get("user-agent") ?? undefined,
      referrer: request.headers.get("referer") ?? undefined,
    }),
  ]);

  return NextResponse.redirect(link.url);
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { logLinkClick } from "@/lib/click-log";

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

  await logLinkClick(link.id);

  return NextResponse.redirect(link.url);
}

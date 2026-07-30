import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const revalidate = 0;

async function getPost(slug: string) {
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data;
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-ink-900">
      <Navbar />

      <article className="mx-auto max-w-2xl px-6 pb-24 pt-14">
        <span className="flex items-center gap-1.5 text-xs text-white/35">
          <CalendarDays size={13} />
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""}
        </span>
        <h1 className="mt-3 font-display text-4xl text-white">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg text-white/50">{post.excerpt}</p>}

        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="mt-8 w-full rounded-2xl border border-white/[0.06]"
          />
        )}

        <div className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap text-white/70">
          {post.content}
        </div>
      </article>

      <Footer />
    </main>
  );
}

import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import type { BlogPost } from "@/lib/types";

export const revalidate = 0;

async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-ink-900">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 pb-20 pt-14">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gilt-300">Blog</p>
          <h1 className="mt-3 font-display text-4xl text-white">Cerita dari SKARSHA</h1>
          <p className="mt-3 text-white/50">
            Kabar, tips, dan cerita di balik portal-portal SKARSHA.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="py-16 text-center text-sm text-white/30">
            Belum ada tulisan yang dipublikasikan.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="portal-card group flex flex-col gap-2 p-6"
              >
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
                <h2 className="flex items-center gap-1.5 font-display text-xl text-white">
                  {post.title}
                  <ArrowUpRight
                    size={16}
                    className="text-white/30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gilt-300"
                  />
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-white/50">{post.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

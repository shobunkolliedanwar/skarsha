import { supabaseServer } from "@/lib/supabase/server";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { BannerAd } from "@/components/redirect/BannerAd";
import type { CategoryWithLinks } from "@/lib/types";

export const revalidate = 0;

async function getCategoriesWithLinks(): Promise<CategoryWithLinks[]> {
  const supabase = supabaseServer();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (!categories) return [];

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return categories.map((category) => ({
    ...category,
    links: (links ?? []).filter((link) => link.category_id === category.id),
  }));
}

export default async function LandingPage() {
  const categories = await getCategoriesWithLinks();
  const totalLinks = categories.reduce((sum, c) => sum + c.links.length, 0);

  return (
    <main className="min-h-screen bg-ink-900">
      <Navbar />
      <Hero totalCategories={categories.length} totalLinks={totalLinks} />
      <Marquee />
      <BannerAd />
      <FeatureGrid />
      <CategoryGrid categories={categories} />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}

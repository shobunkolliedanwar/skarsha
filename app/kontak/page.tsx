import { Mail, Phone, MapPin, Instagram, MessageCircle } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ContactForm } from "@/components/landing/ContactForm";
import type { SiteSettings } from "@/lib/types";

export const revalidate = 0;

async function getSettings(): Promise<SiteSettings | null> {
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();
  return data;
}

export default async function KontakPage() {
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-ink-900">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 pb-24 pt-14">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gilt-300">Kontak</p>
          <h1 className="mt-3 font-display text-4xl text-white">Hubungi Kami</h1>
          <p className="mt-3 text-white/50">
            Ada pertanyaan atau ingin berkolaborasi? Kirim pesan lewat form di bawah.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="admin-card flex flex-col gap-4 p-6 md:col-span-2">
            {settings?.contact_email && (
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Mail size={16} className="text-gilt-400" />
                {settings.contact_email}
              </div>
            )}
            {settings?.contact_phone && (
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Phone size={16} className="text-gilt-400" />
                {settings.contact_phone}
              </div>
            )}
            {settings?.contact_address && (
              <div className="flex items-center gap-3 text-sm text-white/70">
                <MapPin size={16} className="text-gilt-400" />
                {settings.contact_address}
              </div>
            )}
            {settings?.whatsapp_url && (
              <a
                href={settings.whatsapp_url}
                target="_blank"
                className="focus-ring flex items-center gap-3 text-sm text-white/70 hover:text-white"
              >
                <MessageCircle size={16} className="text-gilt-400" />
                WhatsApp
              </a>
            )}
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                className="focus-ring flex items-center gap-3 text-sm text-white/70 hover:text-white"
              >
                <Instagram size={16} className="text-gilt-400" />
                Instagram
              </a>
            )}
          </div>

          <div className="admin-card p-6 md:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

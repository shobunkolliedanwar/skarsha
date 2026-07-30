import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Apa saja materi yang tersedia di SKARSHA?",
    a: "SKARSHA menghimpun materi TWK, TIU, dan TKP, tryout SKD dan SKB, serta info kisi-kisi dan formasi CPNS terbaru — semua dikelompokkan rapi per kategori.",
  },
  {
    q: "Apakah tryout di SKARSHA gratis?",
    a: "Sebagian tryout dan materi dapat diakses gratis. Ketentuan lebih lanjut mengikuti masing-masing sumber belajar yang ditautkan di setiap sub kategori.",
  },
  {
    q: "Seberapa sering materi dan kisi-kisi diperbarui?",
    a: "Tim SKARSHA rutin memperbarui info lewat halaman Blog setiap ada perubahan jadwal, kisi-kisi, atau formasi resmi.",
  },
  {
    q: "Bagaimana cara menghubungi tim SKARSHA?",
    a: "Kamu bisa mengirim pesan lewat halaman Kontak, atau melalui WhatsApp dan Instagram yang tercantum di sana.",
  },
];

export function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gilt-300">FAQ</p>
        <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
          Pertanyaan yang Sering Diajukan
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {FAQS.map((item) => (
          <details key={item.q} className="faq-item admin-card group p-5">
            <summary className="flex items-center justify-between gap-4 text-sm font-medium text-white/85">
              {item.q}
              <ChevronDown size={16} className="faq-chevron shrink-0 text-white/40 transition-transform" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-white/50">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

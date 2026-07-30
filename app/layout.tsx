import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKARSHA — Portal Persiapan CPNS",
  icons: {
    icon: "./logo.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  description:
    "SKARSHA menghimpun materi TWK, TIU, TKP, tryout SKD & SKB, serta info kisi-kisi dan formasi CPNS terbaru dalam satu portal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}

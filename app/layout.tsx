import type { Metadata } from "next";
import "./globals.css";
import { BookmarkProvider } from "@/lib/bookmark-context";

export const metadata: Metadata = {
  title: "SKARSHA — Portal Persiapan CPNS",
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
      <body className="font-body antialiased">
        <BookmarkProvider>{children}</BookmarkProvider>
      </body>
    </html>
  );
}

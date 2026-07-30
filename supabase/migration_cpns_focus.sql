-- =========================================================
-- MIGRASI: Fokus CPNS
-- Jalankan di Supabase SQL Editor jika project kamu sudah
-- pernah menjalankan schema.sql versi lama (dengan kategori
-- contoh CPNS/Music/Film).
-- =========================================================

-- 1. Tambahkan kategori & sub kategori contoh yang fokus CPNS
--    (aman dijalankan berkali-kali, tidak menimpa data yang sudah ada)
insert into categories (name, slug, description, icon, accent_color, sort_order)
values
  ('Tryout SKD', 'tryout-skd', 'Simulasi Seleksi Kompetensi Dasar (TWK, TIU, TKP)', 'graduation-cap', '#C9A24C', 1),
  ('Materi TWK', 'materi-twk', 'Tes Wawasan Kebangsaan: Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika', 'book', '#7C6CF6', 2),
  ('Materi TIU', 'materi-tiu', 'Tes Intelegensia Umum: verbal, numerik, dan figural', 'briefcase', '#3FCFB4', 3),
  ('Materi TKP', 'materi-tkp', 'Tes Karakteristik Pribadi: pelayanan publik, integritas, kerja sama', 'heart', '#F4667C', 4),
  ('Tryout SKB', 'tryout-skb', 'Simulasi Seleksi Kompetensi Bidang sesuai formasi', 'briefcase', '#F5A954', 5),
  ('Info & Kisi-Kisi', 'info-kisi-kisi', 'Update jadwal, kisi-kisi resmi, dan formasi CPNS terbaru', 'newspaper', '#A9823A', 6)
on conflict (slug) do nothing;

-- 2. OPSIONAL — hapus kategori contoh lama yang tidak relevan lagi
--    (Music, Film). Ini DESTRUKTIF: akan menghapus kategori tsb beserta
--    seluruh sub kategori di dalamnya. Uncomment baris di bawah HANYA
--    jika kamu belum mengubah/mengisi kategori itu dengan data asli.
--
-- delete from categories where slug in ('music', 'film');

-- Catatan: kategori "CPNS" (slug 'cpns') dari seed lama tetap dibiarkan
-- apa adanya — kamu bisa merapikan atau menghapusnya lewat halaman
-- /admin/categories sesuai kebutuhan.

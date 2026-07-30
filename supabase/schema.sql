-- =========================================================
-- SKARSHA — Supabase schema
-- Jalankan seluruh file ini di Supabase SQL Editor
-- =========================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- 1. ADMIN USERS (login CMS, password di-hash dengan bcrypt)
-- ---------------------------------------------------------
create table if not exists admin_users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  password_hash text not null,
  full_name text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 2. CATEGORIES (contoh: CPNS, Music, Film)
-- ---------------------------------------------------------
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  icon text default 'sparkles',
  accent_color text default '#C9A24C',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 3. LINKS / SUB KATEGORI (website di dalam sebuah kategori)
-- ---------------------------------------------------------
create table if not exists links (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  slug text not null,
  url text not null,
  description text,
  icon text default 'link',
  thumbnail_url text,
  click_count bigint not null default 0,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, slug)
);

-- ---------------------------------------------------------
-- 4. CLICK LOGS (opsional, untuk analitik lebih detail)
-- ---------------------------------------------------------
create table if not exists click_logs (
  id uuid primary key default uuid_generate_v4(),
  link_id uuid not null references links(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  user_agent text,
  referrer text
);

create index if not exists idx_links_category on links(category_id);
create index if not exists idx_click_logs_link on click_logs(link_id);

-- ---------------------------------------------------------
-- 5. Fungsi untuk increment click_count secara atomik
-- ---------------------------------------------------------
create or replace function increment_link_click(target_link_id uuid)
returns void as $$
begin
  update links set click_count = click_count + 1 where id = target_link_id;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------
-- 6. Row Level Security
-- Aplikasi mengakses tabel via service_role key di server
-- (API routes Next.js), jadi RLS diaktifkan & dikunci rapat;
-- hanya service_role yang bisa baca/tulis penuh.
-- ---------------------------------------------------------
alter table admin_users enable row level security;
alter table categories enable row level security;
alter table links enable row level security;
alter table click_logs enable row level security;

-- Publik hanya boleh SELECT kategori & link yang aktif (untuk landing page
-- bila nanti ingin fetch langsung dari client; saat ini app memakai
-- service_role di server jadi policy ini bersifat cadangan/opsional)
create policy "public read active categories" on categories
  for select using (is_active = true);

create policy "public read active links" on links
  for select using (is_active = true);

-- ---------------------------------------------------------
-- 7. Seed contoh data (opsional — hapus/ubah sesuai kebutuhan)
-- ---------------------------------------------------------
insert into categories (name, slug, description, icon, accent_color, sort_order)
values
  ('Tryout SKD', 'tryout-skd', 'Simulasi Seleksi Kompetensi Dasar (TWK, TIU, TKP)', 'graduation-cap', '#C9A24C', 1),
  ('Materi TWK', 'materi-twk', 'Tes Wawasan Kebangsaan: Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika', 'book', '#7C6CF6', 2),
  ('Materi TIU', 'materi-tiu', 'Tes Intelegensia Umum: verbal, numerik, dan figural', 'briefcase', '#3FCFB4', 3),
  ('Materi TKP', 'materi-tkp', 'Tes Karakteristik Pribadi: pelayanan publik, integritas, kerja sama', 'heart', '#F4667C', 4),
  ('Tryout SKB', 'tryout-skb', 'Simulasi Seleksi Kompetensi Bidang sesuai formasi', 'briefcase', '#F5A954', 5),
  ('Info & Kisi-Kisi', 'info-kisi-kisi', 'Update jadwal, kisi-kisi resmi, dan formasi CPNS terbaru', 'newspaper', '#A9823A', 6)
on conflict (slug) do nothing;

insert into links (category_id, name, slug, url, description, icon, sort_order)
select id, 'Tryout SKD Gratis', 'tryout-skd-gratis', 'https://tryout.skarsha.com/skd', 'Latihan soal SKD dengan skor & pembahasan otomatis', 'link', 1
from categories where slug = 'tryout-skd'
on conflict (category_id, slug) do nothing;

insert into links (category_id, name, slug, url, description, icon, sort_order)
select id, 'Rangkuman TWK', 'rangkuman-twk', 'https://materi.skarsha.com/twk', 'Ringkasan Pancasila, UUD 1945, dan wawasan kebangsaan', 'book', 1
from categories where slug = 'materi-twk'
on conflict (category_id, slug) do nothing;

insert into links (category_id, name, slug, url, description, icon, sort_order)
select id, 'Bank Soal TIU', 'bank-soal-tiu', 'https://materi.skarsha.com/tiu', 'Kumpulan soal verbal, numerik, dan figural', 'book', 1
from categories where slug = 'materi-tiu'
on conflict (category_id, slug) do nothing;

insert into links (category_id, name, slug, url, description, icon, sort_order)
select id, 'Simulasi TKP', 'simulasi-tkp', 'https://materi.skarsha.com/tkp', 'Latihan soal TKP dengan pembahasan skor tertinggi', 'heart', 1
from categories where slug = 'materi-tkp'
on conflict (category_id, slug) do nothing;

insert into links (category_id, name, slug, url, description, icon, sort_order)
select id, 'Kisi-Kisi Formasi Terbaru', 'kisi-kisi-formasi-terbaru', 'https://info.skarsha.com/formasi', 'Info formasi dan jadwal seleksi CPNS terkini', 'newspaper', 1
from categories where slug = 'info-kisi-kisi'
on conflict (category_id, slug) do nothing;

-- Catatan: buat admin pertama lewat halaman /admin/setup atau insert manual:
-- password harus di-hash bcrypt dulu (lihat README bagian "Membuat Admin Pertama")

-- =========================================================
-- 8. BLOG POSTS
-- =========================================================
create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table blog_posts enable row level security;

create policy "public read published posts" on blog_posts
  for select using (is_published = true);

-- =========================================================
-- 9. CONTACT MESSAGES (dari form Kontak publik)
-- =========================================================
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- Publik boleh INSERT (kirim pesan) tapi tidak boleh membaca pesan orang lain
create policy "public can submit contact message" on contact_messages
  for insert with check (true);

-- =========================================================
-- 10. SITE SETTINGS (info kontak & sosial media, baris tunggal)
-- =========================================================
create table if not exists site_settings (
  id text primary key default 'default',
  contact_email text,
  contact_phone text,
  contact_address text,
  whatsapp_url text,
  instagram_url text,
  tiktok_url text,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

create policy "public read site settings" on site_settings
  for select using (true);

insert into site_settings (id, contact_email, contact_phone, contact_address)
values ('default', 'halo@skarsha.com', '+62 812-0000-0000', 'Indonesia')
on conflict (id) do nothing;

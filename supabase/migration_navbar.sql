-- =========================================================
-- MIGRASI: Fitur Navbar (Blog, Kontak, Pengaturan)
-- Jalankan file ini di Supabase SQL Editor JIKA project kamu
-- sudah pernah menjalankan supabase/schema.sql sebelumnya.
-- Jika ini instalasi baru, cukup jalankan schema.sql saja
-- (bagian ini sudah termasuk di dalamnya).
-- =========================================================

create extension if not exists "uuid-ossp";

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

drop policy if exists "public read published posts" on blog_posts;
create policy "public read published posts" on blog_posts
  for select using (is_published = true);

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

drop policy if exists "public can submit contact message" on contact_messages;
create policy "public can submit contact message" on contact_messages
  for insert with check (true);

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

drop policy if exists "public read site settings" on site_settings;
create policy "public read site settings" on site_settings
  for select using (true);

insert into site_settings (id, contact_email, contact_phone, contact_address)
values ('default', 'halo@skarsha.com', '+62 812-0000-0000', 'Indonesia')
on conflict (id) do nothing;

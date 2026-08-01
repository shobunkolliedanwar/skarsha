-- =========================================================
-- SKARSHA — Migrasi Fitur Premium (Fase 1: Foundation)
-- Jalankan file ini di Supabase SQL Editor setelah schema.sql
-- =========================================================

-- ---------------------------------------------------------
-- 1. USERS (akun publik/pengunjung — beda dari admin_users)
-- ---------------------------------------------------------
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  full_name text,
  is_premium boolean not null default false,
  premium_plan text check (premium_plan in ('monthly', 'lifetime')),
  premium_expires_at timestamptz, -- null jika plan = lifetime atau belum premium
  free_link_opens integer not null default 0, -- jumlah link yang sudah dibuka (user gratis, dibatasi)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table users enable row level security;
-- Tidak ada policy publik: hanya bisa diakses via service_role key di server.

-- ---------------------------------------------------------
-- 2. BOOKMARKS (link favorit milik user — fitur premium)
-- ---------------------------------------------------------
create table if not exists bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  link_id uuid not null references links(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, link_id)
);

alter table bookmarks enable row level security;

-- ---------------------------------------------------------
-- 3. PREMIUM TRANSACTIONS (riwayat pembayaran via Tripay)
-- ---------------------------------------------------------
create table if not exists premium_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  plan text not null check (plan in ('monthly', 'lifetime')),
  amount numeric not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired')),
  tripay_merchant_ref text unique not null,
  tripay_reference text,
  payment_method text,
  paid_at timestamptz,
  expired_at timestamptz, -- batas waktu bayar dari Tripay (bukan expired_at premium)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table premium_transactions enable row level security;

create index if not exists idx_premium_transactions_user_id on premium_transactions(user_id);
create index if not exists idx_bookmarks_user_id on bookmarks(user_id);

# SKARSHA

Portal persiapan **CPNS** — landing page + CMS admin dashboard untuk menghimpun
materi TWK/TIU/TKP, tryout SKD & SKB, serta info kisi-kisi dan formasi terbaru,
dikelompokkan sebagai **Kategori** dan **Sub Kategori**.

Stack: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase.

## Fitur

1. Landing page premium khusus CPNS — hero dengan badge TWK/TIU/TKP/SKD/SKB
   mengambang, ticker fakta cepat, grid "Kenapa SKARSHA", testimoni, FAQ, dan
   CTA — lengkap dengan navbar (Beranda, dropdown Kategori, Sub Kategori, Blog, Kontak)
2. Login admin (username & password disimpan di Supabase, di-hash dengan bcrypt)
3. Dashboard admin (ringkasan kategori, sub kategori, total klik, top link)
4. CRUD Kategori & Sub Kategori (nama, slug, URL, deskripsi, ikon, warna, urutan)
5. Penghitung klik otomatis setiap sub kategori diklik dari landing page
6. Halaman **Jelajahi** — cari & filter semua sub kategori dalam satu tempat
7. **Blog** — CRUD tulisan di admin, halaman publik `/blog` dan `/blog/[slug]`, status draft/terbit
8. **Kontak** — halaman publik dengan info kontak & form pesan; admin bisa kelola inbox pesan (`/admin/messages`) dan info kontak/sosial media (`/admin/settings`)

## 1. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, copy-paste seluruh isi file `supabase/schema.sql`, lalu jalankan (Run).
   Ini akan membuat tabel `admin_users`, `categories`, `links`, `click_logs`,
   `blog_posts`, `contact_messages`, `site_settings`, fungsi `increment_link_click`,
   RLS, dan 3 contoh kategori (CPNS, Music, Film).
   > Sudah pernah menjalankan `schema.sql` versi lama (belum ada Blog/Kontak)?
   > Cukup jalankan `supabase/migration_navbar.sql` untuk menambahkan tabel barunya saja.
   > Kategori masih berisi contoh lama (CPNS/Music/Film)? Jalankan
   > `supabase/migration_cpns_focus.sql` untuk menambah kategori contoh yang
   > fokus CPNS (Tryout SKD, Materi TWK/TIU/TKP, Tryout SKB, Info & Kisi-Kisi).
   > Mau nambah fitur akun user + premium? Jalankan juga
   > `supabase/migration_premium.sql` — ini membuat tabel `users` (akun publik,
   > terpisah dari `admin_users`), `bookmarks`, dan `premium_transactions`.
3. Buka **Project Settings > API**, catat:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ rahasia, jangan expose ke client)

## 2. Setup project lokal

```bash
npm install
cp .env.example .env.local
```

Isi `.env.local` dengan nilai dari Supabase di atas, dan buat `SESSION_SECRET`
bebas (minimal 32 karakter acak), misalnya:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Membuat Admin Pertama

Password admin disimpan di tabel `admin_users` dalam bentuk hash bcrypt
(tidak pernah plain text). Gunakan script bantuan:

```bash
node scripts/create-admin.js admin passwordkuat123
```

Script ini akan mencetak query `insert into admin_users (...)` — copy dan
jalankan di Supabase SQL Editor. Setelah itu kamu bisa login di `/login`
dengan username & password tersebut.

## 4. Menjalankan project

```bash
npm run dev
```

- Landing page: `http://localhost:3000`
- Login admin: `http://localhost:3000/login`
- Dashboard admin: `http://localhost:3000/admin` (otomatis redirect ke login jika belum masuk)

## 5. Alur pemakaian CMS

1. Login di `/login`.
2. Ke menu **Kategori** → tambah kategori (contoh: "Music", ikon, warna aksen).
3. Ke menu **Sub Kategori** → tambah sub kategori di dalam kategori tadi
   (contoh: nama "SKARSHA Music", URL tujuan `https://music.skarsha.com`).
4. Sub kategori otomatis muncul di landing page sebagai kartu link.
5. Setiap kali pengunjung klik link tersebut di landing page, permintaan
   melewati `/api/click/[linkId]` yang menambah `click_count` lalu redirect
   ke URL aslinya — jumlah klik langsung terlihat di dashboard & menu Sub Kategori.

## Struktur folder singkat

```
app/
  page.tsx                landing page
  jelajahi/page.tsx        jelajahi semua sub kategori (cari & filter)
  blog/                     halaman publik blog (list & detail)
  kontak/page.tsx           halaman publik kontak + form pesan
  login/page.tsx           halaman login admin
  admin/                    dashboard admin (dilindungi middleware)
    blog/                    CRUD tulisan blog
    messages/                inbox pesan dari form kontak
    settings/                info kontak & sosial media
  api/
    auth/                   login & logout
    click/[linkId]/         redirect + hitung klik
    categories/              CRUD kategori
    links/                    CRUD sub kategori
    blog/                     CRUD tulisan blog
    contact/                  terima pesan dari form kontak (publik)
    messages/                  kelola inbox pesan (admin)
    settings/                   info kontak & sosial media
lib/
  supabase/                 client Supabase (server & browser)
  auth.ts                    session JWT (jose)
components/
  landing/                   Navbar, Hero, CategoryGrid, CategoryCard, PortalLink, ContactForm, Footer
  admin/                      Sidebar, StatsCard
supabase/
  schema.sql                 skema database lengkap (instalasi baru)
  migration_navbar.sql        migrasi tambahan Blog/Kontak/Pengaturan (instalasi lama)
scripts/create-admin.js       helper bikin admin pertama
```

## Deploy

Deploy termudah lewat [Vercel](https://vercel.com): import repo, isi
Environment Variables yang sama seperti `.env.local`, lalu deploy.
Pastikan `SUPABASE_SERVICE_ROLE_KEY` hanya diisi di Environment Variables
server (bukan diprefix `NEXT_PUBLIC_`) agar tidak terekspos ke browser.

## Kustomisasi tampilan

Palet warna premium (gold "gilt" + aurora violet/rose/teal/amber di atas
background gelap) diatur di `tailwind.config.ts` dan `app/globals.css`.
Ganti nilai hex di sana untuk menyesuaikan identitas visual SKARSHA.

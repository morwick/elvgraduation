# ELV GRADUATION — Supabase Setup

Backend dijalankan di [Supabase](https://supabase.com). Ikuti langkah-langkah di
bawah ini untuk menyiapkan project dari nol.

## 1. Buat project Supabase

1. Buka [supabase.com](https://supabase.com) → **New project**.
2. Region: pilih yang terdekat (Singapore untuk Indonesia).
3. Catat **Project URL** dan **anon public key** dari **Project Settings → API**.

## 2. Jalankan SQL Schema

1. Buka **SQL Editor** → **New query**.
2. Salin seluruh isi `supabase/schema.sql` → tempel → **Run**.
3. (Opsional, untuk mengisi data awal sesuai design) salin `supabase/seed.sql` → **Run**.

Schema akan membuat:

- **Tabel konten**: `site_settings`, `packages`, `portfolio`, `portfolio_categories`,
  `process_steps`, `testimonials`, `stats`, `marquee_items`, `nav_links`.
- **Tabel form**: `bookings`.
- **Row Level Security**: publik bisa membaca konten, hanya user yang login bisa
  mengubah. Booking bisa di-insert oleh siapa saja, tapi hanya admin yang bisa
  membaca/mengubah.
- **Storage bucket**: `images` (publik baca, authenticated tulis) untuk upload
  foto dari admin CMS.

## 3. Buat user admin

Admin CMS dilindungi auth. Buat 1 user (atau lebih):

1. **Authentication → Users → Add user** → **Create new user**.
2. Email + password (mis. `admin@elvgraduation.id` / password yang kuat).
3. Centang **Auto Confirm User** supaya tidak perlu verifikasi email.

> **Penting** — Disable public signup supaya tidak ada yang bisa mendaftar
> tanpa izin:
>
> **Authentication → Sign In / Up → Disable "Allow new users to sign up"**.

## 4. Set env vars di project React

Buat file `.env` di root project (di luar folder `supabase/`):

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Restart dev server (`npm run dev`) supaya Vite memuat env baru.

## 5. Buka admin CMS

- Public site: <http://localhost:5173/>
- Admin login: <http://localhost:5173/admin/login>

Setelah login, semua konten bisa dikelola dari menu kiri:

| Menu             | Fungsi                                            |
| ---------------- | ------------------------------------------------- |
| Dashboard        | Ringkasan jumlah konten + booking terbaru          |
| Bookings         | Daftar permintaan booking dari form publik         |
| Site Settings    | Brand, alamat, kontak, hero/about image, copy text |
| Paket            | CRUD paket Esensi/Anggun/Magnum + fitur            |
| Galeri           | Upload foto, kategori, span grid                   |
| Kategori Galeri  | Filter di halaman portfolio                        |
| Proses           | 4 langkah konsultasi → album                       |
| Testimoni        | Cerita klien                                       |
| Statistik        | Angka di section About                             |
| Marquee          | Strip kata berjalan                                |
| Menu Navigasi    | Link header                                        |

## Upload gambar

Tombol "Unggah gambar" di Site Settings / Galeri akan meng-upload ke bucket
`images` di Supabase Storage dan mengisi field URL secara otomatis. Anda juga
bisa tempel URL eksternal (mis. Unsplash) langsung di field URL.

## Reset ulang (development)

`schema.sql` aman dijalankan ulang — semua tabel akan di-`drop … cascade` lalu
dibuat ulang. Setelah itu jalankan `seed.sql` lagi untuk repopulate.

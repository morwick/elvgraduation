# ELV GRADUATION

Landing page + CMS untuk jasa fotografi wisuda **ELV.GRADUATION** (Pekanbaru, Riau).

- **Frontend**: React 18 + Vite + plain CSS (palet maroon `#2A0001` × cream `#F5EFE6`).
- **Backend**: Supabase (Postgres + Auth + Storage).
- **Admin CMS**: `/admin` — kelola seluruh konten situs (paket, galeri, testimoni, dst.).

## Stack

| Bagian       | Teknologi                                |
| ------------ | ---------------------------------------- |
| UI           | React 18, React Router 7                 |
| Build        | Vite 5                                   |
| Styling      | CSS custom (no framework)                |
| Animasi      | IntersectionObserver + rAF parallax      |
| Database     | Supabase Postgres (RLS aktif)            |
| Auth         | Supabase Auth (email + password)         |
| File upload  | Supabase Storage bucket `images`         |

## Menjalankan secara lokal

```bash
# 1. Install dependencies
npm install

# 2. Copy env template lalu isi dengan kredensial Supabase Anda
cp .env.example .env
# edit .env → isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY

# 3. Jalankan dev server
npm run dev
```

Situs publik di <http://localhost:5173/>, admin CMS di <http://localhost:5173/admin>.

> Tanpa `.env`, situs publik tetap tampil dengan konten statis bawaan (dari
> `src/data/content.js`). Form booking & CMS membutuhkan Supabase aktif.

## Setup Supabase

Lihat panduan lengkap di [`supabase/README.md`](./supabase/README.md):

1. Buat project Supabase
2. Jalankan `supabase/schema.sql` di SQL Editor
3. Jalankan `supabase/seed.sql` (opsional — isi data sesuai design)
4. Buat user admin di **Authentication → Users**
5. Isi `.env` lalu restart `npm run dev`

## Struktur

```
.
├── index.html                # Entry HTML (Vite)
├── public/
│   └── elv-logo-white.png    # Logo (dipakai sebagai CSS mask di nav)
├── src/
│   ├── main.jsx              # React root
│   ├── App.jsx               # Router (public + /admin)
│   ├── PublicSite.jsx        # Komposisi halaman publik
│   ├── styles.css            # Style global situs
│   ├── components/           # Section components (Nav, Hero, …)
│   ├── hooks/                # useReveal, useParallax
│   ├── context/
│   │   └── ContentContext.jsx# Memuat konten dari Supabase + fallback statis
│   ├── data/
│   │   └── content.js        # Fallback statis bila Supabase tidak aktif
│   ├── lib/
│   │   ├── supabase.js       # Client Supabase
│   │   ├── api.js            # CRUD + upload helpers
│   │   └── auth.js           # useSession + signIn/Out
│   └── admin/                # CMS pages (login, layout, & 1 page per tabel)
└── supabase/
    ├── schema.sql            # DDL + RLS + storage bucket
    ├── seed.sql              # Data awal (sesuai design)
    └── README.md             # Setup detail
```

## Build production

```bash
npm run build       # output ke dist/
npm run preview     # serve dist/ untuk smoke test
```

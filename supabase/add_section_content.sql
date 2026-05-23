-- ===========================================================================
-- ELV.GRADUATION — Migration: add editable section content
-- Adds nullable columns to site_settings for all section eyebrows, titles, ledes.
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
--
-- Format yang dipakai oleh komponen:
--   \n     → ganti baris
--   *kata* → italic + warna rose (accent)
-- Contoh: 'Toga, tirai,\ndan *cahaya*\nterakhir.'
-- ===========================================================================

alter table public.site_settings
  add column if not exists hero_title         text,
  add column if not exists services_eyebrow   text,
  add column if not exists services_title     text,
  add column if not exists services_lede      text,
  add column if not exists portfolio_eyebrow  text,
  add column if not exists portfolio_title    text,
  add column if not exists about_eyebrow      text,
  add column if not exists about_title        text,
  add column if not exists process_eyebrow    text,
  add column if not exists process_title      text,
  add column if not exists testi_eyebrow      text,
  add column if not exists testi_title        text,
  add column if not exists booking_eyebrow    text,
  add column if not exists booking_title      text,
  add column if not exists booking_lede       text;

-- Seed sensible defaults into the singleton row (only if currently NULL).
update public.site_settings set
  hero_title         = coalesce(hero_title,         E'Toga, tirai,\ndan *cahaya*\nterakhir.'),
  services_eyebrow   = coalesce(services_eyebrow,   'Paket Layanan'),
  services_title     = coalesce(services_title,     E'Tiga cara\nuntuk *diingat.*'),
  services_lede      = coalesce(services_lede,      'Setiap paket dimulai dengan konsultasi konsep selama 30 menit. Tidak ada biaya tersembunyi — harga di bawah sudah termasuk tim, alat, edit, dan pengiriman digital.'),
  portfolio_eyebrow  = coalesce(portfolio_eyebrow,  'Galeri Karya'),
  portfolio_title    = coalesce(portfolio_title,    E'Sembilan momen,\n*satu malam* tak terulang.'),
  about_eyebrow      = coalesce(about_eyebrow,      'Tentang Kami'),
  about_title        = coalesce(about_title,        E'Sebuah studio\nkecil yang *obsesif*\nterhadap detail.'),
  process_eyebrow    = coalesce(process_eyebrow,    'Proses Kerja'),
  process_title      = coalesce(process_title,      E'Empat langkah,\ndari *kursi konsultasi*\nsampai bingkai di tembok.'),
  testi_eyebrow      = coalesce(testi_eyebrow,      'Cerita Klien'),
  testi_title        = coalesce(testi_title,        E'Mereka yang sudah *pulang*\ndengan bingkai di tangan.'),
  booking_eyebrow    = coalesce(booking_eyebrow,    'Booking Sesi'),
  booking_title      = coalesce(booking_title,      E'Pesan tanggal\nAnda *sekarang.*'),
  booking_lede       = coalesce(booking_lede,       'Jadwal Mei–Agustus biasanya penuh tiga bulan sebelum hari H. Isi formulir di samping atau hubungi kami langsung — tim akan balas dalam 6 jam kerja.')
where id = 1;

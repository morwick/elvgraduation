-- ===========================================================================
-- ELV.GRADUATION — initial seed data (mirrors the static design)
-- Run AFTER schema.sql.
-- ===========================================================================

-- Site settings: row already exists from schema; reset defaults explicitly --
update public.site_settings set
  brand            = 'ELV GRADUATION',
  whatsapp_phone   = '6281288880188',
  whatsapp_message = 'Halo ELV, saya tertarik untuk booking sesi foto wisuda.',
  email            = 'halo@elvgraduation.id',
  address_line1    = 'Jl. Jenderal Sudirman No. 88',
  address_line2    = 'Pekanbaru, Riau 28282',
  hours            = 'Selasa – Minggu · 10.00 – 19.00 WIB',
  est              = 'Est. 2018 · Pekanbaru',
  hero_bg          = 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=2200&q=80',
  about_img        = 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1400&q=80',
  hero_description = 'ELV.GRADUATION adalah studio fotografi wisuda yang mengabadikan empat tahun perjuangan Anda dalam satu sore yang tak akan terulang. Cinematic, intim, dan dibuat untuk dipajang seumur hidup.',
  about_body       = 'Kami bukan studio besar. Kami tim enam orang — dua fotografer utama, satu videografer, dua asisten, satu MUA langganan — yang sengaja menerima maksimal empat klien wisuda per minggu. Kualitas hanya bisa terjaga dengan ritme yang lambat.',
  footer_tagline   = 'Studio fotografi wisuda berbasis di Pekanbaru, Riau. Mengabadikan satu sore yang tak terulang — sejak 2018.',
  copyright        = '© 2026 ELV.GRADUATION · PT Cahaya Akhir Studio'
where id = 1;

-- Packages -----------------------------------------------------------------
delete from public.packages;
insert into public.packages (id, name, italic, tagline, currency, amount, unit, featured, tag, features, position) values
  ('esensi','Esensi','','Untuk momen yang sederhana','IDR','1.450','k / sesi',false,null, array[
    'Sesi 60 menit di area kampus',
    '1 fotografer + 1 asisten lighting',
    'Pose individu & dengan keluarga inti',
    '30 foto edit warna premium',
    'All raw files dalam Google Drive',
    'Pengiriman softcopy 7 hari kerja'
  ], 0),
  ('anggun','Anggun','Anggun','Paling banyak dipilih','IDR','2.850','k / sesi',true,'Populer', array[
    'Sesi 2 jam — kampus + 1 lokasi tambahan',
    '1 fotografer + 1 videografer behind-the-scene',
    'Pose individu, sahabat, dan keluarga besar',
    '60 foto edit cinematic + 10 foto retouch detail',
    'Reels behind-the-scene 30 detik',
    'Album mini cetak 5R isi 20 foto',
    'Pengiriman 5 hari kerja'
  ], 1),
  ('magnum','Magnum','Cum Laude','Untuk hari yang tak terulang','IDR','4.950','k / sesi',false,null, array[
    'Sesi seharian (hingga 6 jam) — multi lokasi',
    'Tim 4 orang: fotografer, videografer, MUA, asisten',
    'Pre-shoot konsep + moodboard kustom',
    '120 foto edit cinematic full retouch',
    'Cinematic film 60 detik + raw clips',
    'Album hardcover linen 20×30 cm — 24 halaman',
    'Frame premium 30×40 cm — 1 foto pilihan',
    'Pengiriman 3 hari + same-day teaser 5 foto'
  ], 2);

-- Portfolio categories -----------------------------------------------------
delete from public.portfolio_categories;
insert into public.portfolio_categories (key, label, position) values
  ('semua',     'Semua Karya', 0),
  ('outdoor',   'Outdoor',     1),
  ('studio',    'Studio',      2),
  ('group',     'Bersama',     3),
  ('cinematic', 'Cinematic',   4);

-- Portfolio items ----------------------------------------------------------
delete from public.portfolio;
insert into public.portfolio (cat, title, sub, span, img, position) values
  ('outdoor',   'Lulusan Pagi',    'UNRI · 2025',      's-5x5', 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80', 0),
  ('studio',    'Toga & Tirai',    'Studio · 2025',    's-3x6', 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80',  1),
  ('outdoor',   'Selamat, Adel',   'UIN Suska · 2025', 's-4x5', 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=900&q=80',  2),
  ('group',     'Sahabat Empat',   'UMRI · 2024',      's-6x4', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=80', 3),
  ('cinematic', 'Last Lecture',    'UNRI · 2024',      's-3x4', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=900&q=80',  4),
  ('studio',    'Cum Laude',       'Studio · 2024',    's-3x4', 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=900&q=80',  5),
  ('outdoor',   'Buku Tahunan',    'UNILAK · 2024',    's-4x6', 'https://images.unsplash.com/photo-1592415486689-125cbbfcbee2?auto=format&fit=crop&w=1100&q=80', 6),
  ('group',     'Keluarga Besar',  'UIN Suska · 2024', 's-5x5', 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=1300&q=80', 7),
  ('cinematic', 'Senja Wisuda',    'Pekanbaru · 2024', 's-3x4', 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80',  8);

-- Process ------------------------------------------------------------------
delete from public.process_steps;
insert into public.process_steps (n, title, em, body, position) values
  ('01','Konsultasi',          'Konsultasi','Sesi 30 menit via WhatsApp atau di studio. Kami dengarkan cerita Anda — jurusan, kampus, orang-orang yang ingin diabadikan.', 0),
  ('02','Konsep & Moodboard',  'Moodboard', 'Tim kami siapkan moodboard visual: palet warna, referensi pose, dan rencana lokasi. Anda yang final menyetujui.',           1),
  ('03','Pemotretan',          'Pemotretan','Hari H: tim datang 30 menit sebelum jadwal. Kami arahkan pose, jaga waktu, dan tangkap momen-momen tak terduga.',           2),
  ('04','Album & Pengiriman',  'Album',     'Foto diedit cinematic, kemudian dikurasi bersama Anda. Album fisik dicetak di kertas Hahnemühle dan dikirim ke pintu rumah.',3);

-- Testimonials -------------------------------------------------------------
delete from public.testimonials;
insert into public.testimonials (quote, name, meta, initial, position) values
  ('Mereka tidak hanya memotret — mereka merancang pengalaman. Tim ELV datang lebih awal, hafal urutan acara, dan membuat Mama saya berhenti mengeluhkan rambutnya.',
   'Adelia Rahmadhani', 'S1 Arsitektur, UNRI · 2025', 'A', 0),
  ('Foto wisuda saya akhirnya tidak generik. Ada satu frame di tangga selasar yang sekarang tergantung di ruang tamu rumah orang tua. Worth every rupiah.',
   'Bagus Pradipta', 'S1 Teknik Industri, UIN Suska · 2024', 'B', 1),
  ('Saya pesan paket Magnum dua minggu sebelum hari H, tetap dikerjakan total. Teaser dikirim malam itu juga — langsung saya kirim ke grup keluarga. Mereka menangis.',
   'Salsabila Maharani', 'S1 Ilmu Komunikasi, UMRI · 2024', 'S', 2);

-- Stats --------------------------------------------------------------------
delete from public.stats;
insert into public.stats (n, em, l, position) values
  ('480','+', 'Wisudawan diabadikan',           0),
  ('12', '',  'Kampus mitra di Riau',           1),
  ('7',  'th','Tahun mendokumentasikan momen',  2);

-- Marquee items ------------------------------------------------------------
delete from public.marquee_items;
insert into public.marquee_items (text, position) values
  ('Wisuda',              0),
  ('Toga & Samir',        1),
  ('Sidang Akhir',        2),
  ('Yudisium',            3),
  ('Buku Tahunan',        4),
  ('Foto Keluarga',       5),
  ('Sahabat Empat Tahun', 6),
  ('Cinematic Reels',     7),
  ('Album Linen',         8),
  ('Same-day Teaser',     9);

-- Nav links ----------------------------------------------------------------
delete from public.nav_links;
insert into public.nav_links (label, href, position) values
  ('Layanan', '#services',  0),
  ('Galeri',  '#portfolio', 1),
  ('Proses',  '#process',   2),
  ('Cerita',  '#testi',     3);

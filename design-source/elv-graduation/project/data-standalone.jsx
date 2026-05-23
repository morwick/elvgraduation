// data.jsx — content for ELV.GRADUATION

// Resource helper: when bundled, window.__resources holds blob URLs.
// When running normally, fall back to the live URL.
const IMG = (id, fallback) => (typeof window !== "undefined" && window.__resources && window.__resources[id]) || fallback;

const PACKAGES = [
  {
    id: "esensi",
    name: "Esensi",
    italic: "",
    tagline: "Untuk momen yang sederhana",
    currency: "IDR",
    amount: "1.450",
    unit: "k / sesi",
    featured: false,
    features: [
      "Sesi 60 menit di area kampus",
      "1 fotografer + 1 asisten lighting",
      "Pose individu & dengan keluarga inti",
      "30 foto edit warna premium",
      "All raw files dalam Google Drive",
      "Pengiriman softcopy 7 hari kerja",
    ],
  },
  {
    id: "anggun",
    name: "Anggun",
    italic: "Anggun",
    tagline: "Paling banyak dipilih",
    currency: "IDR",
    amount: "2.850",
    unit: "k / sesi",
    featured: true,
    tag: "Populer",
    features: [
      "Sesi 2 jam — kampus + 1 lokasi tambahan",
      "1 fotografer + 1 videografer behind-the-scene",
      "Pose individu, sahabat, dan keluarga besar",
      "60 foto edit cinematic + 10 foto retouch detail",
      "Reels behind-the-scene 30 detik",
      "Album mini cetak 5R isi 20 foto",
      "Pengiriman 5 hari kerja",
    ],
  },
  {
    id: "magnum",
    name: "Magnum",
    italic: "Cum Laude",
    tagline: "Untuk hari yang tak terulang",
    currency: "IDR",
    amount: "4.950",
    unit: "k / sesi",
    featured: false,
    features: [
      "Sesi seharian (hingga 6 jam) — multi lokasi",
      "Tim 4 orang: fotografer, videografer, MUA, asisten",
      "Pre-shoot konsep + moodboard kustom",
      "120 foto edit cinematic full retouch",
      "Cinematic film 60 detik + raw clips",
      "Album hardcover linen 20×30 cm — 24 halaman",
      "Frame premium 30×40 cm — 1 foto pilihan",
      "Pengiriman 3 hari + same-day teaser 5 foto",
    ],
  },
];

const PORTFOLIO = [
  { id:1, cat:"outdoor",    title:"Lulusan Pagi",     sub:"UNRI · 2025",  span:"s-5x5", img:IMG("p1","https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=1200&q=80") },
  { id:2, cat:"studio",     title:"Toga & Tirai",     sub:"Studio · 2025", span:"s-3x6", img:IMG("p2","https://images.unsplash.com/photo-1622495805949-91b09b27d4dd?auto=format&fit=crop&w=900&q=80") },
  { id:3, cat:"outdoor",    title:"Selamat, Adel",    sub:"UIN Suska · 2025", span:"s-4x5", img:IMG("p3","https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=900&q=80") },
  { id:4, cat:"group",      title:"Sahabat Empat",    sub:"UMRI · 2024", span:"s-6x4", img:IMG("p4","https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=80") },
  { id:5, cat:"cinematic",  title:"Last Lecture",     sub:"UNRI · 2024", span:"s-3x4", img:IMG("p5","https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80") },
  { id:6, cat:"studio",     title:"Cum Laude",        sub:"Studio · 2024", span:"s-3x4", img:IMG("p6","https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=900&q=80") },
  { id:7, cat:"outdoor",    title:"Buku Tahunan",     sub:"UNILAK · 2024", span:"s-4x6", img:IMG("p7","https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1100&q=80") },
  { id:8, cat:"group",      title:"Keluarga Besar",   sub:"UIN Suska · 2024", span:"s-5x5", img:IMG("p8","https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=1300&q=80") },
  { id:9, cat:"cinematic",  title:"Senja Wisuda",     sub:"Pekanbaru · 2024", span:"s-3x4", img:IMG("p9","https://images.unsplash.com/photo-1592415486689-125cbbfcbee2?auto=format&fit=crop&w=900&q=80") },
];

const PROCESS = [
  { n:"01", title:"Konsultasi", em:"Konsultasi", body:"Sesi 30 menit via WhatsApp atau di studio. Kami dengarkan cerita Anda — jurusan, kampus, orang-orang yang ingin diabadikan." },
  { n:"02", title:"Konsep & Moodboard", em:"Moodboard", body:"Tim kami siapkan moodboard visual: palet warna, referensi pose, dan rencana lokasi. Anda yang final menyetujui." },
  { n:"03", title:"Pemotretan", em:"Pemotretan", body:"Hari H: tim datang 30 menit sebelum jadwal. Kami arahkan pose, jaga waktu, dan tangkap momen-momen tak terduga." },
  { n:"04", title:"Album & Pengiriman", em:"Album", body:"Foto diedit cinematic, kemudian dikurasi bersama Anda. Album fisik dicetak di kertas Hahnemühle dan dikirim ke pintu rumah." },
];

const TESTIMONIALS = [
  {
    quote: "Mereka tidak hanya memotret — mereka merancang pengalaman. Tim ELV datang lebih awal, hafal urutan acara, dan membuat Mama saya berhenti mengeluhkan rambutnya.",
    name: "Adelia Rahmadhani",
    meta: "S1 Arsitektur, UNRI · 2025",
    initial: "A",
  },
  {
    quote: "Foto wisuda saya akhirnya tidak generik. Ada satu frame di tangga selasar yang sekarang tergantung di ruang tamu rumah orang tua. Worth every rupiah.",
    name: "Bagus Pradipta",
    meta: "S1 Teknik Industri, UIN Suska · 2024",
    initial: "B",
  },
  {
    quote: "Saya pesan paket Magnum dua minggu sebelum hari H, tetap dikerjakan total. Teaser dikirim malam itu juga — langsung saya kirim ke grup keluarga. Mereka menangis.",
    name: "Salsabila Maharani",
    meta: "S1 Ilmu Komunikasi, UMRI · 2024",
    initial: "S",
  },
];

const STATS = [
  { n:"480",  em:"+", l:"Wisudawan diabadikan" },
  { n:"12",   em:"",  l:"Kampus mitra di Riau" },
  { n:"7",    em:"th", l:"Tahun mendokumentasikan momen" },
];

window.ELV_DATA = { PACKAGES, PORTFOLIO, PROCESS, TESTIMONIALS, STATS };

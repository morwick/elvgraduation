// sections.jsx — ELV.GRADUATION section components
const { useState, useEffect, useRef, useMemo } = React;

const HERO_BG = window.__resources.heroBg;
const ABOUT_IMG = window.__resources.aboutImg;

/* ---------- Reveal on scroll ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------- Parallax: shifts elements with [data-parallax] based on scroll ----------
   Usage: <div data-parallax="0.4">  → moves at 40% of scroll speed (negative = up)
   Reads viewport position relative to element, applies translateY via CSS var. */
function useParallax() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!els.length) return;

    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.getBoundingClientRect();
        // distance from viewport center to element center (positive = element above center)
        const center = rect.top + rect.height / 2;
        const delta = center - vh / 2;
        const y = -delta * speed;
        el.style.setProperty("--py", y.toFixed(2) + "px");
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);
}

/* ---------- NAV ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["Layanan", "#services"],
    ["Galeri", "#portfolio"],
    ["Proses", "#process"],
    ["Cerita", "#testi"],
  ];
  return (
    <header className={"nav " + (scrolled ? "scrolled" : "")}>
      <a href="#top" className="nav-brand">
        <span className="nav-logo" aria-hidden="true"></span>
        <span>ELV GRADUATION</span>
      </a>
      <nav className="nav-links">
        {links.map(([t, h]) => (
          <a key={h} href={h}>{t}</a>
        ))}
      </nav>
      <a href="#booking" className="btn btn-ghost nav-cta" style={{borderColor: scrolled ? "" : "rgba(245,239,230,.35)", color: scrolled ? "" : "var(--cream)"}}>
        Booking <span className="arrow">→</span>
      </a>
    </header>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <div className="hero-bg" data-parallax="0.35" style={{backgroundImage: `url(${HERO_BG})`}}></div>
      <div className="hero-inner" data-parallax="-0.08">
        <h1 className="hero-title">
          Toga, tirai,<br/>
          dan <em>cahaya</em><br/>
          terakhir<span className="ampersand">.</span>
        </h1>
        <div className="hero-side">
          <span className="eyebrow on-dark">Est. 2018 · Pekanbaru</span>
          <p>
            ELV.GRADUATION adalah studio fotografi wisuda yang mengabadikan
            empat tahun perjuangan Anda dalam satu sore yang tak akan terulang.
            Cinematic, intim, dan dibuat untuk dipajang seumur hidup.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <a href="#booking" className="btn btn-on-dark" style={{background:"var(--cream)",color:"var(--maroon)",borderColor:"var(--cream)"}}>
              Pesan Sesi <span className="arrow">→</span>
            </a>
            <a href="#portfolio" className="btn btn-on-dark">Lihat Karya</a>
          </div>
        </div>
      </div>

      <div className="hero-meta">
        <span>NO. 001</span>
        <span className="sep"></span>
        <span>Wisuda · Sidang · Yudisium</span>
      </div>
      <div className="hero-scroll">
        <span>Gulir ke bawah</span>
        <span className="line"></span>
      </div>
    </section>
  );
}

/* ---------- MARQUEE ---------- */
function Marquee() {
  const items = [
    "Wisuda", "Toga & Samir", "Sidang Akhir", "Yudisium",
    "Buku Tahunan", "Foto Keluarga", "Sahabat Empat Tahun",
    "Cinematic Reels", "Album Linen", "Same-day Teaser",
  ];
  const row = (
    <span>
      {items.map((t, i) => (
        <React.Fragment key={i}>
          {t}<span className="star">✦</span>
        </React.Fragment>
      ))}
    </span>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row}{row}
      </div>
    </div>
  );
}

/* ---------- SERVICES ---------- */
function Services() {
  const { PACKAGES } = window.ELV_DATA;
  return (
    <section className="services container" id="services" data-screen-label="02 Layanan">
      <div className="services-head reveal">
        <div>
          <span className="eyebrow">Paket Layanan</span>
          <h2 className="section-title">
            Tiga cara<br/>untuk <em>diingat.</em>
          </h2>
        </div>
        <p className="lede">
          Setiap paket dimulai dengan konsultasi konsep selama 30 menit.
          Tidak ada biaya tersembunyi — harga di bawah sudah termasuk tim,
          alat, edit, dan pengiriman digital.
        </p>
      </div>

      <div className="packages reveal">
        {PACKAGES.map((p) => (
          <article key={p.id} className={"pkg " + (p.featured ? "featured" : "")}>
            {p.tag && <span className="pkg-tag">{p.tag}</span>}
            <h3 className="pkg-name">
              {p.italic ? <em>{p.italic}</em> : p.name}
            </h3>
            <div className="pkg-tagline">{p.tagline}</div>
            <div className="pkg-price">
              <span className="currency">{p.currency}</span>
              <span className="amount">{p.amount}</span>
            </div>
            <div className="pkg-price-sub">{p.unit} · sudah termasuk pajak</div>
            <div className="pkg-divider"></div>
            <ul className="pkg-feat">
              {p.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <a
              href="#booking"
              className={"btn pkg-cta " + (p.featured ? "btn-on-dark" : "btn-ghost")}
              style={p.featured ? {background:"var(--cream)",color:"var(--maroon)",borderColor:"var(--cream)"} : {}}
            >
              Pilih {p.name} <span className="arrow">→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- PORTFOLIO ---------- */
function Portfolio({ onOpen }) {
  const { PORTFOLIO } = window.ELV_DATA;
  const [filter, setFilter] = useState("semua");
  const cats = [
    ["semua", "Semua Karya"],
    ["outdoor", "Outdoor"],
    ["studio", "Studio"],
    ["group", "Bersama"],
    ["cinematic", "Cinematic"],
  ];
  const items = useMemo(
    () => filter === "semua" ? PORTFOLIO : PORTFOLIO.filter(p => p.cat === filter),
    [filter]
  );
  return (
    <section className="portfolio" id="portfolio" data-screen-label="03 Galeri">
      <div className="container">
        <div className="port-head reveal">
          <div>
            <span className="eyebrow">Galeri Karya</span>
            <h2 className="section-title">Sembilan momen,<br/><em>satu malam</em> tak terulang.</h2>
          </div>
          <div className="port-filters">
            {cats.map(([k, l]) => (
              <button key={k}
                className={"port-filter " + (filter === k ? "active" : "")}
                onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
        </div>

        <div className="port-grid reveal">
          {items.map((p) => (
            <div key={p.id} className={"port-item " + p.span} onClick={() => onOpen(p)}>
              <img src={p.img} alt={p.title} loading="lazy" />
              <div className="cap">
                <div>
                  <div className="cap-s">{p.sub}</div>
                  <div className="cap-t"><em>{p.title}</em></div>
                </div>
                <div style={{fontSize:18,opacity:.9}}>↗</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- ABOUT STRIP ---------- */
function About() {
  const { STATS } = window.ELV_DATA;
  return (
    <section className="about" data-screen-label="04 Tentang">
      <div className="about-img" data-parallax="0.25" style={{backgroundImage: `url(${ABOUT_IMG})`}}></div>
      <div className="about-body reveal">
        <span className="eyebrow on-dark">Tentang Kami</span>
        <h2>Sebuah studio<br/>kecil yang <em>obsesif</em><br/>terhadap detail.</h2>
        <p>
          Kami bukan studio besar. Kami tim enam orang — dua fotografer utama,
          satu videografer, dua asisten, satu MUA langganan — yang sengaja
          menerima maksimal empat klien wisuda per minggu. Kualitas hanya bisa
          terjaga dengan ritme yang lambat.
        </p>
        <div className="about-stats">
          {STATS.map((s, i) => (
            <div className="stat" key={i}>
              <div className="n">{s.n}<em>{s.em}</em></div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- PROCESS ---------- */
function Process() {
  const { PROCESS } = window.ELV_DATA;
  return (
    <section className="process container" id="process" data-screen-label="05 Proses">
      <div className="reveal" style={{maxWidth:680}}>
        <span className="eyebrow">Proses Kerja</span>
        <h2 className="section-title">Empat langkah,<br/>dari <em>kursi konsultasi</em><br/>sampai bingkai di tembok.</h2>
      </div>
      <div className="proc-grid reveal">
        {PROCESS.map((s) => (
          <div key={s.n} className="proc-step">
            <div className="proc-num">{s.n}</div>
            <h3><em>{s.em}</em></h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
function Testi() {
  const { TESTIMONIALS } = window.ELV_DATA;
  return (
    <section className="testi" id="testi" data-screen-label="06 Cerita">
      <div className="container">
        <div className="reveal" style={{maxWidth:680}}>
          <span className="eyebrow">Cerita Klien</span>
          <h2 className="section-title">Mereka yang sudah <em>pulang</em><br/>dengan bingkai di tangan.</h2>
        </div>
        <div className="testi-track reveal">
          {TESTIMONIALS.map((t, i) => (
            <article className="quote" key={i}>
              <span className="mark">"</span>
              <blockquote>{t.quote}</blockquote>
              <div className="quote-by">
                <div className="qa">{t.initial}</div>
                <div>
                  <div className="qb-name">{t.name}</div>
                  <div className="qb-meta">{t.meta}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- BOOKING ---------- */
function Booking() {
  const { PACKAGES } = window.ELV_DATA;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    package: PACKAGES[1].id, date: "", campus: "", note: "",
  });
  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 6000);
  };
  return (
    <section className="book" id="booking" data-screen-label="07 Booking">
      <div className="container book-grid">
        <div className="book-side reveal">
          <span className="eyebrow">Booking Sesi</span>
          <h2>Pesan tanggal<br/>Anda <em>sekarang.</em></h2>
          <p className="lede">
            Jadwal Mei–Agustus biasanya penuh tiga bulan sebelum hari H.
            Isi formulir di samping atau hubungi kami langsung — tim akan
            balas dalam 6 jam kerja.
          </p>
          <div className="book-info">
            <div className="row">
              <div className="k">Studio</div>
              <div className="v">Jl. Jenderal Sudirman No. 88<br/>Pekanbaru, Riau 28282</div>
            </div>
            <div className="row">
              <div className="k">WhatsApp</div>
              <div className="v"><a href="#">+62 812-8888-0188</a></div>
            </div>
            <div className="row">
              <div className="k">Email</div>
              <div className="v"><a href="#">halo@elvgraduation.id</a></div>
            </div>
            <div className="row">
              <div className="k">Jam Studio</div>
              <div className="v">Selasa – Minggu · 10.00 – 19.00 WIB</div>
            </div>
          </div>
        </div>

        <form className="book-form reveal" onSubmit={submit}>
          <div className="row">
            <label>Nama Lengkap</label>
            <input required value={form.name} onChange={upd("name")} placeholder="Adelia Rahmadhani" />
          </div>
          <div className="row-2">
            <div className="row">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={upd("email")} placeholder="kamu@gmail.com" />
            </div>
            <div className="row">
              <label>No. WhatsApp</label>
              <input required value={form.phone} onChange={upd("phone")} placeholder="0812-xxxx-xxxx" />
            </div>
          </div>
          <div className="row-2">
            <div className="row">
              <label>Pilih Paket</label>
              <select value={form.package} onChange={upd("package")}>
                {PACKAGES.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — IDR {p.amount}{p.unit.replace(/[^a-z\/ ]/gi, " ").trim()}</option>
                ))}
              </select>
            </div>
            <div className="row">
              <label>Tanggal Sesi</label>
              <input type="date" value={form.date} onChange={upd("date")} />
            </div>
          </div>
          <div className="row">
            <label>Kampus / Lokasi</label>
            <input value={form.campus} onChange={upd("campus")} placeholder="Universitas Riau, Pekanbaru" />
          </div>
          <div className="row">
            <label>Catatan Konsep (opsional)</label>
            <textarea rows="3" value={form.note} onChange={upd("note")} placeholder="Ceritakan jurusan, jumlah orang yang ikut, suasana yang diinginkan…"></textarea>
          </div>

          {sent ? (
            <div className="book-success">
              Terima kasih, <em>{form.name || "kawan"}</em> — kami akan balas dalam 6 jam.
            </div>
          ) : (
            <button type="submit" className="btn book-submit">
              Kirim Permintaan <span className="arrow">→</span>
            </button>
          )}
        </form>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="footer" data-screen-label="08 Footer">
      <div className="foot-grid">
        <div>
          <div className="foot-brand">ELV <em>graduation</em></div>
          <p className="foot-tag">Studio fotografi wisuda berbasis di Pekanbaru, Riau. Mengabadikan satu sore yang tak terulang — sejak 2018.</p>
          <div style={{display:"flex",gap:8}}>
            {["IG","TT","YT"].map(s => (
              <a key={s} href="#" style={{
                width:36,height:36,borderRadius:"50%",
                border:"1px solid rgba(245,239,230,.25)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,letterSpacing:".1em",color:"rgba(245,239,230,.85)"
              }}>{s}</a>
            ))}
          </div>
        </div>
        <div className="foot-col">
          <h4>Layanan</h4>
          <ul>
            <li><a href="#services">Paket Esensi</a></li>
            <li><a href="#services">Paket Anggun</a></li>
            <li><a href="#services">Paket Magnum</a></li>
            <li><a href="#">Add-on Cetak</a></li>
            <li><a href="#">Cinematic Reels</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h4>Studio</h4>
          <ul>
            <li><a href="#">Tentang Kami</a></li>
            <li><a href="#process">Proses</a></li>
            <li><a href="#testi">Cerita Klien</a></li>
            <li><a href="#">Jurnal</a></li>
            <li><a href="#">Karir</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h4>Kontak</h4>
          <ul>
            <li><a href="#">Jl. Sudirman 88, Pekanbaru</a></li>
            <li><a href="#">+62 812-8888-0188</a></li>
            <li><a href="#">halo@elvgraduation.id</a></li>
            <li><a href="#booking">Booking sesi</a></li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 ELV.GRADUATION · PT Cahaya Akhir Studio</span>
        <span className="word"><em>terima kasih telah lulus.</em></span>
        <span>Privasi · Ketentuan</span>
      </div>
    </footer>
  );
}

/* ---------- WHATSAPP FAB ---------- */
function WhatsAppFAB({ phone = "6281288880188", message = "Halo ELV, saya tertarik untuk booking sesi foto wisuda." }) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="wa-fab" aria-label="Chat via WhatsApp">
      <span className="wa-fab-icon">
        <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16.001 3.2C8.93 3.2 3.2 8.93 3.2 16c0 2.26.59 4.47 1.72 6.42L3.2 28.8l6.55-1.71A12.8 12.8 0 0 0 28.8 16c0-7.07-5.73-12.8-12.8-12.8zm0 23.32a10.5 10.5 0 0 1-5.36-1.47l-.38-.23-3.89 1.02 1.04-3.8-.25-.39A10.5 10.5 0 1 1 26.5 16c0 5.8-4.7 10.52-10.5 10.52zm5.76-7.86c-.32-.16-1.87-.92-2.16-1.03-.29-.11-.5-.16-.71.16-.21.32-.81 1.03-.99 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.77-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.72-.98-2.36-.26-.62-.52-.54-.71-.55-.18-.01-.4-.01-.61-.01s-.55.08-.84.4c-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.51 1.8.66.76.24 1.45.21 2 .13.61-.09 1.87-.76 2.13-1.5.26-.74.26-1.37.18-1.5-.08-.13-.29-.21-.61-.37z"/>
        </svg>
      </span>
      <span className="wa-fab-label">
        <span className="wa-fab-line">Chat di WhatsApp</span>
        <span className="wa-fab-sub">balas &lt; 6 jam</span>
      </span>
    </a>
  );
}

/* ---------- LIGHTBOX ---------- */
function Lightbox({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className={"lb " + (item ? "open" : "")} onClick={onClose}>
      {item && (
        <>
          <button className="lb-close" onClick={onClose}>✕</button>
          <img src={item.img.replace(/w=\d+/, "w=1800")} alt={item.title} onClick={(e)=>e.stopPropagation()} />
          <div className="lb-meta"><em>{item.title}</em> — {item.sub}</div>
        </>
      )}
    </div>
  );
}

Object.assign(window, {
  Nav, Hero, Marquee, Services, Portfolio, About, Process, Testi, Booking, Footer, Lightbox, WhatsAppFAB, useReveal, useParallax
});

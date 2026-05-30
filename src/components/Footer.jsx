import { useContent } from "../context/ContentContext.jsx";

export default function Footer() {
  const { site } = useContent();
  return (
    <footer className="footer" data-screen-label="08 Footer">
      <div className="foot-grid">
        <div>
          <div className="foot-brand">
            EyeLens<em>Visual</em>
          </div>
          <p className="foot-tag">
            {site.footerTagline || "Studio fotografi wisuda berbasis di Pekanbaru, Riau. Mengabadikan satu sore yang tak terulang — sejak 2018."}
          </p>
          <div className="foot-social">
            <a href={site.instagramUrl || "#"} aria-label="Instagram" target="_blank" rel="noopener noreferrer">IG</a>
            <a href={site.tiktokUrl || "#"}    aria-label="TikTok"    target="_blank" rel="noopener noreferrer">TT</a>
            <a href={site.youtubeUrl || "#"}   aria-label="YouTube"   target="_blank" rel="noopener noreferrer">YT</a>
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
            <li>{site.address.line1}, {site.address.line2}</li>
            <li>+{site.whatsappPhone}</li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a href="#booking">Booking sesi</a></li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <span>
          © 2026{" "}
          <a
            href="https://www.instagram.com/stdrzk.id/"
            target="_blank"
            rel="noopener noreferrer"
          >
            RZK.id
          </a>
        </span>
        <span className="word">
          <em>terima kasih telah lulus.</em>
        </span>
        <span>Privasi · Ketentuan</span>
      </div>
    </footer>
  );
}

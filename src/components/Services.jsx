import { useContent } from "../context/ContentContext.jsx";
import RichText from "./RichText.jsx";

const FB_EYEBROW = "Paket Layanan";
const FB_TITLE   = "Tiga cara\nuntuk *diingat.*";
const FB_LEDE    = "Setiap paket dimulai dengan konsultasi konsep selama 30 menit. Tidak ada biaya tersembunyi — harga di bawah sudah termasuk tim, alat, edit, dan pengiriman digital.";

export default function Services() {
  const { packages, site } = useContent();
  return (
    <section
      className="services container"
      id="services"
      data-screen-label="02 Layanan"
    >
      <div className="services-head reveal">
        <div>
          <span className="eyebrow">{site.servicesEyebrow || FB_EYEBROW}</span>
          <h2 className="section-title">
            <RichText text={site.servicesTitle} fallback={FB_TITLE} />
          </h2>
        </div>
        <p className="lede">{site.servicesLede || FB_LEDE}</p>
      </div>

      <div className="packages reveal">
        {packages.map((p) => (
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
              {p.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <a
              href="#booking"
              className={"btn pkg-cta " + (p.featured ? "btn-on-dark" : "btn-ghost")}
              style={
                p.featured
                  ? {
                      background: "var(--cream)",
                      color: "var(--maroon)",
                      borderColor: "var(--cream)",
                    }
                  : {}
              }
            >
              Pilih {p.name} <span className="arrow">→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

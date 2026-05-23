import { useContent } from "../context/ContentContext.jsx";

export default function Services() {
  const { packages } = useContent();
  return (
    <section
      className="services container"
      id="services"
      data-screen-label="02 Layanan"
    >
      <div className="services-head reveal">
        <div>
          <span className="eyebrow">Paket Layanan</span>
          <h2 className="section-title">
            Tiga cara<br />
            untuk <em>diingat.</em>
          </h2>
        </div>
        <p className="lede">
          Setiap paket dimulai dengan konsultasi konsep selama 30 menit. Tidak
          ada biaya tersembunyi — harga di bawah sudah termasuk tim, alat, edit,
          dan pengiriman digital.
        </p>
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

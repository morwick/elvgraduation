import { useContent } from "../context/ContentContext.jsx";

export default function Hero() {
  const { site, heroBg } = useContent();
  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <div
        className="hero-bg"
        data-parallax="0.35"
        style={{ backgroundImage: `url(${heroBg})` }}
      ></div>

      <div className="hero-inner" data-parallax="-0.08">
        <h1 className="hero-title">
          Toga, tirai,<br />
          dan <em>cahaya</em>{" "}<br />
          terakhir<span className="ampersand">.</span>
        </h1>
        <div className="hero-side">
          <span className="eyebrow on-dark">{site.est}</span>
          <p>{site.heroDescription || (
            <>
              ELV.GRADUATION adalah studio fotografi wisuda yang mengabadikan
              empat tahun perjuangan Anda dalam satu sore yang tak akan terulang.
              Cinematic, intim, dan dibuat untuk dipajang seumur hidup.
            </>
          )}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="#booking"
              className="btn btn-on-dark"
              style={{
                background: "var(--cream)",
                color: "var(--maroon)",
                borderColor: "var(--cream)",
              }}
            >
              Pesan Sesi <span className="arrow">→</span>
            </a>
            <a href="#portfolio" className="btn btn-on-dark">
              Lihat Karya
            </a>
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

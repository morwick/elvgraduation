import { useContent } from "../context/ContentContext.jsx";
import RichText from "./RichText.jsx";

const FB_EYEBROW = "Tentang Kami";
const FB_TITLE   = "Sebuah studio\nkecil yang *obsesif*\nterhadap detail.";

export default function About() {
  const { aboutImg, stats, site } = useContent();
  return (
    <section className="about" data-screen-label="04 Tentang">
      <div
        className="about-img"
        data-parallax="0.25"
        style={{ backgroundImage: `url(${aboutImg})` }}
        role="img"
        aria-label="Tim ELV.GRADUATION saat sesi foto wisuda di Pekanbaru"
      ></div>
      <div className="about-body reveal">
        <span className="eyebrow on-dark">{site.aboutEyebrow || FB_EYEBROW}</span>
        <h2>
          <RichText text={site.aboutTitle} fallback={FB_TITLE} />
        </h2>
        <p>{site.aboutBody || (
          <>
            Kami bukan studio besar. Kami tim enam orang — dua fotografer utama,
            satu videografer, dua asisten, satu MUA langganan — yang sengaja
            menerima maksimal empat klien wisuda per minggu. Kualitas hanya bisa
            terjaga dengan ritme yang lambat.
          </>
        )}</p>
        <div className="about-stats">
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="n">
                {s.n}
                <em>{s.em}</em>
              </div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

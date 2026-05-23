import { useContent } from "../context/ContentContext.jsx";
import RichText from "./RichText.jsx";

const FB_EYEBROW = "Cerita Klien";
const FB_TITLE   = "Mereka yang sudah *pulang*\ndengan bingkai di tangan.";

export default function Testimonials() {
  const { testimonials, site } = useContent();
  return (
    <section className="testi" id="testi" data-screen-label="06 Cerita">
      <div className="container">
        <div className="reveal" style={{ maxWidth: 680 }}>
          <span className="eyebrow">{site.testiEyebrow || FB_EYEBROW}</span>
          <h2 className="section-title">
            <RichText text={site.testiTitle} fallback={FB_TITLE} />
          </h2>
        </div>
        <div className="testi-track reveal">
          {testimonials.map((t, i) => (
            <article className="quote" key={t.id ?? i}>
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

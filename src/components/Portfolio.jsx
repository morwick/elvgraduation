import { useMemo, useState } from "react";
import { useContent } from "../context/ContentContext.jsx";
import RichText from "./RichText.jsx";

const FB_EYEBROW = "Galeri Karya";
const FB_TITLE   = "Sembilan momen,\n*satu malam* tak terulang.";

export default function Portfolio({ onOpen }) {
  const { portfolio, portfolioCategories, site } = useContent();
  const [filter, setFilter] = useState("semua");

  const items = useMemo(
    () => (filter === "semua" ? portfolio : portfolio.filter((p) => p.cat === filter)),
    [filter, portfolio]
  );

  return (
    <section className="portfolio" id="portfolio" data-screen-label="03 Galeri">
      <div className="container">
        <div className="port-head reveal">
          <div>
            <span className="eyebrow">{site.portfolioEyebrow || FB_EYEBROW}</span>
            <h2 className="section-title">
              <RichText text={site.portfolioTitle} fallback={FB_TITLE} />
            </h2>
          </div>
          <div className="port-filters">
            {portfolioCategories.map(([k, l]) => (
              <button
                key={k}
                className={"port-filter " + (filter === k ? "active" : "")}
                onClick={() => setFilter(k)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="port-grid reveal">
          {items.map((p) => (
            <div
              key={p.id}
              className={"port-item " + p.span}
              onClick={() => onOpen(p)}
            >
              {p.video ? (
                <video
                  src={p.video}
                  poster={p.img}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={`Video wisuda — ${p.title}${p.sub ? " — " + p.sub : ""}`}
                />
              ) : (
                <img
                  src={p.img}
                  alt={`Foto wisuda ${p.title}${p.sub ? " — " + p.sub : ""}${p.cat ? " (" + p.cat + ")" : ""}`}
                  loading="lazy"
                />
              )}
              <div className="cap">
                <div>
                  <div className="cap-s">{p.sub}</div>
                  <div className="cap-t">
                    <em>{p.title}</em>
                  </div>
                </div>
                <div style={{ fontSize: 18, opacity: 0.9 }}>↗</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

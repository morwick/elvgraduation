import { useMemo, useState } from "react";
import { useContent } from "../context/ContentContext.jsx";

export default function Portfolio({ onOpen }) {
  const { portfolio, portfolioCategories } = useContent();
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
            <span className="eyebrow">Galeri Karya</span>
            <h2 className="section-title">
              Sembilan momen,<br />
              <em>satu malam</em> tak terulang.
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
              <img src={p.img} alt={p.title} loading="lazy" />
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

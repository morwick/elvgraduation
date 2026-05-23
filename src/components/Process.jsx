import { useContent } from "../context/ContentContext.jsx";
import RichText from "./RichText.jsx";

const FB_EYEBROW = "Proses Kerja";
const FB_TITLE   = "Empat langkah,\ndari *kursi konsultasi*\nsampai bingkai di tembok.";

export default function Process() {
  const { process, site } = useContent();
  return (
    <section className="process container" id="process" data-screen-label="05 Proses">
      <div className="reveal" style={{ maxWidth: 680 }}>
        <span className="eyebrow">{site.processEyebrow || FB_EYEBROW}</span>
        <h2 className="section-title">
          <RichText text={site.processTitle} fallback={FB_TITLE} />
        </h2>
      </div>
      <div className="proc-grid reveal">
        {process.map((s) => (
          <div key={s.n + s.em} className="proc-step">
            <div className="proc-num">{s.n}</div>
            <h3><em>{s.em}</em></h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

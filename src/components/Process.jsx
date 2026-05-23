import { useContent } from "../context/ContentContext.jsx";

export default function Process() {
  const { process } = useContent();
  return (
    <section className="process container" id="process" data-screen-label="05 Proses">
      <div className="reveal" style={{ maxWidth: 680 }}>
        <span className="eyebrow">Proses Kerja</span>
        <h2 className="section-title">
          Empat langkah,<br />
          dari <em>kursi konsultasi</em><br />
          sampai bingkai di tembok.
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

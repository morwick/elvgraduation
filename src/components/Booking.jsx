import { useState } from "react";
import { useContent } from "../context/ContentContext.jsx";
import { submitBooking } from "../lib/api.js";

export default function Booking() {
  const { packages, site } = useContent();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    package: packages[0]?.id ?? "",
    date: "",
    campus: "",
    note: "",
  });

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitBooking(form);
      setSent(true);
      setForm({ ...form, name: "", email: "", phone: "", date: "", campus: "", note: "" });
      setTimeout(() => setSent(false), 8000);
    } catch (err) {
      setError(err.message || "Gagal mengirim. Coba lagi atau hubungi via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const waHref = `https://wa.me/${site.whatsappPhone}?text=${encodeURIComponent(site.whatsappMessage)}`;

  return (
    <section className="book" id="booking" data-screen-label="07 Booking">
      <div className="container book-grid">
        <div className="book-side reveal">
          <span className="eyebrow">Booking Sesi</span>
          <h2>
            Pesan tanggal<br />
            Anda <em>sekarang.</em>
          </h2>
          <p className="lede">
            Jadwal Mei–Agustus biasanya penuh tiga bulan sebelum hari H.
            Isi formulir di samping atau hubungi kami langsung — tim akan
            balas dalam 6 jam kerja.
          </p>
          <div className="book-info">
            <div className="row">
              <div className="k">Studio</div>
              <div className="v">
                {site.address.line1}<br />
                {site.address.line2}
              </div>
            </div>
            <div className="row">
              <div className="k">WhatsApp</div>
              <div className="v">
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  +{site.whatsappPhone}
                </a>
              </div>
            </div>
            <div className="row">
              <div className="k">Email</div>
              <div className="v">
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </div>
            <div className="row">
              <div className="k">Jam Studio</div>
              <div className="v">{site.hours}</div>
            </div>
          </div>
        </div>

        <form className="book-form reveal" onSubmit={submit}>
          <div className="row">
            <label>Nama Lengkap</label>
            <input
              required
              value={form.name}
              onChange={upd("name")}
              placeholder="Adelia Rahmadhani"
            />
          </div>
          <div className="row-2">
            <div className="row">
              <label>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={upd("email")}
                placeholder="kamu@gmail.com"
              />
            </div>
            <div className="row">
              <label>No. WhatsApp</label>
              <input
                required
                value={form.phone}
                onChange={upd("phone")}
                placeholder="0812-xxxx-xxxx"
              />
            </div>
          </div>
          <div className="row-2">
            <div className="row">
              <label>Pilih Paket</label>
              <select value={form.package} onChange={upd("package")}>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — IDR {p.amount}
                    {p.unit ? ` ${p.unit.replace(/[^a-z/ ]/gi, " ").trim()}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="row">
              <label>Tanggal Sesi</label>
              <input type="date" value={form.date} onChange={upd("date")} />
            </div>
          </div>
          <div className="row">
            <label>Kampus / Lokasi</label>
            <input
              value={form.campus}
              onChange={upd("campus")}
              placeholder="Universitas Riau, Pekanbaru"
            />
          </div>
          <div className="row">
            <label>Catatan Konsep (opsional)</label>
            <textarea
              rows="3"
              value={form.note}
              onChange={upd("note")}
              placeholder="Ceritakan jurusan, jumlah orang yang ikut, suasana yang diinginkan…"
            ></textarea>
          </div>

          {error && (
            <div className="book-error" style={{
              background:"rgba(255,80,80,.12)", border:"1px solid rgba(255,80,80,.4)",
              padding:"12px 16px", borderRadius:6, color:"#fbe0e0", fontSize:13
            }}>
              {error}
            </div>
          )}

          {sent ? (
            <div className="book-success">
              Terima kasih — kami akan balas dalam 6 jam.
            </div>
          ) : (
            <button type="submit" className="btn book-submit" disabled={submitting}>
              {submitting ? "Mengirim…" : (<>Kirim Permintaan <span className="arrow">→</span></>)}
            </button>
          )}
        </form>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase.js";

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      const tables = ["packages","portfolio","testimonials","process_steps","stats","marquee_items","nav_links","bookings"];
      const out = {};
      await Promise.all(tables.map(async (t) => {
        const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
        out[t] = count ?? 0;
      }));
      setCounts(out);

      const { data } = await supabase
        .from("bookings")
        .select("id,name,email,created_at,status")
        .order("created_at",{ascending:false})
        .limit(5);
      setRecent(data ?? []);
    })();
  }, []);

  const stat = (k, label) => (
    <div className="adm-card" style={{marginBottom:0}}>
      <div style={{fontSize:11,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(26,20,20,.55)"}}>{label}</div>
      <div style={{fontFamily:"var(--font-display)",fontSize:48,lineHeight:1,marginTop:6}}>{counts[k] ?? "—"}</div>
    </div>
  );

  return (
    <>
      <h1 className="adm-h">Dashboard</h1>
      <p className="adm-sub">Ringkasan konten dan permintaan booking terbaru.</p>

      <div className="adm-grid-3" style={{marginBottom:24}}>
        {stat("bookings", "Booking Masuk")}
        {stat("portfolio", "Foto Galeri")}
        {stat("testimonials", "Testimoni")}
      </div>
      <div className="adm-grid-3" style={{marginBottom:32}}>
        {stat("packages", "Paket")}
        {stat("process_steps", "Langkah Proses")}
        {stat("stats", "Statistik")}
      </div>

      <div className="adm-card">
        <h3>Booking terbaru</h3>
        {recent.length === 0 ? (
          <div className="adm-empty" style={{padding:24}}>Belum ada booking masuk.</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr><th>Tanggal</th><th>Nama</th><th>Email</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recent.map(b => (
                <tr key={b.id}>
                  <td>{new Date(b.created_at).toLocaleString("id-ID")}</td>
                  <td>{b.name}</td>
                  <td>{b.email}</td>
                  <td><span className={"adm-status " + b.status}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="adm-btn-row" style={{marginTop:14}}>
          <Link to="/admin/bookings" className="adm-btn ghost">Semua booking →</Link>
        </div>
      </div>
    </>
  );
}

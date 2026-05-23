import { useEffect, useState } from "react";
import { listBookings, updateBookingStatus, deleteBooking } from "../lib/api.js";

const STATUSES = ["new","contacted","scheduled","done","cancelled"];

export default function Bookings() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listBookings();
      setRows(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const onStatus = async (id, status) => {
    try { await updateBookingStatus(id, status); refresh(); }
    catch (e) { setError(e.message); }
  };

  const onDelete = async (id) => {
    if (!confirm("Hapus booking ini secara permanen?")) return;
    try { await deleteBooking(id); refresh(); }
    catch (e) { setError(e.message); }
  };

  return (
    <>
      <h1 className="adm-h">Bookings</h1>
      <p className="adm-sub">Semua permintaan booking yang masuk dari form publik.</p>

      {error && <div className="adm-error">{error}</div>}

      {loading ? (
        <div className="adm-sub">Memuat…</div>
      ) : rows.length === 0 ? (
        <div className="adm-empty">Belum ada booking masuk.</div>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Nama</th>
              <th>Kontak</th>
              <th>Paket</th>
              <th>Sesi</th>
              <th>Catatan</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(b => (
              <tr key={b.id}>
                <td>{new Date(b.created_at).toLocaleString("id-ID")}</td>
                <td>
                  <div style={{fontWeight:600}}>{b.name}</div>
                  <div style={{fontSize:11,color:"rgba(26,20,20,.55)"}}>{b.campus}</div>
                </td>
                <td>
                  <div>{b.email}</div>
                  <div style={{fontSize:11,color:"rgba(26,20,20,.55)"}}>{b.phone}</div>
                </td>
                <td>{b.packages?.name ?? b.package_id ?? "—"}</td>
                <td>{b.session_date ?? "—"}</td>
                <td style={{maxWidth:240,fontSize:12,color:"rgba(26,20,20,.7)"}}>{b.note}</td>
                <td>
                  <select value={b.status} onChange={(e)=>onStatus(b.id, e.target.value)}
                    style={{fontSize:11,padding:"4px 8px",border:"1px solid rgba(42,0,1,.18)",borderRadius:4}}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <button className="adm-btn danger" onClick={()=>onDelete(b.id)} style={{padding:"6px 10px",fontSize:10}}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

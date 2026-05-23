import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

const BLANK = { quote: "", name: "", meta: "", initial: "", position: 0 };

export default function Testimonials() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    const { data, error } = await supabase.from("testimonials").select("*").order("position");
    if (error) setError(error.message);
    else setRows(data);
  };
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    setError("");
    const payload = { ...editing };
    if (!payload.id) delete payload.id;
    const { error } = await supabase.from("testimonials").upsert(payload);
    if (error) setError(error.message);
    else { setEditing(null); refresh(); }
  };
  const remove = async (id) => {
    if (!confirm("Hapus testimoni ini?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) setError(error.message);
    else refresh();
  };

  return (
    <>
      <h1 className="adm-h">Testimoni <em>Klien</em></h1>
      <p className="adm-sub">Cerita dari klien yang sudah selesai dipotret.</p>
      {error && <div className="adm-error">{error}</div>}

      {editing ? (
        <div className="adm-card">
          <h3>{editing.id ? "Edit testimoni" : "Testimoni baru"}</h3>
          <div className="adm-row">
            <label>Kutipan</label>
            <textarea rows="4" value={editing.quote} onChange={(e)=>setEditing({...editing,quote:e.target.value})} />
          </div>
          <div className="adm-grid-3">
            <div className="adm-row"><label>Nama</label>
              <input value={editing.name} onChange={(e)=>setEditing({...editing,name:e.target.value})} /></div>
            <div className="adm-row"><label>Meta (jurusan, kampus)</label>
              <input value={editing.meta ?? ""} onChange={(e)=>setEditing({...editing,meta:e.target.value})} /></div>
            <div className="adm-row"><label>Inisial (untuk avatar)</label>
              <input maxLength={2} value={editing.initial ?? ""} onChange={(e)=>setEditing({...editing,initial:e.target.value})} /></div>
          </div>
          <div className="adm-row"><label>Posisi</label>
            <input type="number" value={editing.position} onChange={(e)=>setEditing({...editing,position:Number(e.target.value)})} /></div>
          <div className="adm-btn-row">
            <button className="adm-btn primary" onClick={save}>Simpan</button>
            <button className="adm-btn ghost" onClick={()=>setEditing(null)}>Batal</button>
          </div>
        </div>
      ) : (
        <>
          <div className="adm-btn-row" style={{marginBottom:16}}>
            <button className="adm-btn primary" onClick={()=>setEditing({...BLANK, position: rows.length})}>+ Tambah Testimoni</button>
          </div>
          <div className="adm-list">
            {rows.map(t => (
              <div key={t.id} className="adm-list-item">
                <div>
                  <div className="title">{t.name} <span style={{fontWeight:400,opacity:.6,fontSize:13}}>· {t.meta}</span></div>
                  <div className="meta">"{t.quote.slice(0,140)}{t.quote.length > 140 ? "…" : ""}"</div>
                </div>
                <div className="actions">
                  <button className="adm-btn ghost" onClick={()=>setEditing(t)}>Edit</button>
                  <button className="adm-btn danger" onClick={()=>remove(t.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

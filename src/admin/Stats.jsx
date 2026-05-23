import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

const BLANK = { n: "", em: "", l: "", position: 0 };

export default function Stats() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    const { data, error } = await supabase.from("stats").select("*").order("position");
    if (error) setError(error.message);
    else setRows(data);
  };
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    const payload = { ...editing };
    if (!payload.id) delete payload.id;
    const { error } = await supabase.from("stats").upsert(payload);
    if (error) setError(error.message);
    else { setEditing(null); refresh(); }
  };
  const remove = async (id) => {
    if (!confirm("Hapus statistik ini?")) return;
    const { error } = await supabase.from("stats").delete().eq("id", id);
    if (error) setError(error.message);
    else refresh();
  };

  return (
    <>
      <h1 className="adm-h">Statistik</h1>
      <p className="adm-sub">Angka-angka di bagian "Tentang Kami" (480+ wisudawan, 12 kampus, dll).</p>
      {error && <div className="adm-error">{error}</div>}

      {editing ? (
        <div className="adm-card">
          <h3>{editing.id ? "Edit statistik" : "Statistik baru"}</h3>
          <div className="adm-grid-3">
            <div className="adm-row"><label>Angka (n)</label>
              <input value={editing.n} onChange={(e)=>setEditing({...editing,n:e.target.value})} placeholder="480" /></div>
            <div className="adm-row"><label>Suffix italic (em)</label>
              <input value={editing.em ?? ""} onChange={(e)=>setEditing({...editing,em:e.target.value})} placeholder="+ / th / kosong" /></div>
            <div className="adm-row"><label>Posisi</label>
              <input type="number" value={editing.position} onChange={(e)=>setEditing({...editing,position:Number(e.target.value)})} /></div>
          </div>
          <div className="adm-row"><label>Label</label>
            <input value={editing.l} onChange={(e)=>setEditing({...editing,l:e.target.value})} placeholder="Wisudawan diabadikan" /></div>
          <div className="adm-btn-row">
            <button className="adm-btn primary" onClick={save}>Simpan</button>
            <button className="adm-btn ghost" onClick={()=>setEditing(null)}>Batal</button>
          </div>
        </div>
      ) : (
        <>
          <div className="adm-btn-row" style={{marginBottom:16}}>
            <button className="adm-btn primary" onClick={()=>setEditing({...BLANK, position: rows.length})}>+ Tambah</button>
          </div>
          <div className="adm-list">
            {rows.map(s => (
              <div key={s.id} className="adm-list-item">
                <div>
                  <div className="title">{s.n}{s.em ? <em style={{color:"var(--rose)"}}>{s.em}</em> : null} — {s.l}</div>
                  <div className="meta">pos {s.position}</div>
                </div>
                <div className="actions">
                  <button className="adm-btn ghost" onClick={()=>setEditing(s)}>Edit</button>
                  <button className="adm-btn danger" onClick={()=>remove(s.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

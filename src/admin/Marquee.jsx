import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { bustContentCache } from "../lib/contentCache.js";

const BLANK = { text: "", position: 0 };

export default function Marquee() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    const { data, error } = await supabase.from("marquee_items").select("*").order("position");
    if (error) setError(error.message);
    else setRows(data);
  };
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    const payload = { ...editing };
    if (!payload.id) delete payload.id;
    const { error } = await supabase.from("marquee_items").upsert(payload);
    if (error) setError(error.message);
    else { bustContentCache(); setEditing(null); refresh(); }
  };
  const remove = async (id) => {
    if (!confirm("Hapus item ini?")) return;
    const { error } = await supabase.from("marquee_items").delete().eq("id", id);
    if (error) setError(error.message);
    else { bustContentCache(); refresh(); }
  };

  return (
    <>
      <h1 className="adm-h">Marquee</h1>
      <p className="adm-sub">Kata-kata yang berjalan di strip antara hero dan paket.</p>
      {error && <div className="adm-error">{error}</div>}

      {editing ? (
        <div className="adm-card">
          <h3>{editing.id ? "Edit item" : "Item baru"}</h3>
          <div className="adm-grid-2">
            <div className="adm-row"><label>Teks</label>
              <input value={editing.text} onChange={(e)=>setEditing({...editing,text:e.target.value})} /></div>
            <div className="adm-row"><label>Posisi</label>
              <input type="number" value={editing.position} onChange={(e)=>setEditing({...editing,position:Number(e.target.value)})} /></div>
          </div>
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
            {rows.map(m => (
              <div key={m.id} className="adm-list-item">
                <div>
                  <div className="title">{m.text}</div>
                  <div className="meta">pos {m.position}</div>
                </div>
                <div className="actions">
                  <button className="adm-btn ghost" onClick={()=>setEditing(m)}>Edit</button>
                  <button className="adm-btn danger" onClick={()=>remove(m.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

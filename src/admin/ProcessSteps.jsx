import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { bustContentCache } from "../lib/contentCache.js";

const BLANK = { n: "", title: "", em: "", body: "", position: 0 };

export default function ProcessSteps() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    const { data, error } = await supabase.from("process_steps").select("*").order("position");
    if (error) setError(error.message);
    else setRows(data);
  };
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    setError("");
    const payload = { ...editing };
    if (!payload.id) delete payload.id;
    const { error } = await supabase.from("process_steps").upsert(payload);
    if (error) setError(error.message);
    else { bustContentCache(); setEditing(null); refresh(); }
  };
  const remove = async (id) => {
    if (!confirm("Hapus langkah ini?")) return;
    const { error } = await supabase.from("process_steps").delete().eq("id", id);
    if (error) setError(error.message);
    else { bustContentCache(); refresh(); }
  };

  return (
    <>
      <h1 className="adm-h">Proses <em>Kerja</em></h1>
      <p className="adm-sub">Empat langkah dari konsultasi hingga album dikirim.</p>
      {error && <div className="adm-error">{error}</div>}

      {editing ? (
        <div className="adm-card">
          <h3>{editing.id ? "Edit langkah" : "Langkah baru"}</h3>
          <div className="adm-grid-2">
            <div className="adm-row"><label>Nomor (cth. "01")</label>
              <input value={editing.n} onChange={(e)=>setEditing({...editing,n:e.target.value})} /></div>
            <div className="adm-row"><label>Judul lengkap</label>
              <input value={editing.title} onChange={(e)=>setEditing({...editing,title:e.target.value})} /></div>
            <div className="adm-row"><label>Italic display (em)</label>
              <input value={editing.em} onChange={(e)=>setEditing({...editing,em:e.target.value})} /></div>
            <div className="adm-row"><label>Posisi</label>
              <input type="number" value={editing.position} onChange={(e)=>setEditing({...editing,position:Number(e.target.value)})} /></div>
          </div>
          <div className="adm-row">
            <label>Body</label>
            <textarea rows="4" value={editing.body} onChange={(e)=>setEditing({...editing,body:e.target.value})} />
          </div>
          <div className="adm-btn-row">
            <button className="adm-btn primary" onClick={save}>Simpan</button>
            <button className="adm-btn ghost" onClick={()=>setEditing(null)}>Batal</button>
          </div>
        </div>
      ) : (
        <>
          <div className="adm-btn-row" style={{marginBottom:16}}>
            <button className="adm-btn primary" onClick={()=>setEditing({...BLANK, position: rows.length})}>+ Tambah Langkah</button>
          </div>
          <div className="adm-list">
            {rows.map(p => (
              <div key={p.id} className="adm-list-item">
                <div>
                  <div className="title">{p.n} · {p.title}</div>
                  <div className="meta">{p.body.slice(0, 110)}{p.body.length > 110 ? "…" : ""}</div>
                </div>
                <div className="actions">
                  <button className="adm-btn ghost" onClick={()=>setEditing(p)}>Edit</button>
                  <button className="adm-btn danger" onClick={()=>remove(p.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

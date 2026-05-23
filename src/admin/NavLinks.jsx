import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

const BLANK = { label: "", href: "", position: 0 };

export default function NavLinks() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    const { data, error } = await supabase.from("nav_links").select("*").order("position");
    if (error) setError(error.message);
    else setRows(data);
  };
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    const payload = { ...editing };
    if (!payload.id) delete payload.id;
    const { error } = await supabase.from("nav_links").upsert(payload);
    if (error) setError(error.message);
    else { setEditing(null); refresh(); }
  };
  const remove = async (id) => {
    if (!confirm("Hapus link ini?")) return;
    const { error } = await supabase.from("nav_links").delete().eq("id", id);
    if (error) setError(error.message);
    else refresh();
  };

  return (
    <>
      <h1 className="adm-h">Menu <em>Navigasi</em></h1>
      <p className="adm-sub">Item menu di header — Layanan, Galeri, Proses, Cerita.</p>
      {error && <div className="adm-error">{error}</div>}

      {editing ? (
        <div className="adm-card">
          <h3>{editing.id ? "Edit link" : "Link baru"}</h3>
          <div className="adm-grid-3">
            <div className="adm-row"><label>Label</label>
              <input value={editing.label} onChange={(e)=>setEditing({...editing,label:e.target.value})} /></div>
            <div className="adm-row"><label>Href</label>
              <input value={editing.href} onChange={(e)=>setEditing({...editing,href:e.target.value})} placeholder="#services" /></div>
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
            <button className="adm-btn primary" onClick={()=>setEditing({...BLANK, position: rows.length})}>+ Tambah Link</button>
          </div>
          <div className="adm-list">
            {rows.map(n => (
              <div key={n.id} className="adm-list-item">
                <div>
                  <div className="title">{n.label}</div>
                  <div className="meta">{n.href} · pos {n.position}</div>
                </div>
                <div className="actions">
                  <button className="adm-btn ghost" onClick={()=>setEditing(n)}>Edit</button>
                  <button className="adm-btn danger" onClick={()=>remove(n.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { bustContentCache } from "../lib/contentCache.js";

const BLANK = { key: "", label: "", position: 0 };

export default function Categories() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    const { data, error } = await supabase.from("portfolio_categories").select("*").order("position");
    if (error) setError(error.message);
    else setRows(data);
  };
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    setError("");
    const { error } = await supabase.from("portfolio_categories").upsert(editing);
    if (error) setError(error.message);
    else { bustContentCache(); setEditing(null); refresh(); }
  };
  const remove = async (key) => {
    if (key === "semua") return alert("Kategori 'semua' diperlukan untuk filter dan tidak boleh dihapus.");
    if (!confirm("Hapus kategori ini? Foto-foto yang menggunakan kategori ini juga akan terdampak.")) return;
    const { error } = await supabase.from("portfolio_categories").delete().eq("key", key);
    if (error) setError(error.message);
    else { bustContentCache(); refresh(); }
  };

  return (
    <>
      <h1 className="adm-h">Kategori <em>Galeri</em></h1>
      <p className="adm-sub">Filter di halaman galeri publik. Kategori "semua" diperlukan dan tidak boleh dihapus.</p>
      {error && <div className="adm-error">{error}</div>}

      {editing ? (
        <div className="adm-card">
          <h3>{rows.some(r => r.key === editing.key) ? "Edit kategori" : "Kategori baru"}</h3>
          <div className="adm-grid-3">
            <div className="adm-row"><label>Key (slug, lower-case)</label>
              <input value={editing.key} onChange={(e)=>setEditing({...editing,key:e.target.value})} placeholder="outdoor" /></div>
            <div className="adm-row"><label>Label tampil</label>
              <input value={editing.label} onChange={(e)=>setEditing({...editing,label:e.target.value})} placeholder="Outdoor" /></div>
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
            <button className="adm-btn primary" onClick={()=>setEditing({...BLANK, position: rows.length})}>+ Tambah Kategori</button>
          </div>
          <div className="adm-list">
            {rows.map(c => (
              <div key={c.key} className="adm-list-item">
                <div>
                  <div className="title">{c.label}</div>
                  <div className="meta">key: {c.key} · pos {c.position}</div>
                </div>
                <div className="actions">
                  <button className="adm-btn ghost" onClick={()=>setEditing(c)}>Edit</button>
                  <button className="adm-btn danger" onClick={()=>remove(c.key)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

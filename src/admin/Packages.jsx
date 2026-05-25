import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { bustContentCache } from "../lib/contentCache.js";

const BLANK = {
  id: "", name: "", italic: "", tagline: "", currency: "IDR",
  amount: "", unit: "k / sesi", featured: false, tag: "", features: [], position: 0,
};

export default function Packages() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    const { data, error } = await supabase.from("packages").select("*").order("position");
    if (error) setError(error.message);
    else setRows(data);
  };
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    setError("");
    try {
      const payload = { ...editing, features: editing.features.filter(f => f.trim()) };
      const { error } = await supabase.from("packages").upsert(payload);
      if (error) throw error;
      bustContentCache();
      setEditing(null);
      refresh();
    } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    if (!confirm("Hapus paket ini?")) return;
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) setError(error.message);
    else { bustContentCache(); refresh(); }
  };

  return (
    <>
      <h1 className="adm-h">Paket <em>Layanan</em></h1>
      <p className="adm-sub">Esensi, Anggun, Magnum — semua bisa diedit, ditambah, atau dihapus.</p>
      {error && <div className="adm-error">{error}</div>}

      {editing ? (
        <Editor row={editing} onChange={setEditing} onSave={save} onCancel={()=>setEditing(null)} />
      ) : (
        <>
          <div className="adm-btn-row" style={{marginBottom:16}}>
            <button className="adm-btn primary" onClick={()=>setEditing({...BLANK, position: rows.length})}>+ Tambah Paket</button>
          </div>
          <div className="adm-list">
            {rows.map(p => (
              <div key={p.id} className="adm-list-item">
                <div>
                  <div className="title">
                    {p.name} {p.italic && <em style={{color:"var(--maroon)"}}> · {p.italic}</em>}
                    {p.featured && <span className="adm-tag" style={{marginLeft:8}}>{p.tag || "featured"}</span>}
                  </div>
                  <div className="meta">{p.currency} {p.amount} {p.unit} · {p.features.length} fitur · pos {p.position}</div>
                </div>
                <div className="actions">
                  <button className="adm-btn ghost" onClick={()=>setEditing(p)}>Edit</button>
                  <button className="adm-btn danger" onClick={()=>remove(p.id)}>Hapus</button>
                </div>
              </div>
            ))}
            {rows.length === 0 && <div className="adm-empty">Belum ada paket.</div>}
          </div>
        </>
      )}
    </>
  );
}

function Editor({ row, onChange, onSave, onCancel }) {
  const upd = (k) => (e) => onChange({ ...row, [k]: e.target.value });
  const updNum = (k) => (e) => onChange({ ...row, [k]: Number(e.target.value) });
  const updBool = (k) => (e) => onChange({ ...row, [k]: e.target.checked });

  return (
    <div className="adm-card">
      <h3>{row.id ? `Edit: ${row.id}` : "Paket baru"}</h3>
      <div className="adm-grid-2">
        <div className="adm-row"><label>ID (slug, mis. anggun)</label>
          <input value={row.id} onChange={upd("id")} placeholder="anggun" /></div>
        <div className="adm-row"><label>Nama tampil</label>
          <input value={row.name} onChange={upd("name")} /></div>
        <div className="adm-row"><label>Italic (mis. "Cum Laude" — opsional)</label>
          <input value={row.italic ?? ""} onChange={upd("italic")} /></div>
        <div className="adm-row"><label>Tagline</label>
          <input value={row.tagline ?? ""} onChange={upd("tagline")} /></div>
        <div className="adm-row"><label>Currency</label>
          <input value={row.currency} onChange={upd("currency")} /></div>
        <div className="adm-row"><label>Amount</label>
          <input value={row.amount} onChange={upd("amount")} placeholder="2.850" /></div>
        <div className="adm-row"><label>Unit (mis. "k / sesi")</label>
          <input value={row.unit} onChange={upd("unit")} /></div>
        <div className="adm-row"><label>Tag (mis. "Populer" — opsional)</label>
          <input value={row.tag ?? ""} onChange={upd("tag")} /></div>
        <div className="adm-row checkbox">
          <input id="featured" type="checkbox" checked={!!row.featured} onChange={updBool("featured")} />
          <label htmlFor="featured">Featured (kartu maroon)</label>
        </div>
        <div className="adm-row"><label>Posisi (urutan tampil)</label>
          <input type="number" value={row.position} onChange={updNum("position")} /></div>
      </div>

      <div className="adm-row">
        <label>Fitur</label>
        <div className="feat-list">
          {row.features.map((f, i) => (
            <div className="feat-row" key={i}>
              <input value={f} onChange={(e)=>{
                const next = [...row.features]; next[i] = e.target.value; onChange({...row, features: next});
              }} />
              <button onClick={()=>{
                const next = row.features.filter((_,j)=>j!==i); onChange({...row, features: next});
              }} title="Hapus baris">×</button>
            </div>
          ))}
          <button className="adm-btn ghost" onClick={()=>onChange({...row, features:[...row.features, ""]})}>
            + Tambah fitur
          </button>
        </div>
      </div>

      <div className="adm-btn-row">
        <button className="adm-btn primary" onClick={onSave}>Simpan</button>
        <button className="adm-btn ghost" onClick={onCancel}>Batal</button>
      </div>
    </div>
  );
}

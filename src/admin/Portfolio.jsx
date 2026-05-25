import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { uploadImage, uploadVideo } from "../lib/api.js";
import { bustContentCache } from "../lib/contentCache.js";

const SPANS = ["s-3x4","s-3x5","s-3x6","s-4x5","s-4x6","s-5x5","s-6x4","s-2x4","s-2x3","s-6x5","s-3x3"];
const BLANK = { cat: "outdoor", title: "", sub: "", span: "s-4x5", img: "", video: "", position: 0 };

export default function Portfolio() {
  const [rows, setRows] = useState([]);
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const refresh = async () => {
    const [{ data: items }, { data: c }] = await Promise.all([
      supabase.from("portfolio").select("*").order("position"),
      supabase.from("portfolio_categories").select("*").order("position"),
    ]);
    setRows(items ?? []);
    setCats((c ?? []).filter(x => x.key !== "semua"));
  };
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    setError("");
    try {
      const payload = { ...editing };
      if (!payload.id) delete payload.id;
      // Simpan null (bukan string kosong) supaya UI publik tidak salah deteksi
      payload.video = payload.video?.trim() ? payload.video.trim() : null;
      const { error } = await supabase.from("portfolio").upsert(payload);
      if (error) throw error;
      bustContentCache();
      setEditing(null);
      refresh();
    } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) setError(error.message);
    else { bustContentCache(); refresh(); }
  };

  const handleUpload = async (file) => {
    setUploading(true); setError("");
    try {
      const url = await uploadImage(file, "portfolio");
      setEditing({ ...editing, img: url });
    } catch (e) { setError(e.message); }
    finally { setUploading(false); }
  };

  const handleUploadVideo = async (file) => {
    setUploadingVideo(true); setError("");
    try {
      const url = await uploadVideo(file, "portfolio-videos");
      setEditing({ ...editing, video: url });
    } catch (e) { setError(e.message); }
    finally { setUploadingVideo(false); }
  };

  return (
    <>
      <h1 className="adm-h">Galeri <em>Portfolio</em></h1>
      <p className="adm-sub">Foto-foto karya — unggah gambar, atur kategori, ukuran grid, dan urutan tampil.</p>
      {error && <div className="adm-error">{error}</div>}

      {editing ? (
        <div className="adm-card">
          <h3>{editing.id ? "Edit foto" : "Foto baru"}</h3>
          <div className="adm-grid-2">
            <div className="adm-row"><label>Judul</label>
              <input value={editing.title} onChange={(e)=>setEditing({...editing,title:e.target.value})} /></div>
            <div className="adm-row"><label>Subjudul (cth. "UNRI · 2025")</label>
              <input value={editing.sub ?? ""} onChange={(e)=>setEditing({...editing,sub:e.target.value})} /></div>
            <div className="adm-row"><label>Kategori</label>
              <select value={editing.cat} onChange={(e)=>setEditing({...editing,cat:e.target.value})}>
                {cats.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select></div>
            <div className="adm-row"><label>Span Grid</label>
              <select value={editing.span} onChange={(e)=>setEditing({...editing,span:e.target.value})}>
                {SPANS.map(s => <option key={s} value={s}>{s}</option>)}
              </select></div>
            <div className="adm-row"><label>Posisi</label>
              <input type="number" value={editing.position} onChange={(e)=>setEditing({...editing,position:Number(e.target.value)})} /></div>
          </div>

          <div className="adm-row">
            <label>URL Gambar (poster / thumbnail)</label>
            <input value={editing.img} onChange={(e)=>setEditing({...editing,img:e.target.value})} placeholder="https://… atau hasil upload" />
          </div>
          {editing.img && (
            <div style={{
              marginTop:8,height:200,borderRadius:6,
              backgroundImage:`url(${editing.img})`,backgroundSize:"cover",backgroundPosition:"center",
              border:"1px solid rgba(42,0,1,.1)"
            }}/>
          )}
          <div className="adm-btn-row" style={{marginTop:8}}>
            <label className="adm-btn ghost" style={{cursor:"pointer"}}>
              {uploading ? "Mengunggah…" : "Unggah gambar"}
              <input type="file" accept="image/*" style={{display:"none"}}
                onChange={(e)=>e.target.files?.[0] && handleUpload(e.target.files[0])} />
            </label>
          </div>

          <div className="adm-row" style={{marginTop:18}}>
            <label>URL Video (opsional — mp4)</label>
            <input
              value={editing.video ?? ""}
              onChange={(e)=>setEditing({...editing,video:e.target.value})}
              placeholder="Kosongkan kalau cuma foto. Isi untuk item cinematic."
            />
            <small style={{display:"block",marginTop:4,color:"rgba(42,0,1,.55)"}}>
              Kalau diisi, item ini muter otomatis (loop, tanpa suara) di galeri. Klik untuk buka lightbox dengan kontrol suara.
            </small>
          </div>
          {editing.video && (
            <video
              src={editing.video}
              controls
              playsInline
              style={{marginTop:8,width:"100%",maxHeight:240,borderRadius:6,background:"#000"}}
            />
          )}
          <div className="adm-btn-row" style={{marginTop:8}}>
            <label className="adm-btn ghost" style={{cursor:"pointer"}}>
              {uploadingVideo ? "Mengunggah video…" : "Unggah video (mp4)"}
              <input type="file" accept="video/mp4,video/webm,video/quicktime" style={{display:"none"}}
                onChange={(e)=>e.target.files?.[0] && handleUploadVideo(e.target.files[0])} />
            </label>
            {editing.video && (
              <button
                type="button"
                className="adm-btn danger"
                onClick={()=>setEditing({...editing,video:""})}
              >Hapus video</button>
            )}
          </div>

          <div className="adm-btn-row" style={{marginTop:14}}>
            <button className="adm-btn primary" onClick={save}>Simpan</button>
            <button className="adm-btn ghost" onClick={()=>setEditing(null)}>Batal</button>
          </div>
        </div>
      ) : (
        <>
          <div className="adm-btn-row" style={{marginBottom:16}}>
            <button className="adm-btn primary" onClick={()=>setEditing({...BLANK, position: rows.length})}>+ Tambah Foto</button>
          </div>
          <div className="adm-list">
            {rows.map(p => (
              <div key={p.id} className="adm-list-item">
                <div style={{display:"flex",gap:14,alignItems:"center"}}>
                  <div className="adm-list-thumb" style={{backgroundImage:`url(${p.img})`}} />
                  <div>
                    <div className="title">
                      {p.title}
                      {p.video && (
                        <span style={{
                          marginLeft:8,fontSize:10,letterSpacing:".15em",textTransform:"uppercase",
                          padding:"2px 6px",borderRadius:3,background:"#2a0001",color:"#fff",verticalAlign:"middle"
                        }}>▶ video</span>
                      )}
                    </div>
                    <div className="meta">{p.sub} · {p.cat} · {p.span} · pos {p.position}</div>
                  </div>
                </div>
                <div className="actions">
                  <button className="adm-btn ghost" onClick={()=>setEditing(p)}>Edit</button>
                  <button className="adm-btn danger" onClick={()=>remove(p.id)}>Hapus</button>
                </div>
              </div>
            ))}
            {rows.length === 0 && <div className="adm-empty">Belum ada foto.</div>}
          </div>
        </>
      )}
    </>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  const [filter, setFilter] = useState("semua");
  const [viewMode, setViewMode] = useState("collage");
  const [saving, setSaving] = useState(false);

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

  const visibleRows = useMemo(
    () => (filter === "semua" ? rows : rows.filter(r => r.cat === filter)),
    [rows, filter]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // When user drops an item, we keep the *set of positions* that the filtered
  // subset already occupies and just reassign them in the new visual order.
  // This way reordering within one category never disturbs items in other
  // categories (their global positions stay untouched).
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = visibleRows.findIndex(r => r.id === active.id);
    const newIdx = visibleRows.findIndex(r => r.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;

    const positions = visibleRows.map(r => r.position);
    const reordered = arrayMove(visibleRows, oldIdx, newIdx);
    const updates = reordered
      .map((row, i) => ({ id: row.id, position: positions[i] }))
      .filter((u, i) => visibleRows[i].id !== u.id);

    if (updates.length === 0) return;

    const updatedById = new Map(updates.map(u => [u.id, u.position]));
    setRows(prev =>
      prev
        .map(r => updatedById.has(r.id) ? { ...r, position: updatedById.get(r.id) } : r)
        .sort((a, b) => a.position - b.position)
    );

    setSaving(true);
    setError("");
    try {
      await Promise.all(updates.map(u =>
        supabase.from("portfolio").update({ position: u.position }).eq("id", u.id)
      ));
      bustContentCache();
    } catch (e) {
      setError(e.message);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h1 className="adm-h">Galeri <em>Portfolio</em></h1>
      <p className="adm-sub">Foto-foto karya — tarik untuk atur urutan kolase, klik untuk edit.</p>
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
            <div className="adm-row"><label>Span Grid (ukuran ubin)</label>
              <select value={editing.span} onChange={(e)=>setEditing({...editing,span:e.target.value})}>
                {SPANS.map(s => <option key={s} value={s}>{s}</option>)}
              </select></div>
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
          <div className="adm-toolbar">
            <div className="adm-toolbar-left">
              <button className="adm-btn primary" onClick={()=>setEditing({...BLANK, position: rows.length})}>+ Tambah Foto</button>
              {saving && <span className="adm-saving-tag">Menyimpan tata letak…</span>}
            </div>
            <div className="adm-seg">
              <button
                className={"adm-seg-btn " + (viewMode === "collage" ? "active" : "")}
                onClick={()=>setViewMode("collage")}
              >Kolase</button>
              <button
                className={"adm-seg-btn " + (viewMode === "list" ? "active" : "")}
                onClick={()=>setViewMode("list")}
              >List</button>
            </div>
          </div>

          <div className="adm-filters">
            <button
              className={"adm-chip " + (filter === "semua" ? "active" : "")}
              onClick={()=>setFilter("semua")}
            >Semua</button>
            {cats.map(c => (
              <button
                key={c.key}
                className={"adm-chip " + (filter === c.key ? "active" : "")}
                onClick={()=>setFilter(c.key)}
              >{c.label}</button>
            ))}
          </div>

          <p className="adm-hint">
            Tarik ubin untuk atur urutan. Ubah ukuran ubin lewat tombol <em>Edit</em>.
            {filter !== "semua" && " Urutan kategori lain tidak terganggu."}
          </p>

          {visibleRows.length === 0 ? (
            <div className="adm-empty">Belum ada foto di kategori ini.</div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={visibleRows.map(r => r.id)} strategy={rectSortingStrategy}>
                {viewMode === "collage" ? (
                  <div className="adm-collage">
                    {visibleRows.map(p => (
                      <CollageTile
                        key={p.id}
                        item={p}
                        onEdit={()=>setEditing(p)}
                        onDelete={()=>remove(p.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="adm-list">
                    {visibleRows.map(p => (
                      <ListRow
                        key={p.id}
                        item={p}
                        onEdit={()=>setEditing(p)}
                        onDelete={()=>remove(p.id)}
                      />
                    ))}
                  </div>
                )}
              </SortableContext>
            </DndContext>
          )}
        </>
      )}
    </>
  );
}

function CollageTile({ item, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 20 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={"adm-tile " + item.span + (isDragging ? " dragging" : "")}
      {...attributes}
      {...listeners}
    >
      {item.video ? (
        <video src={item.video} poster={item.img} muted playsInline preload="metadata" />
      ) : (
        <img src={item.img} alt={item.title} loading="lazy" />
      )}
      {item.video && <span className="adm-tile-badge">▶ video</span>}
      <div className="adm-tile-overlay">
        <div className="adm-tile-meta">
          <div className="adm-tile-title">{item.title || "(tanpa judul)"}</div>
          <div className="adm-tile-sub">{item.sub} · {item.span} · pos {item.position}</div>
        </div>
        <div className="adm-tile-actions">
          <button
            type="button"
            className="adm-btn ghost small"
            onPointerDown={(e)=>e.stopPropagation()}
            onClick={onEdit}
          >Edit</button>
          <button
            type="button"
            className="adm-btn danger small"
            onPointerDown={(e)=>e.stopPropagation()}
            onClick={onDelete}
          >Hapus</button>
        </div>
      </div>
    </div>
  );
}

function ListRow({ item, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 20 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="adm-list-item">
      <div style={{display:"flex",gap:14,alignItems:"center"}}>
        <button
          type="button"
          className="adm-drag-handle"
          aria-label="Drag untuk atur urutan"
          {...attributes}
          {...listeners}
        >⋮⋮</button>
        <div className="adm-list-thumb" style={{backgroundImage:`url(${item.img})`}} />
        <div>
          <div className="title">
            {item.title}
            {item.video && (
              <span style={{
                marginLeft:8,fontSize:10,letterSpacing:".15em",textTransform:"uppercase",
                padding:"2px 6px",borderRadius:3,background:"#2a0001",color:"#fff",verticalAlign:"middle"
              }}>▶ video</span>
            )}
          </div>
          <div className="meta">{item.sub} · {item.cat} · {item.span} · pos {item.position}</div>
        </div>
      </div>
      <div className="actions">
        <button className="adm-btn ghost" onClick={onEdit}>Edit</button>
        <button className="adm-btn danger" onClick={onDelete}>Hapus</button>
      </div>
    </div>
  );
}

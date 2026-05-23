import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { uploadImage } from "../lib/api.js";

const FIELDS = [
  ["brand",            "Brand", "text"],
  ["est",              "Eyebrow (Est.)", "text"],
  ["whatsapp_phone",   "WhatsApp Phone (cth 6281288880188)", "text"],
  ["whatsapp_message", "Pesan default WhatsApp", "textarea"],
  ["email",            "Email", "text"],
  ["address_line1",    "Alamat (baris 1)", "text"],
  ["address_line2",    "Alamat (baris 2)", "text"],
  ["hours",            "Jam Studio", "text"],
  ["hero_description", "Hero — deskripsi", "textarea"],
  ["about_body",       "About — body", "textarea"],
  ["footer_tagline",   "Footer tagline", "textarea"],
  ["copyright",        "Copyright", "text"],
  ["instagram_url",    "URL Instagram", "text"],
  ["tiktok_url",       "URL TikTok", "text"],
  ["youtube_url",      "URL YouTube", "text"],
];

export default function SiteSettings() {
  const [row, setRow] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [uploadingKey, setUploadingKey] = useState(null);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRow(data ?? { id: 1 });
      });
  }, []);

  if (!row) return <div className="adm-sub">Memuat…</div>;

  const upd = (k) => (e) => setRow({ ...row, [k]: e.target.value });

  const save = async () => {
    setBusy(true); setError(""); setOk("");
    try {
      const { error } = await supabase.from("site_settings").upsert({ ...row, id: 1 });
      if (error) throw error;
      setOk("Tersimpan.");
      setTimeout(() => setOk(""), 3000);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const uploadFor = async (key, file) => {
    setUploadingKey(key); setError("");
    try {
      const url = await uploadImage(file, key);
      setRow({ ...row, [key]: url });
    } catch (e) { setError(e.message); }
    finally { setUploadingKey(null); }
  };

  return (
    <>
      <h1 className="adm-h">Site <em>Settings</em></h1>
      <p className="adm-sub">Pengaturan global situs — brand, kontak, copy text, gambar hero & about.</p>

      {error && <div className="adm-error">{error}</div>}
      {ok && <div className="adm-success">{ok}</div>}

      <div className="adm-card">
        <h3>Gambar utama</h3>
        <div className="adm-grid-2">
          <ImageField label="Hero Background" value={row.hero_bg} onChange={(v)=>setRow({...row,hero_bg:v})}
            onUpload={(f)=>uploadFor("hero_bg", f)} uploading={uploadingKey==="hero_bg"} />
          <ImageField label="About Image" value={row.about_img} onChange={(v)=>setRow({...row,about_img:v})}
            onUpload={(f)=>uploadFor("about_img", f)} uploading={uploadingKey==="about_img"} />
        </div>
      </div>

      <div className="adm-card">
        <h3>Detail brand & kontak</h3>
        {FIELDS.map(([k, label, type]) => (
          <div key={k} className="adm-row">
            <label>{label}</label>
            {type === "textarea"
              ? <textarea value={row[k] ?? ""} onChange={upd(k)} />
              : <input type={type} value={row[k] ?? ""} onChange={upd(k)} />
            }
          </div>
        ))}
      </div>

      <div className="adm-btn-row">
        <button className="adm-btn primary" onClick={save} disabled={busy}>
          {busy ? "Menyimpan…" : "Simpan Perubahan"}
        </button>
      </div>
    </>
  );
}

function ImageField({ label, value, onChange, onUpload, uploading }) {
  return (
    <div>
      <div className="adm-row">
        <label>{label}</label>
        <input value={value ?? ""} onChange={(e)=>onChange(e.target.value)} placeholder="https://…" />
      </div>
      {value && (
        <div style={{
          marginTop:8,height:140,borderRadius:6,
          backgroundImage:`url(${value})`,backgroundSize:"cover",backgroundPosition:"center",
          border:"1px solid rgba(42,0,1,.1)"
        }}/>
      )}
      <div className="adm-btn-row">
        <label className="adm-btn ghost" style={{cursor:"pointer"}}>
          {uploading ? "Mengunggah…" : "Unggah gambar"}
          <input type="file" accept="image/*" style={{display:"none"}}
            onChange={(e)=>e.target.files?.[0] && onUpload(e.target.files[0])} />
        </label>
      </div>
    </div>
  );
}

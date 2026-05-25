import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { uploadImage } from "../lib/api.js";
import { bustContentCache } from "../lib/contentCache.js";

const BRAND_FIELDS = [
  ["brand",            "Brand", "text"],
  ["est",              "Eyebrow (Est.)", "text"],
  ["whatsapp_phone",   "WhatsApp Phone (cth 6281288880188)", "text"],
  ["whatsapp_message", "Pesan default WhatsApp", "textarea"],
  ["email",            "Email", "text"],
  ["address_line1",    "Alamat (baris 1)", "text"],
  ["address_line2",    "Alamat (baris 2)", "text"],
  ["hours",            "Jam Studio", "text"],
  ["instagram_url",    "URL Instagram", "text"],
  ["tiktok_url",       "URL TikTok", "text"],
  ["youtube_url",      "URL YouTube", "text"],
  ["footer_tagline",   "Footer tagline", "textarea"],
  ["copyright",        "Copyright", "text"],
];

// Section copy cards — every group below renders inside its own card.
// type "rich" = textarea + small helper note for the \n / *kata* syntax.
const SECTION_CARDS = [
  {
    title: "Hero",
    fields: [
      ["hero_title",       "Hero — Title",        "rich"],
      ["hero_description", "Hero — Description",  "textarea"],
    ],
  },
  {
    title: "Services (Paket Layanan)",
    fields: [
      ["services_eyebrow", "Eyebrow",     "text"],
      ["services_title",   "Title",       "rich"],
      ["services_lede",    "Description", "textarea"],
    ],
  },
  {
    title: "Portfolio (Galeri)",
    fields: [
      ["portfolio_eyebrow", "Eyebrow", "text"],
      ["portfolio_title",   "Title",   "rich"],
    ],
  },
  {
    title: "About (Tentang)",
    fields: [
      ["about_eyebrow", "Eyebrow",    "text"],
      ["about_title",   "Title",      "rich"],
      ["about_body",    "Body",       "textarea"],
    ],
  },
  {
    title: "Process (Proses Kerja)",
    fields: [
      ["process_eyebrow", "Eyebrow", "text"],
      ["process_title",   "Title",   "rich"],
    ],
  },
  {
    title: "Testimonials (Cerita Klien)",
    fields: [
      ["testi_eyebrow", "Eyebrow", "text"],
      ["testi_title",   "Title",   "rich"],
    ],
  },
  {
    title: "Booking",
    fields: [
      ["booking_eyebrow", "Eyebrow",     "text"],
      ["booking_title",   "Title",       "rich"],
      ["booking_lede",    "Description", "textarea"],
    ],
  },
];

const RICH_HINT =
  "Tips: pakai baris baru (Enter) untuk ganti baris, dan *kata* untuk italic warna emas. Contoh: Toga, tirai,⏎dan *cahaya*⏎terakhir.";

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
      bustContentCache();
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
      <p className="adm-sub">Pengaturan global situs — brand, kontak, copy text per section, gambar hero & about.</p>

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
        {BRAND_FIELDS.map(([k, label, type]) => (
          <Field key={k} k={k} label={label} type={type} value={row[k]} onChange={upd(k)} />
        ))}
      </div>

      {SECTION_CARDS.map((card) => (
        <div key={card.title} className="adm-card">
          <h3>{card.title}</h3>
          {card.fields.map(([k, label, type]) => (
            <Field key={k} k={k} label={label} type={type} value={row[k]} onChange={upd(k)} />
          ))}
        </div>
      ))}

      <div className="adm-btn-row">
        <button className="adm-btn primary" onClick={save} disabled={busy}>
          {busy ? "Menyimpan…" : "Simpan Perubahan"}
        </button>
      </div>
    </>
  );
}

function Field({ k, label, type, value, onChange }) {
  const isRich  = type === "rich";
  const isArea  = isRich || type === "textarea";
  return (
    <div className="adm-row">
      <label>{label}</label>
      {isArea
        ? <textarea
            rows={isRich ? 4 : 3}
            value={value ?? ""}
            onChange={onChange}
          />
        : <input type={type} value={value ?? ""} onChange={onChange} />
      }
      {isRich && (
        <small style={{
          fontSize:11, color:"rgba(26,20,20,.55)",
          letterSpacing:".03em", marginTop:4, display:"block"
        }}>
          {RICH_HINT}
        </small>
      )}
    </div>
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

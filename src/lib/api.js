import { supabase, isSupabaseConfigured } from "./supabase.js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabaseConfig.js";
import { bustContentCache } from "./contentCache.js";

// Match the Supabase Free-plan default global file_size_limit. If you bump the
// bucket limit in Supabase Dashboard → Storage → images → Configuration, also
// update this constant — it's only the client-side guard, not the source of truth.
export const MAX_VIDEO_MB = 50;
export const MAX_IMAGE_MB = 10;

// ---------- READ ----------
async function readOrdered(table) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return data;
}

export async function loadSiteSettings() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export const loadPackages            = () => readOrdered("packages");
export const loadPortfolio           = () => readOrdered("portfolio");
export const loadPortfolioCategories = () => readOrdered("portfolio_categories");
export const loadProcessSteps        = () => readOrdered("process_steps");
export const loadTestimonials        = () => readOrdered("testimonials");
export const loadStats               = () => readOrdered("stats");
export const loadMarqueeItems        = () => readOrdered("marquee_items");
export const loadNavLinks            = () => readOrdered("nav_links");

export async function loadAll() {
  if (!isSupabaseConfigured) return null;
  const [
    site, packages, portfolio, portfolioCategories,
    process, testimonials, stats, marquee, nav
  ] = await Promise.all([
    loadSiteSettings(),
    loadPackages(),
    loadPortfolio(),
    loadPortfolioCategories(),
    loadProcessSteps(),
    loadTestimonials(),
    loadStats(),
    loadMarqueeItems(),
    loadNavLinks(),
  ]);
  return { site, packages, portfolio, portfolioCategories, process, testimonials, stats, marquee, nav };
}

// ---------- BOOKINGS (public insert) ----------
export async function submitBooking(payload) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase belum dikonfigurasi. Lengkapi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY pada .env");
  }
  const { error } = await supabase.from("bookings").insert({
    name:          payload.name,
    email:         payload.email || null,
    phone:         payload.phone || null,
    package_id:    payload.package || null,
    session_date:  payload.date || null,
    campus:        payload.campus || null,
    note:          payload.note || null,
  });
  if (error) throw error;
}

export async function listBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, packages(name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateBookingStatus(id, status) {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteBooking(id) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Generic CRUD helpers used by admin pages ----------
// Every mutation that changes published content also drops the public
// cache so the next public refresh re-fetches instead of showing stale
// data through the cache-first hydration in ContentContext.
export async function upsertRow(table, row, opts = {}) {
  const { data, error } = await supabase
    .from(table)
    .upsert(row, opts)
    .select()
    .single();
  if (error) throw error;
  bustContentCache();
  return data;
}

export async function insertRow(table, row) {
  const { data, error } = await supabase
    .from(table)
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  bustContentCache();
  return data;
}

export async function updateRow(table, id, patch, idField = "id") {
  const { data, error } = await supabase
    .from(table)
    .update(patch)
    .eq(idField, id)
    .select()
    .single();
  if (error) throw error;
  bustContentCache();
  return data;
}

export async function deleteRow(table, id, idField = "id") {
  const { error } = await supabase.from(table).delete().eq(idField, id);
  if (error) throw error;
  bustContentCache();
}

// ---------- Image upload to Storage bucket 'images' ----------
export async function uploadImage(file, folder = "uploads") {
  if (!isSupabaseConfigured) throw new Error("Supabase belum dikonfigurasi.");
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    throw new Error(`Gambar terlalu besar. Maks ${MAX_IMAGE_MB} MB, file kamu ${(file.size / 1024 / 1024).toFixed(1)} MB.`);
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error: upErr } = await supabase.storage
    .from("images")
    .upload(path, file, { upsert: false, cacheControl: "3600" });
  if (upErr) throw upErr;
  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Video upload (same 'images' bucket, separate folder) ----------
// XHR-based so we can stream upload progress to the UI. supabase-js v2 still
// uses fetch under the hood with no progress callback, so this talks to the
// Storage REST endpoint directly with the user's session JWT.
export async function uploadVideo(file, folder = "portfolio-videos", onProgress) {
  if (!isSupabaseConfigured) throw new Error("Supabase belum dikonfigurasi.");
  if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
    throw new Error(`Video terlalu besar. Maks ${MAX_VIDEO_MB} MB, file kamu ${(file.size / 1024 / 1024).toFixed(1)} MB.`);
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("Sesi admin habis. Silakan login ulang.");

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const endpoint = `${SUPABASE_URL}/storage/v1/object/images/${path}`;

  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY);
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
    xhr.setRequestHeader("Cache-Control", "3600");
    xhr.setRequestHeader("x-upsert", "false");

    if (typeof onProgress === "function") {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) onProgress(e.loaded / e.total, e.loaded, e.total);
      });
    }
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let msg = `Upload gagal (HTTP ${xhr.status}).`;
      try {
        const body = JSON.parse(xhr.responseText);
        if (body?.message) msg = body.message;
        else if (body?.error) msg = body.error;
      } catch { /* keep default */ }
      if (xhr.status === 413) msg = `Video melebihi batas server. Coba kompres jadi <${MAX_VIDEO_MB} MB.`;
      reject(new Error(msg));
    });
    xhr.addEventListener("error", () => reject(new Error("Koneksi terputus saat mengunggah.")));
    xhr.addEventListener("abort", () => reject(new Error("Unggahan dibatalkan.")));
    xhr.send(file);
  });

  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}

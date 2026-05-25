import { supabase, isSupabaseConfigured } from "./supabase.js";
import { bustContentCache } from "./contentCache.js";

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
export async function uploadVideo(file, folder = "portfolio-videos") {
  if (!isSupabaseConfigured) throw new Error("Supabase belum dikonfigurasi.");
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error: upErr } = await supabase.storage
    .from("images")
    .upload(path, file, {
      upsert: false,
      cacheControl: "3600",
      contentType: file.type || "video/mp4",
    });
  if (upErr) throw upErr;
  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabaseConfig";

const url = SUPABASE_URL;
const anonKey = SUPABASE_ANON_KEY;

// When credentials aren't configured, the site still renders using the static
// fallback content defined in src/data/content.js. The CMS pages will surface
// a friendly error instead.
export const isSupabaseConfigured =
  Boolean(url && anonKey) &&
  !url.includes("xxxxxxxxxxxx") &&
  !anonKey.includes("xxxxxxxxxxxx");

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

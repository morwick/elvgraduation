// Persistent cache of the public site's content payload so the page can
// hydrate instantly on refresh without flashing the hard-coded fallback
// content from src/data/content.js.

const KEY = "elv.content.v1";

export function readContentCache() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeContentCache(content) {
  try {
    localStorage.setItem(KEY, JSON.stringify(content));
  } catch {
    // quota or serialization errors — safe to ignore, the next fetch will
    // still populate state in memory.
  }
}

export function bustContentCache() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

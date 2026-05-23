import { createContext, useContext, useEffect, useState } from "react";
import { loadAll } from "../lib/api.js";
import { isSupabaseConfigured } from "../lib/supabase.js";
import {
  SITE as FALLBACK_SITE,
  HERO_BG as FALLBACK_HERO_BG,
  ABOUT_IMG as FALLBACK_ABOUT_IMG,
  PACKAGES as FALLBACK_PACKAGES,
  PORTFOLIO as FALLBACK_PORTFOLIO,
  PORTFOLIO_CATEGORIES as FALLBACK_PORTFOLIO_CATEGORIES,
  PROCESS as FALLBACK_PROCESS,
  TESTIMONIALS as FALLBACK_TESTIMONIALS,
  STATS as FALLBACK_STATS,
  MARQUEE_ITEMS as FALLBACK_MARQUEE,
  NAV_LINKS as FALLBACK_NAV,
} from "../data/content.js";

const ContentContext = createContext(null);

// Map a site_settings DB row to the shape used by the components.
function mapSite(row) {
  if (!row) return FALLBACK_SITE;
  return {
    brand:            row.brand ?? FALLBACK_SITE.brand,
    whatsappPhone:    row.whatsapp_phone ?? FALLBACK_SITE.whatsappPhone,
    whatsappMessage:  row.whatsapp_message ?? FALLBACK_SITE.whatsappMessage,
    email:            row.email ?? FALLBACK_SITE.email,
    address:          {
      line1: row.address_line1 ?? FALLBACK_SITE.address.line1,
      line2: row.address_line2 ?? FALLBACK_SITE.address.line2,
    },
    hours:            row.hours ?? FALLBACK_SITE.hours,
    est:              row.est ?? FALLBACK_SITE.est,
    heroDescription:  row.hero_description ?? "",
    aboutBody:        row.about_body ?? "",
    footerTagline:    row.footer_tagline ?? "",
    copyright:        row.copyright ?? "",
    instagramUrl:     row.instagram_url ?? "#",
    tiktokUrl:        row.tiktok_url ?? "#",
    youtubeUrl:       row.youtube_url ?? "#",
  };
}

const DEFAULT_CONTENT = {
  site: FALLBACK_SITE,
  heroBg: FALLBACK_HERO_BG,
  aboutImg: FALLBACK_ABOUT_IMG,
  packages: FALLBACK_PACKAGES,
  portfolio: FALLBACK_PORTFOLIO,
  portfolioCategories: FALLBACK_PORTFOLIO_CATEGORIES,
  process: FALLBACK_PROCESS,
  testimonials: FALLBACK_TESTIMONIALS,
  stats: FALLBACK_STATS,
  marquee: FALLBACK_MARQUEE,
  nav: FALLBACK_NAV,
};

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    let cancelled = false;
    if (!isSupabaseConfigured) return;

    loadAll()
      .then((d) => {
        if (cancelled || !d) return;
        setContent({
          site: {
            ...mapSite(d.site),
            // pass through everything mapSite returned but also expose the raw row
            // for places that want extra fields.
          },
          heroBg:   d.site?.hero_bg   || FALLBACK_HERO_BG,
          aboutImg: d.site?.about_img || FALLBACK_ABOUT_IMG,
          packages:            d.packages?.length            ? d.packages.map(mapPackage)               : FALLBACK_PACKAGES,
          portfolio:           d.portfolio?.length           ? d.portfolio                              : FALLBACK_PORTFOLIO,
          portfolioCategories: d.portfolioCategories?.length ? d.portfolioCategories.map((c) => [c.key, c.label]) : FALLBACK_PORTFOLIO_CATEGORIES,
          process:             d.process?.length             ? d.process                                : FALLBACK_PROCESS,
          testimonials:        d.testimonials?.length        ? d.testimonials                           : FALLBACK_TESTIMONIALS,
          stats:               d.stats?.length               ? d.stats                                  : FALLBACK_STATS,
          marquee:             d.marquee?.length             ? d.marquee.map((m) => m.text)             : FALLBACK_MARQUEE,
          nav:                 d.nav?.length                 ? d.nav.map((n) => [n.label, n.href])      : FALLBACK_NAV,
        });
      })
      .catch((err) => {
        console.error("[ContentProvider] failed to load from Supabase:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <ContentContext.Provider value={{ ...content, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

function mapPackage(p) {
  return {
    id: p.id,
    name: p.name,
    italic: p.italic ?? "",
    tagline: p.tagline ?? "",
    currency: p.currency ?? "IDR",
    amount: p.amount ?? "",
    unit: p.unit ?? "",
    featured: !!p.featured,
    tag: p.tag ?? undefined,
    features: Array.isArray(p.features) ? p.features : [],
  };
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}

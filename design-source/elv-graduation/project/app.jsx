// app.jsx — root composer with Tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#2A0001", "#F5EFE6", "#C9A48B"],
  "displayFont": "Cormorant Garamond",
  "heroStyle": "editorial",
  "showMarquee": true,
  "accentOnHero": "rose"
}/*EDITMODE-END*/;

const PALETTE_OPTIONS = [
  ["#2A0001", "#F5EFE6", "#C9A48B"],  // oxblood × cream × rose-sand  (default)
  ["#1F1A17", "#EFE6D6", "#B89968"],  // espresso × bone × gold
  ["#3A1416", "#F1ECE3", "#A24F4B"],  // wine × paper × terracotta
  ["#0F1B12", "#EDEAE0", "#8E7A5A"],  // forest × ivory × bronze
];

const DISPLAY_FONTS = [
  "Cormorant Garamond",
  "Playfair Display",
  "DM Serif Display",
  "Italiana",
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lbItem, setLbItem] = useState(null);

  // apply palette + font to CSS variables
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--maroon", t.palette[0]);
    r.setProperty("--cream", t.palette[1]);
    r.setProperty("--rose", t.palette[2]);
    // derived
    const maroon = t.palette[0];
    r.setProperty("--maroon-deep", shade(maroon, -0.35));
    r.setProperty("--maroon-soft", shade(maroon, 0.15));
    r.setProperty("--paper", mix(t.palette[1], "#ffffff", 0.4));
    r.setProperty("--line", hexA(maroon, 0.14));
    r.setProperty("--line-soft", hexA(maroon, 0.08));
    r.setProperty("--font-display", `"${t.displayFont}", "Times New Roman", serif`);
  }, [t.palette, t.displayFont]);

  // load google font when display font changes
  useEffect(() => {
    if (t.displayFont === "Cormorant Garamond") return; // already loaded
    const id = "gf-" + t.displayFont.replace(/\s/g, "-");
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${t.displayFont.replace(/ /g,"+")}:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap`;
    document.head.appendChild(link);
  }, [t.displayFont]);

  useReveal();
  useParallax();

  return (
    <>
      <Nav />
      <Hero />
      {t.showMarquee && <Marquee />}
      <Services />
      <Portfolio onOpen={setLbItem} />
      <About />
      <Process />
      <Testi />
      <Booking />
      <Footer />

      <Lightbox item={lbItem} onClose={() => setLbItem(null)} />
      <WhatsAppFAB />

      <TweaksPanel title="Tweaks · ELV">
        <TweakSection label="Palet Warna" />
        <TweakColor
          label="Palet" value={t.palette}
          options={PALETTE_OPTIONS}
          onChange={(v) => setTweak("palette", v)}
        />
        <TweakSection label="Tipografi" />
        <TweakSelect
          label="Font display" value={t.displayFont}
          options={DISPLAY_FONTS}
          onChange={(v) => setTweak("displayFont", v)}
        />
        <TweakSection label="Konten" />
        <TweakToggle
          label="Strip 'wisuda' berjalan" value={t.showMarquee}
          onChange={(v) => setTweak("showMarquee", v)}
        />
      </TweaksPanel>
    </>
  );
}

/* ---- color helpers ---- */
function hexToRgb(h){
  h = h.replace("#","");
  if (h.length===3) h = h.split("").map(c=>c+c).join("");
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
}
function rgbToHex({r,g,b}){
  const c = (n) => n.toString(16).padStart(2,"0");
  return `#${c(Math.max(0,Math.min(255,Math.round(r))))}${c(Math.max(0,Math.min(255,Math.round(g))))}${c(Math.max(0,Math.min(255,Math.round(b))))}`;
}
function shade(hex, amt){
  const { r,g,b } = hexToRgb(hex);
  const f = (x) => amt < 0 ? x * (1+amt) : x + (255 - x) * amt;
  return rgbToHex({ r:f(r), g:f(g), b:f(b) });
}
function mix(a,b,t){
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex({ r: A.r*(1-t)+B.r*t, g: A.g*(1-t)+B.g*t, b: A.b*(1-t)+B.b*t });
}
function hexA(hex, a){
  const { r,g,b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

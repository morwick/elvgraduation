import { useEffect, useState } from "react";
import { useContent } from "../context/ContentContext.jsx";

export default function Nav() {
  const { site, nav } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={"nav " + (scrolled ? "scrolled " : "") + (open ? "menu-open" : "")}>
      <a href="#top" className="nav-brand" onClick={close}>
        <span className="nav-logo" aria-hidden="true"></span>
        <span>{site.brand}</span>
      </a>
      <nav className="nav-links">
        {nav.map(([t, h]) => (
          <a key={h} href={h}>{t}</a>
        ))}
      </nav>
      <a
        href="#booking"
        className="btn btn-ghost nav-cta"
        style={{
          borderColor: scrolled ? "" : "rgba(245,239,230,.35)",
          color: scrolled ? "" : "var(--cream)",
        }}
      >
        Booking <span className="arrow">→</span>
      </a>

      <button
        className={"nav-burger " + (open ? "is-open" : "")}
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div
        id="mobile-menu"
        className={"mobile-menu " + (open ? "open" : "")}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <nav className="mobile-menu-links">
          {nav.map(([t, h]) => (
            <a key={h} href={h} onClick={close}>{t}</a>
          ))}
        </nav>
        <a
          href="#booking"
          className="btn btn-primary mobile-menu-cta"
          onClick={close}
        >
          Pesan Sesi <span className="arrow">→</span>
        </a>
      </div>
    </header>
  );
}

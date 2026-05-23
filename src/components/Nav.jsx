import { useEffect, useState } from "react";
import { useContent } from "../context/ContentContext.jsx";

export default function Nav() {
  const { site, nav } = useContent();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"nav " + (scrolled ? "scrolled" : "")}>
      <a href="#top" className="nav-brand">
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
    </header>
  );
}

import { useContent } from "../context/ContentContext.jsx";

export default function WhatsAppFAB() {
  const { site } = useContent();
  const href = `https://wa.me/${site.whatsappPhone}?text=${encodeURIComponent(site.whatsappMessage)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-fab"
      aria-label="Chat via WhatsApp"
    >
      <span className="wa-fab-icon">
        <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16.001 3.2C8.93 3.2 3.2 8.93 3.2 16c0 2.26.59 4.47 1.72 6.42L3.2 28.8l6.55-1.71A12.8 12.8 0 0 0 28.8 16c0-7.07-5.73-12.8-12.8-12.8zm0 23.32a10.5 10.5 0 0 1-5.36-1.47l-.38-.23-3.89 1.02 1.04-3.8-.25-.39A10.5 10.5 0 1 1 26.5 16c0 5.8-4.7 10.52-10.5 10.52zm5.76-7.86c-.32-.16-1.87-.92-2.16-1.03-.29-.11-.5-.16-.71.16-.21.32-.81 1.03-.99 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.77-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.72-.98-2.36-.26-.62-.52-.54-.71-.55-.18-.01-.4-.01-.61-.01s-.55.08-.84.4c-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.51 1.8.66.76.24 1.45.21 2 .13.61-.09 1.87-.76 2.13-1.5.26-.74.26-1.37.18-1.5-.08-.13-.29-.21-.61-.37z" />
        </svg>
      </span>
      <span className="wa-fab-label">
        <span className="wa-fab-line">Chat di WhatsApp</span>
        <span className="wa-fab-sub">balas &lt; 6 jam</span>
      </span>
    </a>
  );
}

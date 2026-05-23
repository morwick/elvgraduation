import { useEffect } from "react";

export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={"lb " + (item ? "open" : "")} onClick={onClose}>
      {item && (
        <>
          <button className="lb-close" onClick={onClose} aria-label="Tutup">
            ✕
          </button>
          <img
            src={item.img.replace(/w=\d+/, "w=1800")}
            alt={item.title}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="lb-meta">
            <em>{item.title}</em> — {item.sub}
          </div>
        </>
      )}
    </div>
  );
}

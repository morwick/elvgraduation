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
          {item.video ? (
            <video
              src={item.video}
              poster={item.img}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={item.img.replace(/w=\d+/, "w=1800")}
              alt={`Foto wisuda ${item.title}${item.sub ? " — " + item.sub : ""}${item.cat ? " (" + item.cat + ")" : ""}`}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <div className="lb-meta">
            <em>{item.title}</em> — {item.sub}
          </div>
        </>
      )}
    </div>
  );
}

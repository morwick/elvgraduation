import { useEffect } from "react";

const DEFAULT = "ELV.GRADUATION — Jasa Fotografi Wisuda Pekanbaru, Riau";

export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — ELV.GRADUATION` : DEFAULT;
    return () => { document.title = previous; };
  }, [title]);
}

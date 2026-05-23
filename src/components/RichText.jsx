import { Fragment } from "react";

/**
 * Renders CMS text with light syntax:
 *   \n      → line break
 *   *kata*  → <em>kata</em>  (italic + accent color via .display em / .hero-title em)
 *
 * Falls back to `fallback` when `text` is empty/undefined.
 */
export default function RichText({ text, fallback = "" }) {
  const source = (text ?? "").trim() ? text : fallback;
  if (!source) return null;

  const lines = String(source).split(/\r?\n/);

  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/(\*[^*\n]+\*)/g).map((part, j) => {
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={j}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={j}>{part}</Fragment>;
      })}
    </Fragment>
  ));
}

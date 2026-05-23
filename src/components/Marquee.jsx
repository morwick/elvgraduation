import { Fragment } from "react";
import { useContent } from "../context/ContentContext.jsx";

export default function Marquee() {
  const { marquee } = useContent();
  if (!marquee?.length) return null;
  const row = (
    <span>
      {marquee.map((t, i) => (
        <Fragment key={i}>
          {t}
          <span className="star">✦</span>
        </Fragment>
      ))}
    </span>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}

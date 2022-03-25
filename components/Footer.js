import React, { useEffect, useState } from "react";

export default function Footer() {
  const [Animate, setAnimate] = useState(false);

  useEffect(() => {
    document.addEventListener("scroll", function (e) {
      if (!Animate) {
        setAnimate(true);
      }
    });
  }, []);

  return (
    <div className={!Animate ? "footer" : "footer animate-footer"}>
      <p>©️ Copyright {new Date().getUTCFullYear()} Metobajraktari</p>
    </div>
  );
}

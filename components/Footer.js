import React, { useEffect, useState } from "react";

export default function Footer() {
  return (
    <div className="footer">
      <p>©️ Copyright {new Date().getUTCFullYear()} Metobajraktari</p>
    </div>
  );
}

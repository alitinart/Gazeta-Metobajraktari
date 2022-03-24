import React from "react";

export default function Search() {
  return (
    <div className="search-container">
      <input className="form-control search" placeholder="Kërko Artikuj" />
      <button className="btn">
        <i className="bi bi-search"></i>
      </button>
    </div>
  );
}

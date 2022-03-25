import React, { useState } from "react";
import Router from "next/router";

export default function Search() {
  const [Search, setSearch] = useState("");

  const searchHandler = () => {
    Router.push(`/search/${Search}`);
  };

  return (
    <div className="search-container">
      <input
        className="form-control search"
        value={Search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        placeholder="Kërko Artikuj"
      />
      <button className="btn" onClick={searchHandler}>
        <i className="bi bi-search"></i>
      </button>
    </div>
  );
}

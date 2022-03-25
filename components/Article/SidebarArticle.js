import React from "react";
import Router from "next/router";

export default function SidebarArticle({ article }) {
  return (
    <li className="sidebar-item">
      <div
        className="cover"
        style={{ backgroundImage: `url("${article.cover}")` }}
      ></div>
      <div className="content">
        <h3 className="article-title">{article.title}</h3>
        <p>{article.summary}</p>
        <button
          className="btn"
          onClick={() => {
            Router.push(`/article/${article._id}`);
          }}
        >
          Lexo
        </button>
      </div>
    </li>
  );
}

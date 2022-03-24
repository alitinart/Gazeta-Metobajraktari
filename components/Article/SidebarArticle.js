import React from "react";

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
        <button className="btn">Lexo</button>
      </div>
    </li>
  );
}

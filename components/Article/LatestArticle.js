import React from "react";
import Router from "next/router";

export default function LatestArticle({ article }) {
  return (
    <div
      className="latest-article"
      style={{ backgroundImage: `url("${article.cover}")` }}
    >
      <div className="tint">
        <h1 className="article-title">{article.title}</h1>
        <p className="article-summary">{article.summary}</p>
        <button
          className="btn center-btn"
          onClick={() => {
            Router.push(`/article/${article._id}`);
          }}
        >
          Lexo
        </button>
      </div>
    </div>
  );
}

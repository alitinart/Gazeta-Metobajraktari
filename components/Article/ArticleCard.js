import React from "react";
import Router from "next/router";

export default function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <img className="cover" src={article.cover} />
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
  );
}

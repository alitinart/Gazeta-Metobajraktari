import React from "react";
import Router from "next/router";

export default function ArticleCard({ article }) {
  return (
    <div
      className="article-card"
      onClick={() => {
        Router.push(`/article/${article._id}`);
      }}
    >
      <img className="cover" src={article.cover} />
      <h1 className="article-title">{article.title}</h1>
      <p className="article-summary">{article.summary}</p>
    </div>
  );
}

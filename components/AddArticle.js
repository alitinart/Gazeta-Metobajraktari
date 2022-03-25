import Router from "next/router";
import React from "react";
import { useSelector } from "react-redux";

export default function AddArticle() {
  const state = useSelector((state) => state);

  return state ? (
    state.token ? (
      <div className="add-article-button">
        <i
          className="bi bi-plus"
          onClick={() => {
            Router.push("/create/article");
          }}
        ></i>
      </div>
    ) : (
      <></>
    )
  ) : (
    <></>
  );
}

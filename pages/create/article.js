import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { articleRequests } from "../../services/request.service";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import NotificationProvider from "../../services/notifications.service";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default function CreateArticle() {
  const state = useSelector((state) => state);

  const [title, setTitle] = useState();
  const [cover, setCover] = useState();
  const [summary, setSummary] = useState();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const createArticle = async () => {
    const resCreateArticle = await articleRequests.createArticle(
      state.token,
      title,
      stateToHTML(editorState.getCurrentContent()),
      cover,
      summary
    );

    if (resCreateArticle.error) {
      return NotificationProvider("Error", resCreateArticle.message, "danger");
    }

    NotificationProvider("Sukses", resCreateArticle.message, "success");
    Router.push("/");
  };

  return (
    <>
      <Head>
        <title>Krijo Artikull</title>
      </Head>
      <div className="create-article">
        <h1 className="title">Krijo Artikull</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createArticle();
          }}
          className="form-article"
        >
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="form-control"
            placeholder="Titulli i Artikullit"
          />
          <input
            value={cover}
            onChange={(e) => {
              setCover(e.target.value);
            }}
            className="form-control"
            placeholder="Imazhi"
          />
          <div
            style={{
              border: "1px solid black",
              padding: "2px",
              minHeight: "400px",
            }}
          >
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
            />
          </div>
          <input
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
            }}
            className="form-control"
            placeholder="P??rmbledhja"
          />
          <button className="submitButton" type="submit">
            Krijo
          </button>
        </form>
      </div>
    </>
  );
}

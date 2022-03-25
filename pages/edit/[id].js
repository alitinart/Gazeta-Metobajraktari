import Head from "next/head";
import { articleRequests } from "../../services/request.service";
import { stateFromHTML } from "draft-js-import-html";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import NotificationService from "../../services/notifications.service";
import Router from "next/router";

import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export async function getServerSideProps({ params }) {
  const { data } = await articleRequests.getArticleById(params.id);

  return { props: { article: { ...data } } };
}

export default function EditArticle({ article }) {
  const state = useSelector((state) => state);

  const [title, setTitle] = useState(article.title);
  const [cover, setCover] = useState(article.cover);
  const [summary, setSummary] = useState(article.summary);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    setEditorState(EditorState.createWithContent(stateFromHTML(article.text)));

    return () => {};
  }, []);

  const createArticle = async () => {
    const resUpdateArticle = await articleRequests.updateArticle(
      {
        title,
        cover,
        summary,
        text: stateToHTML(editorState.getCurrentContent()),
      },
      article._id,
      state.token
    );

    if (resUpdateArticle.error) {
      return NotificationService("Error", resUpdateArticle.message, "danger");
    }

    NotificationService("Sukses", resUpdateArticle.message, "success");
    Router.push(`/article/${article._id}`);
  };

  return (
    <>
      <Head>
        <title>Krijo Artikull</title>
      </Head>
      <div className="create-article">
        <h1 className="title">Edito Artikullin</h1>
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
            placeholder="Përmbledhja"
          />
          <button className="submitButton" type="submit">
            Krijo
          </button>
        </form>
      </div>
    </>
  );
}

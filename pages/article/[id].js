import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SidebarArticle from "../../components/Article/SidebarArticle";
import verifyGuard from "../../guards/verifyGuard";
import { articleRequests } from "../../services/request.service";
import NotificationSerivce from "../../services/notifications.service";

export async function getServerSideProps({ params }) {
  const { data } = await articleRequests.getArticleById(params.id);
  const articles = await articleRequests.getAllArticles();

  return { props: { articleProp: { ...data }, articles: [...articles.data] } };
}

export default function Article({ articleProp, articles }) {
  const [sortedArticles, setSortedArticles] = useState([]);
  const [sortedComments, setSortedComments] = useState([]);
  const [comment, setComment] = useState("");
  const [article, setArticle] = useState(articleProp);

  const state = useSelector((state) => state);

  useEffect(async () => {
    setSortedArticles(articles.reverse());
    setSortedComments(articleProp.comments.reverse());
    if (
      localStorage.getItem("token") &&
      !(await verifyGuard(localStorage.getItem("token")))
    ) {
      Router.push("/verify");
    }

    return () => {};
  }, []);

  const commentHandler = async () => {
    if (comment === "") {
      return NotificationSerivce(
        "Error",
        "Ju lutemi vendoseni komentin e juaj.",
        "danger"
      );
    }

    const resComment = await articleRequests.comment(
      comment,
      state.token,
      article._id
    );

    if (resComment.error) {
      return NotificationSerivce("Error", resComment.message, "danger");
    }

    const syncedArticle = await articleRequests.getArticleById(article._id);
    setArticle({ ...syncedArticle.data });
    setSortedComments([...syncedArticle.data.comments.reverse()]);
    console.log(syncedArticle);

    NotificationSerivce("Success", resComment.message, "success");
  };

  const deleteHandler = async () => {
    const resDeleteArticle = await articleRequests.deleteArticle(
      state.token,
      article._id
    );

    if (resDeleteArticle.error) {
      return NotificationSerivce("Error", resDeleteArticle.message, "danger");
    }

    NotificationSerivce("Sukses", resDeleteArticle.message, "success");
    Router.push("/");
  };

  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.summary}></meta>
      </Head>
      <div className="main main-article">
        <div className="latest-article article-content">
          {state ? (
            state.userObject && state.userObject.role === "autor" ? (
              <>
                <button
                  className="btn edit-button"
                  style={{
                    marginBottom: "10px",
                    marginLeft: "0",
                    padding: "10px",
                  }}
                  onClick={() => {
                    Router.push(`/edit/${article._id}`);
                  }}
                >
                  Edito Artikullin
                </button>
                <button
                  className="btn btn-danger edit-button"
                  style={{
                    marginBottom: "20px",
                    marginLeft: "0",
                  }}
                  onClick={() => {
                    deleteHandler();
                  }}
                >
                  Fshij Artikullin
                </button>
              </>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
          <img className="cover" src={article.cover} />
          <h1 className="article-title" style={{ marginTop: "20px" }}>
            {article.title}
          </h1>
          <p className="timestamp" style={{ marginTop: "15px" }}>
            {article.timestamp}
          </p>
          <div
            className="text"
            dangerouslySetInnerHTML={{ __html: article.text }}
          ></div>
          <div className="comments">
            {state && state.token ? (
              <div className="add-comment">
                <textarea
                  className="form-control"
                  placeholder="Krijo Koment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                ></textarea>
                <button className="btn" onClick={commentHandler}>
                  Krijo
                </button>
              </div>
            ) : (
              <></>
            )}
            <h1 style={{ marginTop: "10px" }}>
              Komente ({sortedComments.length})
            </h1>
            {sortedComments.map((comment) => {
              return (
                <div className="comment" key={comment.timestamp}>
                  <div className="comment-info">
                    <h3>{comment.fullName}</h3>
                    <p style={{ color: "gray", fontSize: "15px" }}>
                      {comment.timestamp}
                    </p>
                  </div>
                  <p className="comment-text">{comment.comment}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="sidebar">
          <ul>
            <h1>Artikujt e tjerë</h1>
            {sortedArticles.map((article) => {
              return <SidebarArticle article={article} key={article._id} />;
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

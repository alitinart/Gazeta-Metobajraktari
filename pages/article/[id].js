import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SidebarArticle from "../../components/Article/SidebarArticle";
import verifyGuard from "../../guards/verifyGuard";
import { articleRequests } from "../../services/request.service";

export async function getServerSideProps({ params }) {
  const { data } = await articleRequests.getArticleById(params.id);
  const articles = await articleRequests.getAllArticles();

  return { props: { article: { ...data }, articles: [...articles.data] } };
}

export default function Article({ article, articles }) {
  const [sortedArticles, setSortedArticles] = useState([]);

  const state = useSelector((state) => state);

  useEffect(async () => {
    let sorted = [];
    articles.forEach((element) => {
      sorted.unshift(element);
    });
    setSortedArticles(sorted);
    if (
      localStorage.getItem("token") &&
      !(await verifyGuard(localStorage.getItem("token")))
    ) {
      Router.push("/verify");
    }

    return () => {};
  }, []);
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
              <button
                className="btn edit-button"
                style={{ marginBottom: "10px" }}
                onClick={() => {
                  Router.push(`/edit/${article._id}`);
                }}
              >
                Edito Artikullin
              </button>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
          <img className="cover" src={article.cover} />
          <h1 className="article-title">{article.title}</h1>
          <p className="timestamp">{article.timestamp}</p>
          <div
            className="text"
            dangerouslySetInnerHTML={{ __html: article.text }}
          ></div>
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

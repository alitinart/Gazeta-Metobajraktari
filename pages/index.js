import Head from "next/head";
import { useEffect, useState } from "react";
import ArticleCard from "../components/Article/ArticleCard";
import LatestArticle from "../components/Article/LatestArticle";
import SidebarArticle from "../components/Article/SidebarArticle";
import { articleRequests, userRequests } from "../services/request.service";

export async function getStaticProps() {
  const { data } = await articleRequests.getAllArticles();

  return { props: { articles: data } };
}

export default function Home({ articles }) {
  const [sortedArticles, setSortedArticles] = useState([]);
  const [latestArticle, setLatestArticle] = useState();

  let counter = 0;

  useEffect(() => {
    let sorted = [];
    setLatestArticle(articles.pop());
    articles.forEach((element) => {
      sorted.unshift(element);
    });
    setSortedArticles(sorted);
    return () => {};
  }, []);

  return (
    <>
      <Head>
        <title>Gazeta Metobajraktari</title>
        <meta
          name="description"
          content="Faqja zyrtare e Gazetës Metobajraktari"
        ></meta>
      </Head>
      <div className="main">
        {latestArticle ? <LatestArticle article={latestArticle} /> : <></>}
        <div className="sidebar">
          <ul>
            <h1>Artikujt e tjerë</h1>
            {sortedArticles.map((article) => {
              if (counter < 5) {
                counter++;
                return <SidebarArticle article={article} key={article._id} />;
              }
            })}
          </ul>
        </div>
      </div>
      <div className="cards">
        {sortedArticles.map((article) => {
          return <ArticleCard article={article} key={article._id} />;
        })}
      </div>
    </>
  );
}

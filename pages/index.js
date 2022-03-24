import Head from "next/head";
import { useEffect, useState } from "react";
import LatestArticle from "../components/Article/LatestArticle";
import SidebarArticle from "../components/Article/SidebarArticle";
import { articleRequests, userRequests } from "../services/request.service";
import styles from "../styles/Home.module.css";

export async function getStaticProps() {
  const { data } = await articleRequests.getAllArticles();

  return { props: { articles: data } };
}

export default function Home({ articles }) {
  const [sortedArticles, setSortedArticles] = useState([]);
  const [latestArticle, setLatestArticle] = useState();
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
              return <SidebarArticle article={article} key={article._id} />;
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

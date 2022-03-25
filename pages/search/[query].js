import { articleRequests } from "../../services/request.service";
import ArticleCard from "../../components/Article/ArticleCard";
import Head from "next/head";

export async function getServerSideProps({ params }) {
  const { data } = await articleRequests.search(params.query);

  return { props: { results: [...data], query: params.query } };
}

export default function SearchResults({ results, query }) {
  return (
    <>
      <Head>
        <title>Artikujt</title>
      </Head>
      <div className="search-results">
        <h1
          className="title"
          style={{
            marginTop: "50px",
          }}
        >
          Kërkim për: {query}{" "}
        </h1>
        <div className="cards">
          {results.map((article) => {
            return <ArticleCard article={article} />;
          })}
        </div>
      </div>
    </>
  );
}

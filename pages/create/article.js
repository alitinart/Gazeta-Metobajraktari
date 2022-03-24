import Head from "next/head";
import { useState } from "react";
import { useSelector } from "react-redux";
import { articleRequests } from "../../services/request.service";

export default function CreateArticle() {
  const { token } = useSelector((state) => state);

  const [title, setTitle] = useState();
  const [text, setText] = useState();
  const [cover, setCover] = useState();

  const createArticle = async () => {
    const resCreateArticle = await articleRequests.createArticle(
      token,
      title,
      text,
      cover
    );
  };

  return (
    <>
      <Head>
        <title>Krijo Artikull</title>
      </Head>
      <div className="article"></div>
    </>
  );
}

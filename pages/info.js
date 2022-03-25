import Head from "next/head";

export default function Info() {
  // const team = [
  //   {
  //     name: "Nart Aliti",
  //     image:
  //       "https://cdn.discordapp.com/attachments/718828137080815687/956938725546405899/Wondering.png",
  //     saying: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  //     position: "Autor / Developer",
  //   },
  //   {
  //     name: "Alea Shulemaja",
  //     image: "https://forums.macrumors.com/attachments/787710/",
  //     saying: "Lorem ipsum dolor sit amet, consectetur adipiscing elit  ",
  //     position: "Autore",
  //   },
  //   {
  //     name: "Rritë Bajraj",
  //     image:
  //       "https://i.pinimg.com/236x/9b/0e/4d/9b0e4daa1870231d3a69b8d5a1bbd81a.jpg",
  //     saying: "At vero eos et accusamus et iusto odio dignissimos",
  //     position: "Autore",
  //   },
  //   {
  //     name: "Eris Gashi",
  //     image:
  //       "https://img-12.stickers.cloud/packs/b2f7b08e-f29f-4016-9446-946a380f69e9/webp/a4cb5721-aa66-44ea-8982-64553b1eb1ff.webp",
  //     saying: "Temporibus autem quibusdam et aut officiis",
  //     position: "Autor",
  //   },
  // ];

  return (
    <>
      <Head>
        <title>Gazeta Metobajraktari</title>
        <meta name="description" content="Rreth ne"></meta>
      </Head>
      <div className="info">
        <h1 className="title">Për Ne</h1>

        {/* <div className="team">
          {team.map((member) => {
            return (
              <div className="member" key={member.name}>
                <img src={member.image} />
                <p className="name">{member.name}</p>
                <p className="position">{member.position}</p>
                <p className="saying">"{member.saying}"</p>
              </div>
            );
          })}
        </div> */}
      </div>
    </>
  );
}

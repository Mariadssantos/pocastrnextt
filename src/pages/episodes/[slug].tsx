import { GetStaticPaths, GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

import { api } from "../../Services/api";
import { covertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import ptBR from "date-fns/locale/pt-BR";
import Image from "next/image";

import styles from "./episode.module.scss";
import { usePlayer } from "../../Contexts/PlayerContexts";

type Episode = {
  id: string;
  title: string;
  members: string;
  duration: number;
  description: string;
  thumbnail: string;
  durationAsString: string;
  url: string;
  publishedAt: string;
};
type episodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: episodeProps) {
  const { play } = usePlayer();

  <Head>
    <title> {episode.title} | Podcastr </title>
  </Head>;
  // é da parte de cima no caso da abinha

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type={"button"}>
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>

        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />

        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar Episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get(`episodes`, {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const paths = data.map((episode) => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });
  return {
    paths,
    fallback: "blocking",
  };
}; //  o getStaticPaths obgrigatório em toda rota que está usando geração estática e que possui parâmetros dinâmicos "[]"

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: covertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };
  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, //24hrs
  };
};

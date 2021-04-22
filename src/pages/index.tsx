import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from './Services/api';
import { covertDurationToTimeString } from './utils/convertDurationToTimeString';

import styles from './home.module.scss';
// importando o getstaticprops do next

type Episode = {
    id: string;
    title: string;
    members: string;  
    Duration: string;
    descrption: string;
    thumbnail: string; 
    durationAsString: string;
    url: string;
    publishedAt: string;
    // tipando o objeto
}

type HomeProps = {
    
    latestEpisodes: Episode[];
    allEpisodes: Episode[];
}


    export default function Home({ latestEpisodes,  allEpisodes }: HomeProps) {
    return (
    <div className={styles.homepage}> 
    <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>

        <ul>
           {latestEpisodes.map(episode => {
               return(
                <li key={episode.id}>
                    <a href="/">{episode.title}</a>
                </li>
              )
            })};   
        </ul>
    </section>

    <section className={styles.allEpisodes}>

    </section>
    
    </div>

    )
  }

   export const  getStaticProps: GetStaticProps = async () => {
       const { data } = await api.get('episodes', {
        params: {

            _limit: 12,
            _sort: 'published_at',
            _order: 'desc',
 // foram passadas instruções da informações a serem pegas no server.json. limite de 12 registros, ordenação pelo published (pela data de publicação) na ordem decrescente.

   }
    })

    const episodes = data.map(episode => {

        return {
            id: episode.id,
            title: episode.title,
            thumbnail: episode.thumbnail,
            members: episode.members,
            publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
            duration: Number(episode.file.duration),
            durationAsString: covertDurationToTimeString(Number(episode.file.duration)),
            description: episode.description,
            url: episode.file.url,

            
        };
    })

    const latestEpisodes = episodes.slice(0, 2);
    const allEpisodes = episodes.slice(2, episodes.length);

       return {
        props: {
            latestEpisodes,
            allEpisodes,
            
        },

        revalidate: 60 * 60 * 8,   
   }
}
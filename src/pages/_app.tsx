import Header from "../Components/header";

import '../styles/global.scss'
import styles from '../styles/app.module.scss'

import Player from "../Components/Player";
import { PlayerContextProvider } from '../Contexts/PlayerContexts';



function MyApp({ Component, pageProps }) {

  
  return(
   <PlayerContextProvider> 
 <div className={styles.wrapper}>
      <main>
      <Header />
      <Component {...pageProps}/>
      </main>
      <Player />  
    </div>
    </PlayerContextProvider>

  )
}

export default MyApp
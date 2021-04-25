import {  useRef, useEffect, useState } from 'react';
import {  usePlayer } from '../../Contexts/PlayerContexts';
import Image from 'next/image';
import { covertDurationToTimeString } from '../../utils/convertDurationToTimeString';


import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from  './styles.module.scss';




export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const {episodeList,
         currentEpisodeIndex,
         isPlaying,
         isLooping,
         isShuffling,
         togglePlay,
         toggleLoop,
         toggleShuffle,
         playNext,
         playPrevious,
         hasNext,
         hasPrevious,
         clearPlayerState,
         setPlayingState
        } = usePlayer();

        function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });

        }

        function handleSeek(amout: number){
            audioRef.current.currentTime = amout;
            setProgress(amout);
        }

        function handleEpisodeEnded (){
            if(hasNext){
                playNext()
            } else{
                clearPlayerState()
            }
        }
    
          useEffect(() => {
              if(!audioRef.current) {
                  return;
              }
              if (isPlaying){
                  audioRef.current.play();
              } else {
                audioRef.current.pause();
              }
          }, [isPlaying])



     const episode = episodeList[currentEpisodeIndex]

        return(
         <div className={styles.playerContainer}>
           <header>
               <img src="/playing.svg" alt="Tocando agora"/>
               <strong> Tocando agora </strong>
           </header>
         { episode ? (
       <div className={styles.currentEpisode}>
          <Image 
          width={592}
          height={592}
          src={episode.thumbnail}
          objectFit="cover"
        />

            <strong>{episode.title}</strong>
            <span>{episode.members}</span>

       </div>

         ) : (

            <div className={styles.emptyPlayer}>
                <strong> Selecione um podcast para ouvir </strong>
            </div>

         )}


        <footer className={! episode ? styles.empyt : ''}>
        <div className={styles.progress}>
        <span>{covertDurationToTimeString(progress)}</span>
            <div className={styles.Slider}>
                { episode ? (
                    <Slider 
                    max={episode.duration} 
                    value={progress}
                    onChange={handleSeek}
                    trackStyle={{ backgroundColor: '#04d361'}}
                    railStyle={{ backgroundColor: '#9f75ff' }}
                    handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
                    
                
                    />
                ) : (
                    <div className={styles.emptySlider}/>

                ) }
            </div>
            <span>{covertDurationToTimeString(episode?.duration ?? 0)}</span>
            </div>
            { episode && (
                <audio 
                src={episode.url}
                ref={audioRef}
                autoPlay
                loop={isLooping}
                onPlay={() => setPlayingState(true)}
                onPause={() => setPlayingState(false)}
                onEnded={handleEpisodeEnded}
                onLoadedMetadata={setupProgressListener}
                />
            )}
            
            <div className={styles.buttons}>
                <button type="button" disabled={!episode || episodeList.length === 1}
                onClick={toggleShuffle}
                className={isShuffling ? styles.isActive : ''}
                >
                    <img src="/shuffle.svg" alt="Embaralhar"/>
                </button>
                <button type="button" onClick={playPrevious}disabled={!episode || !hasPrevious}>
                    <img src="/play-previous.svg" alt="Tocar anterior"/>
                </button>
                <button type="button" className={styles.playButton}
                 disabled={!episode}
                 onClick={togglePlay}

                 >
                    { isPlaying

                    ? <img src="/pause.svg" alt="Tocar"/>
                    : <img src="/play.svg" alt="Tocar"/>  }
                </button>
                <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                    <img src="/play-next.svg" alt="Tocar a próxima"/>
                </button>
                <button type="button"
                     disabled={!episode}
                     onClick={toggleLoop}
                     className={isLooping ? styles.isActive : ''}
                     >
                    <img src="/repeat.svg" alt="Reptir"/>
                </button>
            

            </div>
            </footer>
        </div>

    );
}
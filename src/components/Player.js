import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
// import {playAudio} from "../util";


const Player = ({audioRef, currentSong, isPlaying, setIsPlaying, songInfo, setSongInfo, setCurrentSong, songs, setSongs}) => {
    const activeLibraryHandler = (nextprev) => {
        const newSongs = songs.map(song => {
            if(song.id === nextprev.id){
                return {
                    ...song,
                    active: true,
                }
            }else{
                return{
                    ...song,
                    active: false,
                }
            }
        });
        setSongs(newSongs);
    }
    //Event Handlers
    const playSoundHandler = () => {
        if(isPlaying){
            audioRef.current.pause();
            setIsPlaying(!isPlaying);
        }else{
            audioRef.current.play();
            setIsPlaying(!isPlaying);
        };
    };
    const dragHandler = (e) => {
        audioRef.current.currentTime = e.target.value;
        setSongInfo({...songInfo, currentTime : e.target.value});
      };
    const getTime = (time) => {
        return (
            Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
        );
    };
    const skipTrackHandler = async (direction) => {
        let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
        if(direction === "skip-forward"){
            await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
            activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
            
        };
        if(direction === "skip-back") {
            if((currentIndex - 1) % songs.length === -1) {
                await setCurrentSong(songs[songs.length -1]);
                activeLibraryHandler(songs[songs.length -1]);
                if(isPlaying) audioRef.current.play();
                return;
            };
            await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
            activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
        };
        if(isPlaying) audioRef.current.play();
    };
    //Add the styles
    const trackAnim = {
        transform: `translateX(${songInfo.animationPercentage}%)`
    };
    const backgroundAnim = {
        background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`
    };
    return (
        <div className="player">
            <div className="time-control">
                <p>{getTime(songInfo.currentTime)}</p>
                <div style={backgroundAnim} className="track">
                    <input onChange={dragHandler} min={0} max={songInfo.duration || 0} value={songInfo.currentTime} type="range"/>
                    <div style={trackAnim} className="animate-track"></div>
                </div>
                <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00" }</p>
            </div>
            <div className="play-control">
                <FontAwesomeIcon onClick={()=> skipTrackHandler("skip-back")} className="skip-back" size="2x" icon={faAngleLeft} />
                <FontAwesomeIcon onClick={playSoundHandler} className="play" size="2x" icon={isPlaying ? faPause : faPlay} />
                <FontAwesomeIcon onClick={()=> skipTrackHandler("skip-forward")} className="skip-forward" size="2x" icon={faAngleRight} />
            </div>
            
        </div>
    );
};

export default Player;
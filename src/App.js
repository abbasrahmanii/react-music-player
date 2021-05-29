import React,{useState, useRef} from "react";
//Import Styles
import "./style/app.scss"
//Adding Components
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from"./components/Nav";
//Import data
import data from "./data";
// import util from "./util";
function App() {
  //Ref
  const audioRef = useRef(null);
  //State
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime : 0,
    duration : 0,
    animationPercentage: 0,
  });
  const [libraryStatus, setLibraryStatus] = useState(false);
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    //Calculate Percentage
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);
    setSongInfo({...songInfo, currentTime: current, duration, animationPercentage: animation});
};
  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if(isPlaying) audioRef.current.play();
  };
  const backBody = {
    background: `linear-gradient(65deg,rgb(236, 236, 236)  45%,${currentSong.color[1]} 65%,${currentSong.color[0]} 100%),transparent`
};
  return (
    <div style={backBody} className={`App ${libraryStatus ? "library-active" : ""}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player audioRef={audioRef} songInfo={songInfo} setSongInfo={setSongInfo} isPlaying={isPlaying} setIsPlaying={setIsPlaying} currentSong={currentSong} setSongs={setSongs} setCurrentSong={setCurrentSong} songs={songs} />
      <Library isPlaying={isPlaying} audioRef={audioRef} setCurrentSong={setCurrentSong} songs={songs} setSongs={setSongs} libraryStatus={libraryStatus} />
      <audio onEnded={songEndHandler} onTimeUpdate={timeUpdateHandler} onLoadedMetadata={timeUpdateHandler}  ref={audioRef} src={currentSong.audio}></audio>
    </div>
  );
}

export default App;

import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import {
  FaBackward,
  FaPlay,
  FaPause,
  FaForward,
  FaMoon,
  FaSun,
  FaMusic,
  FaBook,
  FaCoffee,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

const LofiPlayer = () => {
  const [playlists, setPlaylists] = useState([
    { id: "chill", icon: <FaMusic />, label: "Music" },
    { id: "coffee", icon: <FaCoffee />, label: "Coffee" },
    { id: "study", icon: <FaBook />, label: "Study" },
  ]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("chill");
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [time, setTime] = useState(new Date());
  const [volume, setVolume] = useState(0.5);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/songs/${selectedPlaylist}`).then((response) => {
      setSongs(response.data);
      setCurrentSongIndex(0);
    });
  }, [selectedPlaylist]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setPlayed(newTime);
    playerRef.current.seekTo(newTime);
  };

  if (songs.length === 0) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div
      className={`relative flex flex-col items-center justify-between min-h-screen px-4 ${
        darkMode ? "text-white" : "text-black"
      }`}
      style={{
        backgroundImage: `url('https://img.freepik.com/premium-photo/pixel-art-illustration-library-with-bookshelves-desk-chairs-barrels_36682-87048.jpg?w=996')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Clock Display */}
      <div className="absolute top-6 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</h1>
      </div>
      

      {/* Playlist Selector */}
      <div className="absolute top-20 flex space-x-4">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => setSelectedPlaylist(playlist.id)}
            className={`p-3 flex flex-col items-center rounded-lg transition ${
              selectedPlaylist === playlist.id ? "bg-gray-500" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {playlist.icon}
            <span className="text-xs mt-1">{playlist.label}</span>
          </button>
        ))}
      </div>

      {/* Hidden Audio Player */}
      <ReactPlayer
        ref={playerRef}
        url={songs[currentSongIndex]?.src}
        playing={isPlaying}
        volume={volume}
        onProgress={(progress) => setPlayed(progress.playedSeconds)}
        width="0"
        height="0"
      />

      <div className="absolute bottom-6 flex flex-col items-center w-full px-4">
        <div
          className={`p-4 rounded-lg w-full max-w-screen-md flex flex-col space-y-2 ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
          } shadow-lg`}
        >
          {/* Song Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaMusic className="text-xl" />
              <div>
                <h2 className="text-base font-semibold">{songs[currentSongIndex]?.title}</h2>
                <p className="text-sm opacity-75">By {songs[currentSongIndex]?.artist || ""}</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 sm:p-3 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              {darkMode ? <FaMoon /> : <FaSun />}
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>{formatTime(played)}</span>
            <input
              type="range"
              min={0}
              max={songs[currentSongIndex]?.duration || 100}
              value={played}
              onChange={handleSeekChange}
              className="w-full"
            />
            <span>{formatTime(songs[currentSongIndex]?.duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between space-x-4">
            {/* Navigation */}
            <button onClick={handlePrev} className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600">
              <FaBackward />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={handleNext} className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600">
              <FaForward />
            </button>
            <div className="flex items-center space-x-2">
              <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600">
                {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LofiPlayer;

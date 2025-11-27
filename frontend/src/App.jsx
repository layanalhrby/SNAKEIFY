import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import GameBoard from './components/GameBoard';
import { fetchLikedSongs } from './utils/spotify';
import Leaderboard from './components/Leaderboard';
import { Music, Play, Pause, Trophy, Zap, LogOut, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const {
    accessToken, setAccessToken, setUser,
    setGameState, setSongs, setNextTrack,
    gameState, score, isPaused, togglePause,
    currentTrack, bgColor
  } = useGameStore();

  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    const userId = params.get('user_id');

    if (token && userId) {
      setAccessToken(token);
      setUser({ id: userId });
      window.history.replaceState({}, document.title, "/");

      fetchLikedSongs(token).then(songs => {
        if (songs.length > 0) {
          setSongs(songs);
          setNextTrack(songs[0]);
        }
      });
    }
  }, []);

  // Initialize Spotify Player
  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Snakeify Web Player',
        getOAuthToken: cb => { cb(accessToken); },
        volume: 0.5
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        useGameStore.getState().setDeviceId(device_id);
        useGameStore.getState().setIsPlayerReady(true);
        useGameStore.getState().setPlayer(player);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        useGameStore.getState().setIsPlayerReady(false);
      });

      player.addListener('initialization_error', ({ message }) => {
        console.error("Initialization Error:", message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error("Authentication Error:", message);
      });

      player.addListener('account_error', ({ message }) => {
        console.error("Account Error:", message);
      });

      player.connect();
    };
  }, [accessToken]);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/login`;
  };

  const startGame = () => {
    setGameState('PLAYING');
  };

  // Landing Page UI
  if (!accessToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative bg-[#FFDE00]">
        {/* Geometric Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#FF90E8] border-4 border-black shadow-[8px_8px_0px_0px_black]"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#23A6F0] rounded-full border-4 border-black shadow-[8px_8px_0px_0px_black]"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white border-4 border-black rotate-45 shadow-[8px_8px_0px_0px_black]"></div>
        </div>

        <div className="relative z-10 max-w-5xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="mb-16"
          >
            <h1 className="text-6xl md:text-8xl mb-4 neo-text-title text-black leading-tight">
              SNAKEIFY
            </h1>
            <div className="inline-block bg-black text-white px-4 py-2 transform -rotate-2">
              <p className="text-2xl md:text-3xl font-bold tracking-wide font-mono">
                MUSIC. SNAKE. VIBES.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="neo-box p-8 md:p-12 bg-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center p-6 neo-box-pink transform hover:-translate-y-2 transition-transform">
                <Music className="w-12 h-12 text-black mb-4" />
                <h3 className="font-bold text-xl mb-1 font-pixel">SPOTIFY</h3>
                <p className="text-sm text-black font-bold">SYNC YOUR LIKED SONGS</p>
              </div>
              <div className="flex flex-col items-center p-6 neo-box-yellow transform hover:-translate-y-2 transition-transform">
                <Zap className="w-12 h-12 text-black mb-4" />
                <h3 className="font-bold text-xl mb-1 font-pixel">VISUALS</h3>
                <p className="text-sm text-black font-bold">COLOR ADAPTIVE BG</p>
              </div>
              <div className="flex flex-col items-center p-6 neo-box-blue transform hover:-translate-y-2 transition-transform">
                <Trophy className="w-12 h-12 text-black mb-4" />
                <h3 className="font-bold text-xl mb-1 font-pixel">RANK UP</h3>
                <p className="text-sm text-black font-bold">GLOBAL LEADERBOARD</p>
              </div>
            </div>

            {/* Changed button color to make white text visible */}
            <button
              onClick={handleLogin}
              className="neo-button bg-black text-black hover:bg-gray-800 flex items-center justify-center mx-auto text-xl"
            >
              <span>LOGIN WITH SPOTIFY</span>
              <Play className="ml-3 w-6 h-6 fill-current" />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Authenticated UI
  return (
    <div
      className="min-h-screen text-black flex flex-col items-center justify-center transition-colors duration-500 touch-none font-mono"
      style={{ backgroundColor: bgColor }}
    >
      {gameState === 'IDLE' && (
        <div className="flex flex-col items-center w-full max-w-4xl relative z-10 p-4">
          <div className="text-center mb-12">
            <h1 className="text-7xl mb-8 neo-text-title text-white drop-shadow-[4px_4px_0px_black]">READY?</h1>

            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button
                onClick={startGame}
                className="neo-button bg-[#FFDE00] text-black text-2xl"
              >
                START GAME
              </button>

              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="neo-button bg-white text-black text-2xl flex items-center gap-3"
              >
                <BarChart2 className="w-6 h-6" />
                {showLeaderboard ? "HIDE" : "LEADERBOARD"}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showLeaderboard && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full mt-8"
              >
                {/* Removed the extra container and directly render the leaderboard */}
                <Leaderboard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <>
          <GameBoard />

          {/* HUD Overlay */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-6 flex flex-col justify-between z-10">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
              <div className="neo-box p-3 flex items-center gap-4 max-w-xs bg-white pointer-events-auto">
                {currentTrack ? (
                  <>
                    <img src={currentTrack.album.images[2]?.url} className="w-12 h-12 border-2 border-black" />
                    <div className="overflow-hidden">
                      <p className="font-bold truncate font-pixel text-xs">{currentTrack.name}</p>
                      <p className="text-xs text-gray-600 truncate font-bold">{currentTrack.artists[0].name}</p>
                    </div>
                  </>
                ) : (
                  <div className="w-12 h-12 bg-gray-300 border-2 border-black animate-pulse"></div>
                )}
              </div>

              <div className="neo-box px-6 py-3 bg-[#FF90E8]">
                <span className="text-2xl font-pixel text-black">{score}</span>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between items-end w-full">
              <div className="flex gap-4 pointer-events-auto">
                <button
                  onClick={togglePause}
                  className="neo-button p-4 bg-white hover:bg-gray-100"
                >
                  {isPaused ? <Play className="w-6 h-6 text-black fill-black" /> : <Pause className="w-6 h-6 text-black stroke-[3]" />}
                </button>
                <button
                  onClick={() => {
                    setGameState('IDLE');
                    window.location.reload();
                  }}
                  className="neo-button p-4 bg-[#FF5252] hover:bg-red-600 border-4 border-black shadow-[4px_4px_0px_0px_black]"
                >
                  <LogOut className="w-6 h-6 text-black stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {gameState === 'GAME_OVER' && (
        <div className="flex flex-col items-center w-full max-w-4xl relative z-10">
          <GameBoard /> {/* GameBoard handles the Game Over Modal Overlay */}
        </div>
      )}
    </div>
  );
}

export default App;
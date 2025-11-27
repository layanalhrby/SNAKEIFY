import { create } from 'zustand';

export const useGameStore = create((set) => ({
    gameState: 'IDLE', // IDLE, PLAYING, GAME_OVER
    isPaused: false,
    score: 0,
    snakeBody: [{ x: 10, y: 10, imgUrl: null }], // Head is first
    food: null, // { x, y, track }
    currentTrack: null,
    nextTrack: null,
    direction: { x: 1, y: 0 },
    speed: 150,
    user: null,
    accessToken: null,

    songs: [], // Global song queue

    eatenSongs: [], // History of eaten songs
    bgColor: '#FF90E8', // Default background color

    // Spotify Player State
    player: null,
    deviceId: null,
    isPlayerReady: false,

    setGameState: (state) => set({ gameState: state }),
    setIsPaused: (paused) => set({ isPaused: paused }),
    togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
    setScore: (score) => set({ score }),
    incrementScore: () => set((state) => ({ score: state.score + 1 })),
    setSnakeBody: (body) => set({ snakeBody: body }),
    setFood: (food) => set({ food }),
    setCurrentTrack: (track) => set({ currentTrack: track }),
    setNextTrack: (track) => set({ nextTrack: track }),
    setSongs: (songs) => set({ songs }),
    setDirection: (dir) => set({ direction: dir }),
    setUser: (user) => set({ user }),
    setAccessToken: (token) => set({ accessToken: token }),
    addEatenSong: (song) => set((state) => ({ eatenSongs: [...state.eatenSongs, song] })),
    setBgColor: (color) => set({ bgColor: color }),
    setPlayer: (player) => set({ player }),
    setDeviceId: (deviceId) => set({ deviceId }),
    setIsPlayerReady: (isReady) => set({ isPlayerReady: isReady }),
    resetGame: () => set({
        gameState: 'IDLE',
        score: 0,
        snakeBody: [{ x: 10, y: 10, imgUrl: null }],
        direction: { x: 1, y: 0 },
        food: null,
        eatenSongs: [],
        bgColor: '#FF90E8'
    })
}));

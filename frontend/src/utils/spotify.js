export const fetchLikedSongs = async (token) => {
    let songs = [];
    let url = 'https://api.spotify.com/v1/me/tracks?limit=50';

    // Fetch enough songs to play
    while (url && songs.length < 50) {
        console.log("Fetching songs from:", url);
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error("Spotify API Error:", response.status, await response.text());
            break;
        }

        const data = await response.json();
        console.log("Fetched items:", data.items.length);

        const validSongs = data.items
            .map(item => item.track)
            .filter(track => {
                if (!track) return false;
                // Allow all tracks, even without preview
                return true;
            });

        console.log("Valid songs:", validSongs.length);

        songs = [...songs, ...validSongs];
        url = data.next;

        if (!url) break;
    }

    return songs;
};

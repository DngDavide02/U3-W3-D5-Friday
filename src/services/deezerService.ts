import { Track } from "../types";

const DEEZER_API_BASE = "https://striveschool-api.herokuapp.com/api/deezer";

export const searchTracks = async (query: string): Promise<Track[]> => {
  if (!query || !query.trim()) return [];

  try {
    const response = await fetch(`${DEEZER_API_BASE}/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limit retry
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const retryResponse = await fetch(`${DEEZER_API_BASE}/search?q=${encodeURIComponent(query)}`);
        if (!retryResponse.ok) return [];
        const data = await retryResponse.json();
        return data.data || [];
      }
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error searching tracks:", error);
    return [];
  }
};

export const getTrackById = async (id: string): Promise<Track | null> => {
  try {
    const response = await fetch(`${DEEZER_API_BASE}/track/${id}`);

    if (!response.ok) return null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting track by ID:", error);
    return null;
  }
};

export const getAlbumTracks = async (albumId: string): Promise<Track[]> => {
  try {
    const response = await fetch(`${DEEZER_API_BASE}/album/${albumId}`);

    if (!response.ok) return [];

    const data = await response.json();
    return data.tracks?.data || [];
  } catch (error) {
    console.error("Error getting album tracks:", error);
    return [];
  }
};

export const getArtistTracks = async (artistId: string): Promise<Track[]> => {
  try {
    const response = await fetch(`${DEEZER_API_BASE}/artist/${artistId}/top?limit=50`);

    if (!response.ok) return [];

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error getting artist tracks:", error);
    return [];
  }
};

export const getRandomTracks = async (limit: number = 20): Promise<Track[]> => {
  try {
    // Get variety from popular artists
    const artistIds = [13, 1, 2, 27, 137]; // Popular artists
    const allTracks: Track[] = [];

    for (const artistId of artistIds) {
      const response = await fetch(`${DEEZER_API_BASE}/artist/${artistId}/top?limit=5`);

      if (response.ok) {
        const data = await response.json();
        const tracks = data.data || [];
        allTracks.push(...tracks);
      }

      // Enough tracks collected
      if (allTracks.length >= limit) {
        break;
      }
    }

    // Fallback to random search
    if (allTracks.length < limit) {
      const randomTerms = ["a", "the", "love", "dance", "rock", "pop", "song", "music"];
      const randomTerm = randomTerms[Math.floor(Math.random() * randomTerms.length)];

      const response = await fetch(`${DEEZER_API_BASE}/search?q=${randomTerm}&limit=${limit - allTracks.length}`);

      if (response.ok) {
        const data = await response.json();
        const tracks = data.data || [];
        allTracks.push(...tracks);
      }
    }

    // Remove duplicates
    const uniqueTracks = allTracks.filter((track, index, self) => index === self.findIndex((t) => t.id === track.id));

    // Shuffle tracks
    const shuffled = uniqueTracks.sort(() => Math.random() - 0.5);

    // Limit results
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error("Error getting random tracks:", error);
    return [];
  }
};

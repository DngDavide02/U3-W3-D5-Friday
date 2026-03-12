import { Track } from '../types';

const DEEZER_API_BASE = 'https://striveschool-api.herokuapp.com/api/deezer';

export const searchTracks = async (query: string): Promise<Track[]> => {
  if (!query.trim()) return [];

  try {
    const response = await fetch(`${DEEZER_API_BASE}/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited, wait and retry once
        await new Promise(resolve => setTimeout(resolve, 2000));
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
    console.error('Error searching tracks:', error);
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
    console.error('Error getting track by ID:', error);
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
    console.error('Error getting album tracks:', error);
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
    console.error('Error getting artist tracks:', error);
    return [];
  }
};

// =============================================================================
// Enhanced Music Section Component
// =============================================================================
// Modern, responsive music section with genre-based content loading

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Loader2, Music, Disc, Radio, TrendingUp } from "lucide-react";
import { setCurrentSong } from "../store/playerSlice";
import { Track } from "../types";
import TrackCard from "./TrackCard";

interface MusicSectionProps {
  genre: string;
  title: string;
  id?: string;
  onSelectSong?: (track: Track, allTracks?: Track[]) => void;
  className?: string;
}

/**
 * Enhanced Music Section component with modern design and interactions
 * Features:
 * - Genre-based music discovery
 * - Rate limiting aware API calls
 * - Loading and error states
 * - Responsive grid layouts
 * - Smooth animations and transitions
 */
const MusicSection: React.FC<MusicSectionProps> = ({ genre, title, id, onSelectSong, className = "" }) => {
  const dispatch = useDispatch();
  const [songs, setSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Artist configuration by genre
  const artistsByGenre: Record<string, string[]> = {
    rock: ["Queen", "Led Zeppelin", "Nirvana", "Pink Floyd", "AC/DC", "Guns N' Roses"],
    pop: ["Katy Perry", "Taylor Swift", "Ariana Grande", "Dua Lipa", "Madonna", "Lady Gaga"],
    hiphop: ["Eminem", "Kendrick Lamar", "Drake", "Snoop Dogg", "Jay Z", "50 Cent"],
    electronic: ["Daft Punk", "Deadmau5", "Skrillex", "Calvin Harris", "Avicii", "Swedish House Mafia"],
    jazz: ["Miles Davis", "John Coltrane", "Bill Evans", "Herbie Hancock", "Wayne Shorter"],
    classical: ["Mozart", "Beethoven", "Bach", "Chopin", "Vivaldi"],
  };

  // Shuffle array utility
  const shuffleArray = useCallback(<T extends any>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Fetch songs from artists with rate limiting
  const fetchSongsFromArtists = useCallback(
    async (artistList: string[]) => {
      const selectedSongs: Track[] = [];
      setLoading(true);
      setError(null);

      try {
        // Add delay between requests to avoid rate limiting
        for (let i = 0; i < artistList.length; i++) {
          const artist = artistList[i];

          // Add delay between requests (500ms)
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }

          const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(artist)}`);

          if (response.ok) {
            const { data } = await response.json();
            if (data && data.length > 0) {
              const topSongs = data.slice(0, 5);
              selectedSongs.push(...topSongs);
            }
          } else if (response.status === 429) {
            // If rate limited, wait longer and retry once
            console.log(`Rate limited for ${artist}, waiting 2 seconds...`);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            continue; // Skip this artist for now
          }
        }

        shuffleArray(selectedSongs);
        setSongs(selectedSongs.slice(0, 12));
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError("Failed to load music. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [shuffleArray],
  );

  // Handle track selection
  const handleSelectSong = useCallback(
    (track: Track) => {
      dispatch(setCurrentSong(track));
      onSelectSong?.(track, songs);
    },
    [dispatch, onSelectSong, songs],
  );

  // Handle retry
  const handleRetry = useCallback(() => {
    const artistList = artistsByGenre[genre.toLowerCase()] || [];
    const shuffledArtists = shuffleArray(artistList).slice(0, 3);
    fetchSongsFromArtists(shuffledArtists);
  }, [genre, shuffleArray, fetchSongsFromArtists]);

  // Load genre content on mount
  useEffect(() => {
    const artistList = artistsByGenre[genre.toLowerCase()] || [];
    // Get only first 3 artists per genre to reduce API load
    const shuffledArtists = shuffleArray(artistList).slice(0, 3);
    fetchSongsFromArtists(shuffledArtists);
  }, [genre, shuffleArray, fetchSongsFromArtists]);

  // Get genre icon
  const getGenreIcon = useCallback(() => {
    const icons = {
      rock: Disc,
      pop: Music,
      hiphop: Radio,
      electronic: TrendingUp,
      jazz: Music,
      classical: Disc,
    };
    return icons[genre.toLowerCase() as keyof typeof icons] || Music;
  }, [genre]);

  const GenreIcon = getGenreIcon();

  return (
    <section className={`mb-8 px-4 lg:px-6 ${className}`} id={id}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-spotify-green rounded-lg flex items-center justify-center">
            <GenreIcon size={16} className="text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <span className="text-spotify-lighterGray text-sm">({songs.length} tracks)</span>
        </div>

        <button
          className="text-spotify-lighterGray hover:text-white transition-colors duration-200 text-sm font-medium flex items-center space-x-1"
          onClick={handleRetry}
          disabled={loading}
        >
          <span>Refresh</span>
        </button>
      </div>

      {/* Content */}
      <div className="relative">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="animate-spin text-spotify-green" size={40} />
              <p className="text-spotify-lighterGray text-lg font-medium">Loading amazing music...</p>
              <p className="text-spotify-lighterGray text-sm">Discovering {title} tracks for you</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <GenreIcon size={32} className="text-red-400" />
              </div>
              <p className="text-red-400 text-lg font-medium">Oops! Something went wrong</p>
              <p className="text-spotify-lighterGray text-sm">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-4 px-6 py-2 bg-spotify-green text-black rounded-full font-medium hover:bg-spotify-greenHover transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Songs Grid */}
        {!loading && !error && songs.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {songs.map((song, index) => (
              <TrackCard
                key={`${genre}-${song.id}-${index}`}
                track={song}
                onClick={() => handleSelectSong(song)}
                size="medium"
                variant="card"
                showArtist={true}
                className="transform transition-all duration-300 hover:scale-105"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && songs.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-spotify-gray rounded-full flex items-center justify-center">
                <GenreIcon size={32} className="text-spotify-lighterGray" />
              </div>
              <p className="text-spotify-lighterGray text-lg font-medium">No music found</p>
              <p className="text-spotify-lighterGray text-sm">We couldn't find any {title} tracks. Try refreshing or explore other genres.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MusicSection;

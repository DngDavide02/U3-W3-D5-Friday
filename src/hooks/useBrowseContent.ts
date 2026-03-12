import { useState, useCallback } from "react";
import { Track } from "../types";

export interface BrowseCategory {
  name: string;
  searchQuery: string;
  description: string;
}

export const useBrowseContent = () => {
  const [content, setContent] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Artist configuration by genre (same as MusicSection)
  const artistsByGenre: Record<string, string[]> = {
    Trending: ["Taylor Swift", "Drake", "Bad Bunny", "The Weeknd", "Ed Sheeran", "Dua Lipa"],
    Rock: ["Queen", "Led Zeppelin", "Nirvana", "Pink Floyd", "AC/DC", "Guns N' Roses"],
    Pop: ["Katy Perry", "Taylor Swift", "Ariana Grande", "Dua Lipa", "Madonna", "Lady Gaga"],
    "Hip Hop": ["Eminem", "Kendrick Lamar", "Drake", "Snoop Dogg", "Jay Z", "50 Cent"],
    Electronic: ["Daft Punk", "Deadmau5", "Skrillex", "Calvin Harris", "Avicii", "Swedish House Mafia"],
    Chill: ["Billie Eilish", "Lofi Fruits", "Chillhop", "J Dilla", "Nujabes", "Bonobo"],
  };

  const browseCategories: BrowseCategory[] = [
    {
      name: "Trending",
      searchQuery: "trending",
      description: "Popular tracks right now",
    },
    {
      name: "Rock",
      searchQuery: "rock",
      description: "Best rock hits",
    },
    {
      name: "Pop",
      searchQuery: "pop",
      description: "Today's top pop music",
    },
    {
      name: "Hip Hop",
      searchQuery: "hip hop",
      description: "Latest hip hop tracks",
    },
    {
      name: "Electronic",
      searchQuery: "electronic",
      description: "Electronic and dance music",
    },
    {
      name: "Chill",
      searchQuery: "chill",
      description: "Relaxing and chill music",
    },
  ];

  // Shuffle array utility (same as MusicSection)
  const shuffleArray = useCallback(<T extends any>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Fetch songs from artists with rate limiting (same as MusicSection)
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
        setContent(selectedSongs.slice(0, 12));
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError("Failed to load music. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [shuffleArray],
  );

  const loadCategoryContent = useCallback(
    async (category: BrowseCategory) => {
      console.log(`Loading category: ${category.name} with artists`);

      setSelectedCategory(category.name);

      const artistList = artistsByGenre[category.name] || [];
      const shuffledArtists = shuffleArray(artistList).slice(0, 3);
      console.log(`Using artists: ${shuffledArtists.join(", ")}`);

      await fetchSongsFromArtists(shuffledArtists);
    },
    [shuffleArray, fetchSongsFromArtists],
  );

  const clearContent = useCallback(() => {
    console.log("Clearing content");
    setContent([]);
    setSelectedCategory(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    content,
    loading,
    error,
    selectedCategory,
    browseCategories,
    loadCategoryContent,
    clearContent,
  };
};

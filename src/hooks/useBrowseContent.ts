import { useState, useCallback } from 'react';
import { searchTracks } from '../services/deezerService';
import { Track } from '../types';

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

  const browseCategories: BrowseCategory[] = [
    {
      name: "Trending",
      searchQuery: "trending 2024",
      description: "The hottest tracks right now"
    },
    {
      name: "Podcasts", 
      searchQuery: "podcast music",
      description: "Popular music podcasts"
    },
    {
      name: "Moods & Genres",
      searchQuery: "chill vibes",
      description: "Music for every mood"
    },
    {
      name: "New Releases",
      searchQuery: "new releases 2024",
      description: "Fresh music this week"
    },
    {
      name: "Discover",
      searchQuery: "indie discover",
      description: "Hidden gems and new artists"
    }
  ];

  const loadCategoryContent = useCallback(async (category: BrowseCategory) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(category.name);

    try {
      const results = await searchTracks(category.searchQuery);
      
      // Shuffle and limit results for better variety
      const shuffled = results.sort(() => 0.5 - Math.random());
      setContent(shuffled.slice(0, 12));
    } catch (err) {
      setError('Failed to load content');
      console.error('Browse error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearContent = useCallback(() => {
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
    clearContent
  };
};

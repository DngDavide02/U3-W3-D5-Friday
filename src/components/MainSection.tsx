// Main section component

import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp, Radio, Smile, Disc, Compass, Music, Headphones, Mic2, Globe, Clock } from "lucide-react";
import MusicSection from "./MusicSection";
import TrackCard from "./TrackCard";
import { setCurrentSong, setQueue } from "../store/playerSlice";
import { RootState } from "../store";
import { Track } from "../types";
import { useBrowseContent } from "../hooks/useBrowseContent";
import { getRandomTracks } from "../services/deezerService";

interface MainSectionProps {
  className?: string;
}

/**
 * Main section with browse and search functionality
 */
const MainSection: React.FC<MainSectionProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const searchResults = useSelector((state: RootState) => state.search.results);
  const { content, loading, error, selectedCategory, browseCategories, loadCategoryContent, clearContent } = useBrowseContent();
  const [randomTracks, setRandomTracks] = useState<Track[]>([]);
  const [showRandomTracks, setShowRandomTracks] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);

  // Handle view all
  const handleViewAll = useCallback(async () => {
    setRandomLoading(true);
    setShowRandomTracks(true);
    // Don't clear content here, let random tracks replace it

    try {
      const tracks = await getRandomTracks(20);
      setRandomTracks(tracks);
    } catch (error) {
      console.error("Error loading random tracks:", error);
    } finally {
      setRandomLoading(false);
    }
  }, []);

  // Handle track selection
  const handleSelectSong = useCallback(
    (track: Track, allTracks?: Track[]) => {
      dispatch(setCurrentSong(track));

      // Set queue if provided
      if (allTracks && allTracks.length > 0) {
        dispatch(setQueue(allTracks));
      }
    },
    [dispatch],
  );

  // Handle category click
  const handleCategoryClick = useCallback(
    (category: (typeof browseCategories)[0]) => {
      if (selectedCategory === category.name) {
        clearContent();
      } else {
        loadCategoryContent(category);
      }
    },
    [selectedCategory, loadCategoryContent, clearContent],
  );

  // Get category icon
  const getIconForCategory = useCallback((index: number) => {
    const icons = [TrendingUp, Radio, Smile, Disc, Compass, Music, Headphones, Mic2, Globe];
    return icons[index % icons.length];
  }, []);

  return (
    <div className={`px-4 lg:px-6 py-6 ${className}`}>
      {/* Browse Categories Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Browse</h2>
          <button onClick={handleViewAll} className="text-spotify-lighterGray hover:text-white transition-colors duration-200 text-sm font-medium">
            Random Songs
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {browseCategories.map((category, index) => {
            const Icon = getIconForCategory(index);
            const isSelected = selectedCategory === category.name;

            return (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category)}
                className={`group relative overflow-hidden rounded-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-strong ${
                  isSelected ? `bg-gradient-to-br from-purple-600 to-blue-600 ring-2 ring-white shadow-strong` : "bg-spotify-gray hover:bg-spotify-lighterGray"
                }`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                </div>

                {/* Icon */}
                <div className="relative z-10 mb-4">
                  <Icon
                    size={32}
                    className={`transition-all duration-300 ${isSelected ? "text-white scale-110" : "text-spotify-lighterGray group-hover:text-white"}`}
                  />
                </div>

                {/* Title */}
                <h3
                  className={`text-sm font-bold transition-all duration-300 ${isSelected ? "text-white" : "text-spotify-lighterGray group-hover:text-white"}`}
                >
                  {category.name}
                </h3>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Display */}
      <div className="space-y-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full animate-spin" />
              <p className="text-spotify-lighterGray text-lg">Loading amazing music...</p>
            </div>
          </div>
        )}

        {/* Random Tracks Loading State */}
        {randomLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full animate-spin" />
              <p className="text-spotify-lighterGray text-lg">Loading random tracks...</p>
            </div>
          </div>
        )}

        {/* Random Tracks Display */}
        {showRandomTracks && !randomLoading && randomTracks.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span>Random Tracks</span>
                <span className="ml-3 text-spotify-lighterGray text-base font-normal">({randomTracks.length} tracks)</span>
              </h3>

              <button
                onClick={() => setShowRandomTracks(false)}
                className="text-spotify-lighterGray hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Clear
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {randomTracks.map((track: Track, index: number) => (
                <TrackCard
                  key={`${track.id}-${index}`}
                  track={track}
                  onClick={() => handleSelectSong(track, randomTracks)}
                  size="medium"
                  variant="card"
                  showArtist={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <Clock size={32} className="text-red-400" />
              </div>
              <p className="text-red-400 text-lg font-medium">Oops! Something went wrong</p>
              <p className="text-spotify-lighterGray text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-spotify-green text-black rounded-full font-medium hover:bg-spotify-greenHover transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && !loading && !error && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span>Search Results</span>
              <span className="ml-3 text-spotify-lighterGray text-base font-normal">({searchResults.length} tracks)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {searchResults.map((track: Track, index: number) => (
                <TrackCard
                  key={`${track.id}-${index}`}
                  track={track}
                  onClick={() => handleSelectSong(track, searchResults)}
                  size="medium"
                  variant="card"
                  showArtist={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Category Content */}
        {content.length > 0 && !loading && !error && selectedCategory && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span>
                <span className="ml-3 text-spotify-lighterGray text-base font-normal">({content.length} tracks)</span>
              </h3>

              <button onClick={clearContent} className="text-spotify-lighterGray hover:text-white transition-colors duration-200 text-sm font-medium">
                Clear
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {content.map((track: Track, index: number) => (
                <TrackCard
                  key={`${track.id}-${index}`}
                  track={track}
                  onClick={() => handleSelectSong(track, content)}
                  size="medium"
                  variant="card"
                  showArtist={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && searchResults.length === 0 && content.length === 0 && !selectedCategory && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-spotify-gray rounded-full flex items-center justify-center">
                <Globe size={40} className="text-spotify-lighterGray" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Start exploring</h3>
                <p className="text-spotify-lighterGray text-base max-w-md">
                  Choose a category above to discover amazing music, or use the search bar to find your favorite tracks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Music Sections */}
        {!loading && !error && searchResults.length === 0 && content.length === 0 && !selectedCategory && (
          <div className="space-y-8">
            {browseCategories.slice(1, 4).map((section) => (
              <MusicSection key={section.name} genre={section.name} title={section.name} onSelectSong={handleSelectSong} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainSection;

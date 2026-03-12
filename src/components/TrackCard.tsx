// =============================================================================
// Enhanced Track Card Component
// =============================================================================
// Modern, responsive track card with hover effects and interactions

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "../store/likeSlice";
import { setCurrentSong } from "../store/playerSlice";
import { Heart, Play, MoreHorizontal } from "lucide-react";
import { RootState } from "../store";
import { Track } from "../types";

interface TrackCardProps {
  track: Track;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  variant?: "card" | "list" | "compact";
  showArtist?: boolean;
  showAlbum?: boolean;
  showDuration?: boolean;
  className?: string;
}

/**
 * Enhanced Track Card component with modern design and interactions
 * Features:
 * - Multiple size variants (small, medium, large)
 * - Multiple layout variants (card, list, compact)
 * - Hover effects with play button overlay
 * - Like functionality
 * - Responsive design
 * - Accessibility support
 */
const TrackCard: React.FC<TrackCardProps> = ({
  track,
  onClick,
  size = "medium",
  variant = "card",
  showArtist = true,
  showAlbum = false,
  showDuration = false,
  className = "",
}) => {
  const dispatch = useDispatch();
  const liked = useSelector((state: RootState) => state.likes.likedSongs[track.id]);

  // Handle like toggle with event propagation stop
  const handleToggleLike = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(toggleLike(track));
    },
    [dispatch, track],
  );

  // Handle track click with auto-play
  const handleTrackClick = useCallback(() => {
    dispatch(setCurrentSong(track));
    onClick?.();
  }, [dispatch, track, onClick]);

  // Handle more options
  const handleMoreOptions = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Future: Implement context menu or modal
      console.log("More options for:", track.title);
    },
    [track],
  );

  // Get track information with fallbacks
  const cover = track?.album?.cover_medium || "https://via.placeholder.com/250x250?text=No+Cover";
  const artist = track?.artist?.name || "Unknown Artist";
  const title = track?.title || "Untitled";
  const album = track?.album?.title || "Unknown Album";

  // Size configurations
  const sizeClasses = {
    small: {
      container: "max-w-[160px]",
      cover: "w-32 h-32",
      title: "text-sm",
      artist: "text-xs",
    },
    medium: {
      container: "max-w-[200px]",
      cover: "w-48 h-48",
      title: "text-base",
      artist: "text-sm",
    },
    large: {
      container: "max-w-[280px]",
      cover: "w-64 h-64",
      title: "text-lg",
      artist: "text-base",
    },
  };

  const currentSize = sizeClasses[size];

  // Format duration
  const formatDuration = (duration: number): string => {
    if (!duration || isNaN(duration)) return "";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Card Variant
  if (variant === "card") {
    return (
      <div
        className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${currentSize.container} ${className}`}
        onClick={handleTrackClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleTrackClick()}
        aria-label={`Play ${title} by ${artist}`}
      >
        {/* Album Cover with Play Overlay */}
        <div className="relative overflow-hidden rounded-lg mb-3 shadow-medium group-hover:shadow-strong transition-all duration-300">
          <img
            src={cover}
            alt={`${title} album cover`}
            className={`${currentSize.cover} w-full object-cover transition-transform duration-300 group-hover:scale-110`}
            loading="lazy"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="bg-spotify-green rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-strong">
              <Play size={size === "small" ? 16 : size === "medium" ? 20 : 24} className="text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-opacity-80"
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={16} className={`${liked ? "text-spotify-green fill-spotify-green" : "text-white"} transition-colors duration-200`} />
          </button>
        </div>

        {/* Track Information */}
        <div className="space-y-1">
          <h3 className={`${currentSize.title} text-white font-medium truncate hover:text-spotify-green transition-colors duration-200`}>{title}</h3>
          {showArtist && <p className={`${currentSize.artist} text-spotify-lighterGray truncate hover:text-white transition-colors duration-200`}>{artist}</p>}
          {showAlbum && <p className={`${currentSize.artist} text-spotify-lighterGray truncate hover:text-white transition-colors duration-200`}>{album}</p>}
          {showDuration && track.duration && <p className={`${currentSize.artist} text-spotify-lighterGray`}>{formatDuration(track.duration)}</p>}
        </div>
      </div>
    );
  }

  // List Variant
  if (variant === "list") {
    return (
      <div
        className={`group flex items-center p-3 rounded-lg hover:bg-spotify-gray transition-colors duration-200 cursor-pointer ${className}`}
        onClick={handleTrackClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleTrackClick()}
        aria-label={`Play ${title} by ${artist}`}
      >
        {/* Album Cover */}
        <img src={cover} alt={`${title} album cover`} className="w-12 h-12 rounded-md object-cover mr-4" loading="lazy" />

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate hover:text-spotify-green transition-colors duration-200">{title}</h4>
          {showArtist && <p className="text-spotify-lighterGray text-sm truncate hover:text-white transition-colors duration-200">{artist}</p>}
        </div>

        {/* Duration */}
        {showDuration && track.duration && <span className="text-spotify-lighterGray text-sm mr-4">{formatDuration(track.duration)}</span>}

        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleToggleLike}
            className="text-spotify-lighterGray hover:text-white transition-colors duration-200 p-1"
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={16} className={`${liked ? "text-spotify-green fill-spotify-green" : ""} transition-colors duration-200`} />
          </button>
          <button
            onClick={handleMoreOptions}
            className="text-spotify-lighterGray hover:text-white transition-colors duration-200 p-1"
            aria-label="More options"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Play Button */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTrackClick();
            }}
            className="text-spotify-lighterGray hover:text-white transition-colors duration-200 p-1"
            aria-label="Play"
          >
            <Play size={16} className="fill-current ml-0.5" />
          </button>
        </div>
      </div>
    );
  }

  // Compact Variant
  return (
    <div
      className={`group flex items-center p-2 rounded hover:bg-spotify-gray transition-colors duration-200 cursor-pointer ${className}`}
      onClick={handleTrackClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleTrackClick()}
      aria-label={`Play ${title} by ${artist}`}
    >
      {/* Album Cover */}
      <img src={cover} alt={`${title} album cover`} className="w-10 h-10 rounded object-cover mr-3" loading="lazy" />

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white text-sm font-medium truncate hover:text-spotify-green transition-colors duration-200">{title}</h4>
        {showArtist && <p className="text-spotify-lighterGray text-xs truncate hover:text-white transition-colors duration-200">{artist}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleToggleLike}
          className="text-spotify-lighterGray hover:text-white transition-colors duration-200 p-1"
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={14} className={`${liked ? "text-spotify-green fill-spotify-green" : ""} transition-colors duration-200`} />
        </button>
      </div>
    </div>
  );
};

export default TrackCard;

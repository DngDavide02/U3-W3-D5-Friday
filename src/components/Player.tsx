import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { RootState } from "../store";
import { togglePlayPause, setPlaying, setCurrentTime, setDuration, setVolume, toggleMute, nextTrack, previousTrack } from "../store/playerSlice";
import VolumeControl from "./VolumeControl";
import { Track } from "../types";

interface PlayerProps {
  className?: string;
}

const Player: React.FC<PlayerProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Get player state
  const playerState = useSelector((state: RootState) => state.player);
  const { currentSong, isPlaying, volume, isMuted, currentTime, duration } = playerState;

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    dispatch(togglePlayPause());
  }, [dispatch]);

  // Handle next/previous
  const handleNext = useCallback(() => {
    dispatch(nextTrack());
  }, [dispatch]);

  const handlePrevious = useCallback(() => {
    dispatch(previousTrack());
  }, [dispatch]);

  // Handle volume change
  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      dispatch(setVolume(newVolume));
    },
    [dispatch],
  );

  // Handle mute toggle
  const handleMuteToggle = useCallback(() => {
    dispatch(toggleMute());
  }, [dispatch]);

  // Handle progress bar click
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !audioRef.current) return;

      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = (clickX / rect.width) * 100;

      audioRef.current.currentTime = (percentage / 100) * duration;
      dispatch(setCurrentTime(audioRef.current.currentTime));
    },
    [dispatch, duration],
  );

  // Format time
  const formatTime = (time: number): string => {
    if (isNaN(time) || !isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch(setCurrentTime(audio.currentTime));
    };

    const handleLoadedMetadata = () => {
      dispatch(setDuration(audio.duration));
    };

    const handleEnded = () => {
      dispatch(nextTrack());
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [dispatch]);

  // Handle playback
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && currentSong?.preview) {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
        dispatch(setPlaying(false));
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong, dispatch]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // If no current song, show minimal player
  if (!currentSong) {
    return (
      <div className={`bg-spotify-darker border-t border-spotify-gray px-4 py-2 ${className}`}>
        <div className="flex items-center justify-center">
          <p className="text-spotify-lighterGray text-sm">No track selected</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={currentSong.preview} preload="metadata" />

      {/* Main Player */}
      <div className={`bg-spotify-darker border-t border-spotify-gray px-4 py-3 fixed bottom-0 left-0 right-0 z-50 ${className}`}>
        <div className="grid grid-cols-3 items-center gap-4">
          {/* Left Section - Track Info */}
          <div className="flex items-center space-x-3 min-w-0">
            <img src={currentSong.album.cover_medium} alt={currentSong.album.title} className="w-14 h-14 rounded-md" />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate text-sm">{currentSong.title}</h3>
              <p className="text-spotify-lighterGray text-xs truncate">{currentSong.artist.name}</p>
            </div>
          </div>

          {/* Center Section - Player Controls */}
          <div className="flex flex-col items-center space-y-2">
            {/* Control Buttons */}
            <div className="flex items-center space-x-4">
              <button onClick={handlePrevious} className="text-spotify-lighterGray hover:text-white transition-colors" aria-label="Previous track">
                <SkipBack size={20} />
              </button>

              <button
                onClick={handlePlayPause}
                className="bg-white text-black rounded-full p-2 hover:scale-105 transition-all duration-200"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>

              <button onClick={handleNext} className="text-spotify-lighterGray hover:text-white transition-colors" aria-label="Next track">
                <SkipForward size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-2 w-full max-w-md">
              <span className="text-xs text-spotify-lighterGray min-w-[40px] text-right">{formatTime(currentTime)}</span>

              <div
                ref={progressRef}
                className="flex-1 h-1 bg-spotify-gray rounded-full cursor-pointer group hover:h-1.5 transition-all duration-200"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-100 group-hover:bg-spotify-green relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-soft" />
                </div>
              </div>

              <span className="text-xs text-spotify-lighterGray min-w-[40px]">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Section - Volume Control */}
          <div className="flex items-center justify-end space-x-3">
            <VolumeControl volume={volume} isMuted={isMuted} onVolumeChange={handleVolumeChange} onMuteToggle={handleMuteToggle} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;

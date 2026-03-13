// Player component
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { RootState } from "../store";
import { togglePlayPause, setPlaying, setCurrentTime, setDuration, setVolume, toggleMute, nextTrack, previousTrack } from "../store/playerSlice";
import VolumeControl from "./VolumeControl";

interface PlayerProps {
  className?: string;
}

// Keyboard controls
const useKeyboardControls = () => {
  const dispatch = useDispatch();
  const { isPlaying } = useSelector((state: RootState) => state.player);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip when typing
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          dispatch(togglePlayPause());
          break;
        case "ArrowRight":
          e.preventDefault();
          dispatch(nextTrack());
          break;
        case "ArrowLeft":
          e.preventDefault();
          dispatch(previousTrack());
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, isPlaying]);
};

const Player: React.FC<PlayerProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Enable keyboard controls
  useKeyboardControls();

  // Get player state with shallow equality for better re-renders
  const currentSong = useSelector((state: RootState) => state.player.currentSong);
  const isPlaying = useSelector((state: RootState) => state.player.isPlaying);
  const volume = useSelector((state: RootState) => state.player.volume);
  const isMuted = useSelector((state: RootState) => state.player.isMuted);
  const currentTime = useSelector((state: RootState) => state.player.currentTime);
  const duration = useSelector((state: RootState) => state.player.duration);

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

  // Handle progress bar interaction (click and drag)
  const handleProgressChange = useCallback(
    (clientX: number) => {
      if (!progressRef.current || !audioRef.current) {
        console.log("Progress change blocked: missing refs");
        return;
      }

      const rect = progressRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const percentage = x / rect.width;

      // Use current duration from state or audio element
      const currentDuration = duration || audioRef.current.duration;

      if (!currentDuration || isNaN(currentDuration) || !isFinite(currentDuration)) {
        console.log("Progress change blocked: invalid duration", { duration, audioDuration: audioRef.current.duration });
        return;
      }

      const newTime = percentage * currentDuration;

      console.log("Progress change:", { x, percentage, newTime, duration: currentDuration });

      audioRef.current.currentTime = newTime;
      dispatch(setCurrentTime(newTime));
    },
    [dispatch, duration],
  );

  // Handle progress bar click
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      handleProgressChange(e.clientX);
    },
    [handleProgressChange],
  );

  // Handle progress bar drag
  const handleProgressMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        handleProgressChange(moveEvent.clientX);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      // Initial click
      handleProgressChange(e.clientX);
    },
    [handleProgressChange],
  );

  // Format time
  const formatTime = (time: number): string => {
    if (isNaN(time) || !isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 && !isNaN(duration) && isFinite(duration) ? (currentTime / duration) * 100 : 0;

  // Handle audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      // Don't update time during dragging to prevent conflicts
      if (!isDragging) {
        dispatch(setCurrentTime(audio.currentTime));
      }
    };

    const handleLoadedMetadata = () => {
      const audioDuration = audio.duration;
      if (!isNaN(audioDuration) && isFinite(audioDuration)) {
        dispatch(setDuration(audioDuration));
      } else if (currentSong?.duration) {
        dispatch(setDuration(currentSong.duration));
      } else {
        // Default to 30 seconds for Deezer preview tracks
        dispatch(setDuration(30));
      }
    };

    const handleEnded = () => {
      dispatch(nextTrack());
    };

    const handleCanPlay = () => {
      // Update duration when audio can play
      const audioDuration = audio.duration;
      if (!isNaN(audioDuration) && isFinite(audioDuration)) {
        dispatch(setDuration(audioDuration));
      }
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
    };
  }, [dispatch, isDragging, currentSong]);

  // Handle song change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    // Reset time when song changes
    dispatch(setCurrentTime(0));

    // Load new song
    audio.src = currentSong.preview;
    audio.load();

    // Don't set duration here, let the audio element handle it
    // The duration will be set in the loadedmetadata and canplay events
  }, [currentSong, dispatch]);

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
      <audio ref={audioRef} preload="metadata" />

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
                className={`flex-1 h-1 bg-spotify-gray rounded-full cursor-pointer group hover:h-1.5 transition-all duration-200 ${isDragging ? "h-1.5" : ""} ${isLoading ? "opacity-70" : ""}`}
                onClick={handleProgressClick}
                onMouseDown={handleProgressMouseDown}
              >
                <div
                  className={`h-full rounded-full transition-all duration-100 relative ${
                    isDragging ? "bg-spotify-green" : isLoading ? "bg-spotify-lighterGray animate-pulse" : "bg-white group-hover:bg-spotify-green"
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div
                    className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-soft transition-all duration-200 ${
                      isDragging ? "opacity-100 scale-125" : isLoading ? "opacity-50" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
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

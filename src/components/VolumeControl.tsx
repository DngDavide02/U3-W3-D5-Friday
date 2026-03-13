// Volume control component

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { RootState } from "../store";
import { setVolume, toggleMute } from "../store/playerSlice";

interface VolumeControlProps {
  volume?: number;
  isMuted?: boolean;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
  className?: string;
}

/**
 * Volume control with drag and keyboard support
 */
const VolumeControl: React.FC<VolumeControlProps> = ({
  volume: propVolume,
  isMuted: propIsMuted,
  onVolumeChange: propOnVolumeChange,
  onMuteToggle: propOnMuteToggle,
  className = "",
}) => {
  const dispatch = useDispatch();
  const volumeSliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Get player state
  const playerVolume = useSelector((state: RootState) => state.player.volume);
  const playerIsMuted = useSelector((state: RootState) => state.player.isMuted);

  const volume = propVolume ?? playerVolume;
  const isMuted = propIsMuted ?? playerIsMuted;

  // Calculate volume
  const effectiveVolume = isMuted ? 0 : volume;

  // Get volume icon
  const getVolumeIcon = useCallback(() => {
    if (effectiveVolume === 0 || isMuted) return VolumeX;
    if (effectiveVolume < 0.33) return Volume;
    if (effectiveVolume < 0.66) return Volume1;
    return Volume2;
  }, [effectiveVolume, isMuted]);

  const VolumeIcon = getVolumeIcon();

  // Handle volume change
  const handleVolumeChange = useCallback(
    (clientX: number) => {
      if (!volumeSliderRef.current) return;

      const rect = volumeSliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const newVolume = x / rect.width;

      if (propOnVolumeChange) {
        propOnVolumeChange(newVolume);
      } else {
        dispatch(setVolume(newVolume));
      }
    },
    [dispatch, propOnVolumeChange],
  );

  // Handle mute toggle
  const handleMuteToggle = useCallback(() => {
    if (propOnMuteToggle) {
      propOnMuteToggle();
    } else {
      dispatch(toggleMute());
    }
  }, [dispatch, propOnMuteToggle]);

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      handleVolumeChange(e.clientX);
    },
    [handleVolumeChange],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        handleVolumeChange(e.clientX);
      }
    },
    [isDragging, handleVolumeChange],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          const newVolumeDown = Math.max(0, volume - 0.1);
          if (propOnVolumeChange) {
            propOnVolumeChange(newVolumeDown);
          } else {
            dispatch(setVolume(newVolumeDown));
          }
          break;
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          const newVolumeUp = Math.min(1, volume + 0.1);
          if (propOnVolumeChange) {
            propOnVolumeChange(newVolumeUp);
          } else {
            dispatch(setVolume(newVolumeUp));
          }
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          handleMuteToggle();
          break;
      }
    },
    [volume, dispatch, propOnVolumeChange, handleMuteToggle],
  );

  // Global drag listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Format percentage
  const formatVolumePercentage = (vol: number): string => {
    return `${Math.round(vol * 100)}%`;
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      {/* Mute Button */}
      <button
        onClick={handleMuteToggle}
        className="text-spotify-lighterGray hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-spotify-gray group"
        aria-label={isMuted ? "Unmute" : "Mute"}
        title={`Volume: ${formatVolumePercentage(effectiveVolume)}`}
      >
        <VolumeIcon
          size={20}
          className={`transition-colors duration-200 ${
            isMuted || effectiveVolume === 0 ? "text-spotify-lighterGray group-hover:text-white" : "text-spotify-lighterGray group-hover:text-white"
          }`}
        />
      </button>

      {/* Volume Slider */}
      <div className={`flex items-center space-x-2 transition-opacity duration-200 ${isHovering || isDragging ? "opacity-100" : "opacity-70"}`}>
        {/* Slider Track */}
        <div
          ref={volumeSliderRef}
          className="w-24 h-1 bg-spotify-gray rounded-full cursor-pointer relative group hover:h-1.5 transition-all duration-200"
          onMouseDown={handleMouseDown}
          onClick={(e) => handleVolumeChange(e.clientX)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-label="Volume"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(effectiveVolume * 100)}
          aria-orientation="horizontal"
        >
          {/* Volume Fill */}
          <div
            className="h-full bg-white rounded-full transition-all duration-150 group-hover:bg-spotify-green relative"
            style={{ width: `${effectiveVolume * 100}%` }}
          >
            {/* Slider Thumb */}
            <div
              className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-soft transition-all duration-200 border border-spotify-gray ${
                isHovering || isDragging ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100"
              }`}
            />
          </div>
        </div>

        {/* Volume Display */}
        <span className="text-xs text-spotify-lighterGray min-w-[40px] text-right tabular-nums font-mono">{formatVolumePercentage(effectiveVolume)}</span>
      </div>
    </div>
  );
};

export default VolumeControl;

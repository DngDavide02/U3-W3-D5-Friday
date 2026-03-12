// =============================================================================
// Player Slice - Modern Redux Toolkit Implementation
// =============================================================================
// Enhanced player state management with comprehensive controls and type safety

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Track, RepeatMode } from "../types";

// Modern player state interface with enhanced features
export interface PlayerState {
  // Current track information
  currentSong: Track | null;

  // Playback state
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;

  // Volume controls
  volume: number; // 0 to 1
  isMuted: boolean;
  previousVolume: number; // For unmute functionality

  // Playback modes
  isShuffled: boolean;
  repeatMode: RepeatMode;

  // Time tracking
  currentTime: number; // Current position in seconds
  duration: number; // Total duration in seconds
  progress: number; // Progress percentage 0-100

  // Queue management (future enhancement)
  queue: Track[];
  queueIndex: number;

  // Playback history
  history: Track[];

  // Audio metadata
  playbackRate: number; // For speed control
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  isLoading: false,
  error: null,
  volume: 0.7, // Default to 70% volume
  isMuted: false,
  previousVolume: 0.7,
  isShuffled: false,
  repeatMode: RepeatMode.OFF,
  currentTime: 0,
  duration: 0,
  progress: 0,
  queue: [],
  queueIndex: -1,
  history: [],
  playbackRate: 1.0,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    // Track Management
    setCurrentSong: (state, action: PayloadAction<Track>) => {
      // Add current song to history if it exists
      if (state.currentSong) {
        state.history.unshift(state.currentSong);
        // Limit history to 50 songs
        if (state.history.length > 50) {
          state.history = state.history.slice(0, 50);
        }
      }

      // Set new song and reset playback state
      state.currentSong = action.payload;
      state.currentTime = 0;
      state.duration = action.payload.duration || 0;
      state.progress = 0;
      state.isPlaying = true;
      state.error = null;

      // Add to queue if not already there
      if (!state.queue.find((track) => track.id === action.payload.id)) {
        state.queue.push(action.payload);
      }
      state.queueIndex = state.queue.findIndex((track) => track.id === action.payload.id);
    },

    // Playback Controls
    togglePlayPause: (state) => {
      if (!state.currentSong) {
        state.error = "No track selected";
        return;
      }
      state.isPlaying = !state.isPlaying;
      state.error = null;
    },

    setPlaying: (state, action: PayloadAction<boolean>) => {
      if (!state.currentSong && action.payload) {
        state.error = "No track selected";
        return;
      }
      state.isPlaying = action.payload;
      state.error = null;
    },

    stop: (state) => {
      state.isPlaying = false;
      state.currentTime = 0;
      state.progress = 0;
      state.currentSong = null;
      state.queueIndex = -1;
      state.error = null;
    },

    pause: (state) => {
      state.isPlaying = false;
    },

    resume: (state) => {
      if (!state.currentSong) {
        state.error = "No track selected";
        return;
      }
      state.isPlaying = true;
      state.error = null;
    },

    // Volume Controls
    setVolume: (state, action: PayloadAction<number>) => {
      const newVolume = Math.max(0, Math.min(1, action.payload));
      state.volume = newVolume;
      state.isMuted = newVolume === 0;
      state.error = null;

      // Store previous volume for unmute
      if (newVolume > 0 && !state.isMuted) {
        state.previousVolume = newVolume;
      }
    },

    toggleMute: (state) => {
      if (state.isMuted) {
        // Unmute: restore previous volume
        state.volume = state.previousVolume;
        state.isMuted = false;
      } else {
        // Mute: store current volume and set to 0
        state.previousVolume = state.volume;
        state.volume = 0;
        state.isMuted = true;
      }
    },

    mute: (state) => {
      if (!state.isMuted) {
        state.previousVolume = state.volume;
        state.volume = 0;
        state.isMuted = true;
      }
    },

    unmute: (state) => {
      if (state.isMuted) {
        state.volume = state.previousVolume;
        state.isMuted = false;
      }
    },

    // Playback Modes
    toggleShuffle: (state) => {
      state.isShuffled = !state.isShuffled;
    },

    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.isShuffled = action.payload;
    },

    setRepeatMode: (state, action: PayloadAction<RepeatMode>) => {
      state.repeatMode = action.payload;
    },

    cycleRepeatMode: (state) => {
      const modes: RepeatMode[] = [RepeatMode.OFF, RepeatMode.ALL, RepeatMode.ONE];
      const currentIndex = modes.indexOf(state.repeatMode);
      state.repeatMode = modes[(currentIndex + 1) % modes.length];
    },

    // Time Controls
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = Math.max(0, Math.min(state.duration, action.payload));
      state.progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;
    },

    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = Math.max(0, action.payload);
      state.progress = state.currentTime > 0 ? (state.currentTime / state.duration) * 100 : 0;
    },

    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = Math.max(0, Math.min(100, action.payload));
      state.currentTime = (state.progress / 100) * state.duration;
    },

    seekForward: (state, action: PayloadAction<number>) => {
      const seekTime = action.payload || 10; // Default 10 seconds
      state.currentTime = Math.min(state.duration, state.currentTime + seekTime);
      state.progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;
    },

    seekBackward: (state, action: PayloadAction<number>) => {
      const seekTime = action.payload || 10; // Default 10 seconds
      state.currentTime = Math.max(0, state.currentTime - seekTime);
      state.progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;
    },

    seekTo: (state, action: PayloadAction<number>) => {
      const targetTime = Math.max(0, Math.min(state.duration, action.payload));
      state.currentTime = targetTime;
      state.progress = state.duration > 0 ? (targetTime / state.duration) * 100 : 0;
    },

    seekToPercentage: (state, action: PayloadAction<number>) => {
      const percentage = Math.max(0, Math.min(100, action.payload));
      state.progress = percentage;
      state.currentTime = (percentage / 100) * state.duration;
    },

    // Queue Management
    setQueue: (state, action: PayloadAction<Track[]>) => {
      state.queue = action.payload;
      state.queueIndex = state.currentSong ? state.queue.findIndex((track) => track.id === state.currentSong?.id) : -1;
    },

    addToQueue: (state, action: PayloadAction<Track>) => {
      const track = action.payload;
      if (!state.queue.find((t) => t.id === track.id)) {
        state.queue.push(track);
      }
    },

    removeFromQueue: (state, action: PayloadAction<number>) => {
      const trackId = action.payload;
      const index = state.queue.findIndex((track) => track.id === trackId);
      if (index !== -1) {
        state.queue.splice(index, 1);
        // Adjust queue index if necessary
        if (state.queueIndex > index) {
          state.queueIndex--;
        } else if (state.queueIndex === index) {
          // If removing current track, stop playback
          state.isPlaying = false;
          state.currentSong = null;
          state.queueIndex = -1;
        }
      }
    },

    clearQueue: (state) => {
      state.queue = [];
      state.queueIndex = -1;
    },

    nextTrack: (state) => {
      if (state.queue.length === 0) return;

      let nextIndex = state.queueIndex;

      if (state.isShuffled) {
        // Random next track
        nextIndex = Math.floor(Math.random() * state.queue.length);
      } else {
        // Sequential next track
        nextIndex = (state.queueIndex + 1) % state.queue.length;
      }

      // Handle repeat modes
      if (state.repeatMode === RepeatMode.ONE) {
        nextIndex = state.queueIndex; // Stay on current track
      } else if (state.repeatMode === RepeatMode.OFF && nextIndex === 0 && state.queueIndex >= 0) {
        // End of queue, stop playback
        state.isPlaying = false;
        return;
      }

      state.queueIndex = nextIndex;
      state.currentSong = state.queue[nextIndex];
      state.currentTime = 0;
      state.progress = 0;
      state.isPlaying = true;
    },

    previousTrack: (state) => {
      if (state.queue.length === 0) return;

      // If more than 3 seconds into the track, restart it
      if (state.currentTime > 3) {
        state.currentTime = 0;
        state.progress = 0;
        return;
      }

      let prevIndex = state.queueIndex;

      if (state.isShuffled) {
        // Random previous track
        prevIndex = Math.floor(Math.random() * state.queue.length);
      } else {
        // Sequential previous track
        prevIndex = state.queueIndex <= 0 ? state.queue.length - 1 : state.queueIndex - 1;
      }

      state.queueIndex = prevIndex;
      state.currentSong = state.queue[prevIndex];
      state.currentTime = 0;
      state.progress = 0;
      state.isPlaying = true;
    },

    // Playback Rate
    setPlaybackRate: (state, action: PayloadAction<number>) => {
      const rate = Math.max(0.5, Math.min(2.0, action.payload));
      state.playbackRate = rate;
    },

    // Error Handling
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isPlaying = false;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Loading States
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Reset state
    resetPlayer: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Export actions
export const {
  setCurrentSong,
  togglePlayPause,
  setPlaying,
  stop,
  pause,
  resume,
  setVolume,
  toggleMute,
  mute,
  unmute,
  toggleShuffle,
  setShuffle,
  setRepeatMode,
  cycleRepeatMode,
  setCurrentTime,
  setDuration,
  setProgress,
  seekForward,
  seekBackward,
  seekTo,
  seekToPercentage,
  setQueue,
  addToQueue,
  removeFromQueue,
  clearQueue,
  nextTrack,
  previousTrack,
  setPlaybackRate,
  setError,
  clearError,
  setLoading,
  resetPlayer,
} = playerSlice.actions;

// Selectors
export const selectCurrentSong = (state: { player: PlayerState }) => state.player.currentSong;
export const selectIsPlaying = (state: { player: PlayerState }) => state.player.isPlaying;
export const selectVolume = (state: { player: PlayerState }) => state.player.volume;
export const selectIsMuted = (state: { player: PlayerState }) => state.player.isMuted;
export const selectRepeatMode = (state: { player: PlayerState }) => state.player.repeatMode;
export const selectIsShuffled = (state: { player: PlayerState }) => state.player.isShuffled;
export const selectCurrentTime = (state: { player: PlayerState }) => state.player.currentTime;
export const selectDuration = (state: { player: PlayerState }) => state.player.duration;
export const selectProgress = (state: { player: PlayerState }) => state.player.progress;
export const selectQueue = (state: { player: PlayerState }) => state.player.queue;
export const selectPlayerError = (state: { player: PlayerState }) => state.player.error;
export const selectIsLoading = (state: { player: PlayerState }) => state.player.isLoading;

// Combined selectors
export const selectPlayerState = (state: { player: PlayerState }) => state.player;
export const selectPlaybackControls = (state: { player: PlayerState }) => ({
  isPlaying: state.player.isPlaying,
  isLoading: state.player.isLoading,
  error: state.player.error,
  currentSong: state.player.currentSong,
});

export const selectVolumeControls = (state: { player: PlayerState }) => ({
  volume: state.player.volume,
  isMuted: state.player.isMuted,
  previousVolume: state.player.previousVolume,
});

export const selectPlaybackModes = (state: { player: PlayerState }) => ({
  isShuffled: state.player.isShuffled,
  repeatMode: state.player.repeatMode,
  playbackRate: state.player.playbackRate,
});

export const selectTimeControls = (state: { player: PlayerState }) => ({
  currentTime: state.player.currentTime,
  duration: state.player.duration,
  progress: state.player.progress,
});

export default playerSlice.reducer;

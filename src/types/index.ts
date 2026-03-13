// Music streaming types

// Track & Music Content Types

export interface Track {
  id: number;
  title: string;
  preview: string; // Audio URL
  duration: number; // Seconds
  link: string; // Deezer URL
  position: number; // Album position
  rank: number; // Chart position
  explicit: boolean; // Explicit content
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  isrc: string; // Recording code
  gain: number; // Audio level
  release_date: string;
  artist: Artist;
  album: Album;
}

export interface Artist {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album: number;
  nb_fan: number;
  radio: boolean;
  tracklist: string;
}

export interface Album {
  id: number;
  title: string;
  link: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  tracklist: string;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  fans: number;
  release_date: string;
  record_type: string; // album/single/ep
  available: boolean;
  tracks?: Track[]; // Album tracks
}

// Player State Types

export interface PlayerState {
  currentSong: Track | null;
  isPlaying: boolean;
  volume: number; // 0-1
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  currentTime: number; // Playback position (seconds)
  duration: number; // Total duration (seconds)
  progress: number; // Progress 0-100
  isLoading: boolean;
  error: string | null;
}

export enum RepeatMode {
  OFF = "off",
  ALL = "all",
  ONE = "one",
}

// UI State Types

export interface LikeState {
  likedSongs: Record<number, Track>;
  likedAlbums: Record<number, Album>;
  likedArtists: Record<number, Artist>;
  isLoading: boolean;
  error: string | null;
}

export interface SearchState {
  query: string;
  results: Track[];
  albums: Album[];
  artists: Artist[];
  loading: boolean;
  error: string | null;
  isSearching: boolean;
  searchHistory: string[];
}

export interface BrowseState {
  selectedCategory: string | null;
  content: Track[];
  loading: boolean;
  error: string | null;
}

// Application State Types

export interface RootState {
  player: PlayerState;
  likes: LikeState;
  search: SearchState;
  browse: BrowseState;
  ui: UIState;
}

export interface UIState {
  sidebarCollapsed: boolean;
  currentView: "home" | "search" | "library" | "favorites" | "browse";
  theme: "dark" | "light"; // Theme support
  notifications: Notification[];
}

// Component Props Types

export interface TrackCardProps {
  track: Track;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
  showArtist?: boolean;
  showAlbum?: boolean;
  showDuration?: boolean;
  variant?: "card" | "list" | "compact";
  className?: string;
}

export interface PlayerControlsProps {
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  className?: string;
}

// API & Service Types

export interface DeezerApiResponse<T> {
  data: T[];
  total: number;
  next?: string;
  prev?: string;
}

export interface SearchResponse {
  data: Track[];
  total: number;
}

export interface ArtistResponse {
  data: Artist[];
  total: number;
}

export interface AlbumResponse {
  data: Album[];
  total: number;
}

// Utility Types

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

export type PlaybackStatus = "idle" | "loading" | "playing" | "paused" | "error";

export interface AudioMetadata {
  title: string;
  artist: string;
  album: string;
  duration: number;
  artwork?: string;
}

// Event Types

export interface PlayerEvent {
  type: "play" | "pause" | "ended" | "error" | "timeupdate" | "loadstart";
  timestamp: number;
  data?: any;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

// Configuration Types

export interface AppConfig {
  apiBaseUrl: string;
  maxSearchResults: number;
  autoPlay: boolean;
  defaultVolume: number;
  enableKeyboardShortcuts: boolean;
  enableNotifications: boolean;
}

// Type Guards

export function isValidTrack(track: unknown): track is Track {
  return typeof track === "object" && track !== null && "id" in track && "title" in track && "preview" in track && "artist" in track && "album" in track;
}

export function isValidArtist(artist: unknown): artist is Artist {
  return typeof artist === "object" && artist !== null && "id" in artist && "name" in artist;
}

export function isValidAlbum(album: unknown): album is Album {
  return typeof album === "object" && album !== null && "id" in album && "title" in album;
}

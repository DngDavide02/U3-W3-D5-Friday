// Search state management

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Track, Album, Artist } from "../types";

export interface SearchState {
  // Query
  query: string;
  results: Track[];
  albums: Album[];
  artists: Artist[];

  // States
  loading: boolean;
  error: string | null;
  isSearching: boolean;

  // History
  searchHistory: string[];
  suggestions: string[];

  // Config
  searchType: "all" | "tracks" | "albums" | "artists";
  filters: {
    genre?: string;
    duration?: {
      min?: number;
      max?: number;
    };
    explicit?: boolean;
  };

  // Pagination
  currentPage: number;
  totalPages: number;
  hasMore: boolean;

  // Cache
  cache: Record<
    string,
    {
      tracks: Track[];
      albums: Album[];
      artists: Artist[];
      timestamp: number;
    }
  >;
}

const initialState: SearchState = {
  query: "",
  results: [],
  albums: [],
  artists: [],
  loading: false,
  error: null,
  isSearching: false,
  searchHistory: [],
  suggestions: [],
  searchType: "all",
  filters: {},
  currentPage: 1,
  totalPages: 0,
  hasMore: false,
  cache: {},
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    // Query Management
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.isSearching = action.payload.trim().length > 0;
    },

    clearQuery: (state) => {
      state.query = "";
      state.isSearching = false;
      state.results = [];
      state.albums = [];
      state.artists = [];
      state.currentPage = 1;
      state.hasMore = false;
    },

    // Results Management
    setResults: (
      state,
      action: PayloadAction<{
        tracks?: Track[];
        albums?: Album[];
        artists?: Artist[];
        hasMore?: boolean;
        totalPages?: number;
      }>,
    ) => {
      if (action.payload.tracks !== undefined) {
        state.results = action.payload.tracks;
      }
      if (action.payload.albums !== undefined) {
        state.albums = action.payload.albums;
      }
      if (action.payload.artists !== undefined) {
        state.artists = action.payload.artists;
      }
      if (action.payload.hasMore !== undefined) {
        state.hasMore = action.payload.hasMore;
      }
      if (action.payload.totalPages !== undefined) {
        state.totalPages = action.payload.totalPages;
      }
    },

    appendResults: (
      state,
      action: PayloadAction<{
        tracks?: Track[];
        albums?: Album[];
        artists?: Artist[];
      }>,
    ) => {
      if (action.payload.tracks) {
        state.results.push(...action.payload.tracks);
      }
      if (action.payload.albums) {
        state.albums.push(...action.payload.albums);
      }
      if (action.payload.artists) {
        state.artists.push(...action.payload.artists);
      }
      state.currentPage += 1;
    },

    clearResults: (state) => {
      state.results = [];
      state.albums = [];
      state.artists = [];
      state.currentPage = 1;
      state.hasMore = false;
      state.totalPages = 0;
    },

    // Loading and Error States
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Search History
    addToHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory.unshift(query);
        // Limit history to 20 items
        if (state.searchHistory.length > 20) {
          state.searchHistory = state.searchHistory.slice(0, 20);
        }
      }
    },

    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter((query) => query !== action.payload);
    },

    clearHistory: (state) => {
      state.searchHistory = [];
    },

    // Suggestions
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },

    clearSuggestions: (state) => {
      state.suggestions = [];
    },

    // Search Type
    setSearchType: (state, action: PayloadAction<SearchState["searchType"]>) => {
      state.searchType = action.payload;
      state.currentPage = 1;
    },

    // Filters
    setFilters: (state, action: PayloadAction<Partial<SearchState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset pagination when filters change
    },

    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },

    toggleFilter: (
      state,
      action: PayloadAction<{
        key: keyof SearchState["filters"];
        value: any;
      }>,
    ) => {
      const { key, value } = action.payload;
      if (key === "explicit") {
        state.filters[key] = state.filters[key] === value ? undefined : value;
      } else if (key === "duration") {
        state.filters[key] = state.filters[key] === value ? undefined : value;
      } else {
        state.filters[key] = state.filters[key] === value ? undefined : value;
      }
      state.currentPage = 1;
    },

    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = Math.max(1, action.payload);
    },

    nextPage: (state) => {
      if (state.hasMore) {
        state.currentPage += 1;
      }
    },

    previousPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },

    // Cache Management
    setCache: (
      state,
      action: PayloadAction<{
        key: string;
        data: {
          tracks: Track[];
          albums: Album[];
          artists: Artist[];
        };
      }>,
    ) => {
      state.cache[action.payload.key] = {
        ...action.payload.data,
        timestamp: Date.now(),
      };
    },

    clearCache: (state) => {
      state.cache = {};
    },

    clearExpiredCache: (state) => {
      const now = Date.now();
      const cacheTimeout = 5 * 60 * 1000; // 5 minutes
      Object.keys(state.cache).forEach((key) => {
        if (now - state.cache[key].timestamp > cacheTimeout) {
          delete state.cache[key];
        }
      });
    },

    // Reset Search State
    resetSearch: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Export actions
export const {
  setQuery,
  clearQuery,
  setResults,
  appendResults,
  clearResults,
  setLoading,
  setError,
  clearError,
  addToHistory,
  removeFromHistory,
  clearHistory,
  setSuggestions,
  clearSuggestions,
  setSearchType,
  setFilters,
  clearFilters,
  toggleFilter,
  setCurrentPage,
  nextPage,
  previousPage,
  setCache,
  clearCache,
  clearExpiredCache,
  resetSearch,
} = searchSlice.actions;

// Selectors
export const selectQuery = (state: { search: SearchState }) => state.search.query;
export const selectSearchResults = (state: { search: SearchState }) => state.search.results;
export const selectSearchAlbums = (state: { search: SearchState }) => state.search.albums;
export const selectSearchArtists = (state: { search: SearchState }) => state.search.artists;
export const selectSearchLoading = (state: { search: SearchState }) => state.search.loading;
export const selectSearchError = (state: { search: SearchState }) => state.search.error;
export const selectIsSearching = (state: { search: SearchState }) => state.search.isSearching;
export const selectSearchHistory = (state: { search: SearchState }) => state.search.searchHistory;
export const selectSuggestions = (state: { search: SearchState }) => state.search.suggestions;
export const selectSearchType = (state: { search: SearchState }) => state.search.searchType;
export const selectSearchFilters = (state: { search: SearchState }) => state.search.filters;
export const selectSearchPagination = (state: { search: SearchState }) => ({
  currentPage: state.search.currentPage,
  totalPages: state.search.totalPages,
  hasMore: state.search.hasMore,
});
export const selectSearchCache = (state: { search: SearchState }) => state.search.cache;

// Combined selectors
export const selectAllSearchResults = (state: { search: SearchState }) => ({
  tracks: state.search.results,
  albums: state.search.albums,
  artists: state.search.artists,
});

export const selectSearchState = (state: { search: SearchState }) => state.search;

export default searchSlice.reducer;

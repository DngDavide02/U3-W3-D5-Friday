import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { searchTracks } from "../services/deezerService";
import { setResults, clearResults } from "../store/searchSlice";

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        dispatch(clearSearchResults());
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await searchTracks(query);
        dispatch(setResults(results));
      } catch (err) {
        setError("Failed to search tracks");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults());
    setError(null);
    setLoading(false);
  }, [dispatch]);

  return {
    search,
    clearSearch,
    loading,
    error,
  };
};

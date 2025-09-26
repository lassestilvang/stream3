// hooks/use-movies.ts
import { useState, useRef, useCallback } from "react";
import { Movie } from "@/types";

export const useMovies = () => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchMovies = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const apiResponse = await fetch(
          `/api/tmdb/search?q=${encodeURIComponent(query)}`
        );
        if (!apiResponse.ok) {
          throw new Error("Failed to fetch search results");
        }
        const response = await apiResponse.json();
        // Filter out adult content and only include movies and TV shows
        const filteredResults = response.results.filter(
          (item: any) =>
            item.media_type !== "person" &&
            !item.adult &&
            (item.media_type === "movie" || item.media_type === "tv")
        );
        setSearchResults(filteredResults);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search movies. Please try again.");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    searchMovies,
  };
};

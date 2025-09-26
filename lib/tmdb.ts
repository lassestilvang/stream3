// lib/tmdb.ts
import { Movie } from "@/types";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
  console.warn("TMDB_API_KEY is not set. TMDB functionality will not work.");
}

interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<SearchResponse> => {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is not configured");
  }

  const url = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
    query
  )}&page=${page}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Add media_type to ensure type consistency
    const results = data.results.map((item: any) => ({
      ...item,
      media_type: item.media_type || (item.title ? "movie" : "tv"),
    }));

    return {
      ...data,
      results,
    };
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getMovieDetails = async (
  id: number,
  mediaType: "movie" | "tv"
): Promise<Movie> => {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is not configured");
  }

  const url = `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      ...data,
      media_type: mediaType,
    };
  } catch (error) {
    console.error(`Error getting ${mediaType} details:`, error);
    throw error;
  }
};

export const getImageUrl = (
  path: string | undefined,
  size: "w500" | "w780" | "w1280" | "original" = "w500"
): string => {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

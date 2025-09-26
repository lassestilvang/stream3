// tests/unit/lib/tmdb.test.ts
// Mock fetch
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

// Mock the TMDB module to bypass API key check
jest.mock("@/lib/tmdb", () => ({
  searchMovies: jest.fn(),
  getMovieDetails: jest.fn(),
  getImageUrl: jest.fn(),
}));

import { searchMovies, getMovieDetails, getImageUrl } from "@/lib/tmdb";

const mockSearchMovies = searchMovies as jest.MockedFunction<
  typeof searchMovies
>;
const mockGetMovieDetails = getMovieDetails as jest.MockedFunction<
  typeof getMovieDetails
>;
const mockGetImageUrl = getImageUrl as jest.MockedFunction<typeof getImageUrl>;

describe("TMDB", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("searchMovies", () => {
    it("should search movies successfully", async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 123,
            title: "Test Movie",
            media_type: "movie",
            overview: "Test overview",
            vote_average: 8.5,
            genre_ids: [1, 2],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockSearchMovies.mockResolvedValue(mockResponse);

      const result = await searchMovies("test query");

      expect(mockSearchMovies).toHaveBeenCalledWith("test query");
      expect(result).toEqual(mockResponse);
    });

    it("should handle search with custom page", async () => {
      const mockResponse = {
        page: 2,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockSearchMovies.mockResolvedValue(mockResponse as any);

      const result = await searchMovies("query", 2);

      expect(mockSearchMovies).toHaveBeenCalledWith("query", 2);
      expect(result).toBe(mockResponse);
    });

    it("should handle API errors", async () => {
      mockSearchMovies.mockRejectedValue(new Error("API Error"));

      await expect(searchMovies("query")).rejects.toThrow("API Error");
    });
  });

  describe("getMovieDetails", () => {
    it("should get movie details successfully", async () => {
      const mockResponse = {
        id: 123,
        title: "Test Movie",
        overview: "Test overview",
        vote_average: 8.5,
      };

      mockGetMovieDetails.mockResolvedValue(mockResponse as any);

      const result = await getMovieDetails(123, "movie");

      expect(mockGetMovieDetails).toHaveBeenCalledWith(123, "movie");
      expect(result).toEqual(mockResponse);
    });

    it("should get TV show details", async () => {
      const mockResponse = {
        id: 456,
        name: "Test TV Show",
        overview: "TV overview",
        vote_average: 9.0,
      };

      mockGetMovieDetails.mockResolvedValue(mockResponse as any);

      const result = await getMovieDetails(456, "tv");

      expect(mockGetMovieDetails).toHaveBeenCalledWith(456, "tv");
      expect(result).toBe(mockResponse);
    });

    it("should handle API errors", async () => {
      mockGetMovieDetails.mockRejectedValue(new Error("API Error"));

      await expect(getMovieDetails(123, "movie")).rejects.toThrow("API Error");
    });
  });

  describe("getImageUrl", () => {
    it("should return correct image URL", () => {
      mockGetImageUrl.mockReturnValue(
        "https://image.tmdb.org/t/p/w500/path/to/image.jpg"
      );

      const result = getImageUrl("/path/to/image.jpg", "w500");

      expect(mockGetImageUrl).toHaveBeenCalledWith(
        "/path/to/image.jpg",
        "w500"
      );
      expect(result).toBe("https://image.tmdb.org/t/p/w500/path/to/image.jpg");
    });

    it("should use default size when not specified", () => {
      mockGetImageUrl.mockReturnValue(
        "https://image.tmdb.org/t/p/w500/path/to/image.jpg"
      );

      const result = getImageUrl("/path/to/image.jpg");

      expect(mockGetImageUrl).toHaveBeenCalledWith("/path/to/image.jpg");
      expect(result).toBe("https://image.tmdb.org/t/p/w500/path/to/image.jpg");
    });

    it("should return empty string for undefined path", () => {
      mockGetImageUrl.mockReturnValue("");

      const result = getImageUrl(undefined);

      expect(mockGetImageUrl).toHaveBeenCalledWith(undefined);
      expect(result).toBe("");
    });

    it("should handle different sizes", () => {
      mockGetImageUrl.mockReturnValue(
        "https://image.tmdb.org/t/p/w780/path.jpg"
      );

      const result = getImageUrl("/path.jpg", "w780");

      expect(mockGetImageUrl).toHaveBeenCalledWith("/path.jpg", "w780");
      expect(result).toBe("https://image.tmdb.org/t/p/w780/path.jpg");
    });
  });
});

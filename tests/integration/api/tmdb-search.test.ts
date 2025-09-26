// tests/integration/api/tmdb-search.test.ts
import { GET } from "@/app/api/tmdb/search/route";
import { createMocks } from "node-mocks-http";

// Mock the TMDB module
jest.mock("@/lib/tmdb", () => ({
  searchMovies: jest.fn(),
}));

import { searchMovies } from "@/lib/tmdb";

const mockSearchMovies = searchMovies as jest.MockedFunction<
  typeof searchMovies
>;

describe("/api/tmdb/search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return search results successfully", async () => {
      const mockResults = {
        page: 1,
        results: [
          {
            id: 123,
            title: "Test Movie",
            media_type: "movie",
            overview: "Test overview",
            vote_average: 8.5,
            poster_path: "/poster.jpg",
            genre_ids: [28, 12],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockSearchMovies.mockResolvedValue(mockResults);

      const { req } = createMocks({
        method: "GET",
        url: "/api/tmdb/search?q=test+query",
      });

      // Add search params
      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/tmdb/search?q=test+query",
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(mockSearchMovies).toHaveBeenCalledWith("test query", 1);
      expect(response.status).toBe(200);
      expect(data).toEqual(mockResults);
    });

    it("should handle custom page parameter", async () => {
      const mockResults = {
        page: 2,
        results: [],
        total_pages: 5,
        total_results: 100,
      };

      mockSearchMovies.mockResolvedValue(mockResults);

      const { req } = createMocks({
        method: "GET",
        url: "/api/tmdb/search?q=movie&page=2",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/tmdb/search?q=movie&page=2",
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(mockSearchMovies).toHaveBeenCalledWith("movie", 2);
      expect(response.status).toBe(200);
      expect(data).toEqual(mockResults);
    });

    it("should return 400 when query parameter is missing", async () => {
      const { req } = createMocks({
        method: "GET",
        url: "/api/tmdb/search",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/tmdb/search",
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(mockSearchMovies).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Query parameter is required" });
    });

    it("should handle TMDB API errors", async () => {
      mockSearchMovies.mockRejectedValue(new Error("TMDB API Error"));

      const { req } = createMocks({
        method: "GET",
        url: "/api/tmdb/search?q=error",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/tmdb/search?q=error",
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(mockSearchMovies).toHaveBeenCalledWith("error", 1);
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to search movies" });
    });

    it("should handle TMDB API key not configured error", async () => {
      mockSearchMovies.mockRejectedValue(
        new Error("TMDB API key is not configured")
      );

      const { req } = createMocks({
        method: "GET",
        url: "/api/tmdb/search?q=test",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/tmdb/search?q=test",
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to search movies" });
    });
  });
});

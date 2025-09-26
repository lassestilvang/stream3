// tests/integration/api/watchlist.test.ts
import { GET, POST, DELETE } from "@/app/api/watchlist/route";
import { createMocks } from "node-mocks-http";

// Mock the content service
jest.mock("@/services/content-service", () => ({
  addToWatchlist: jest.fn(),
  getWatchlistItems: jest.fn(),
  removeFromWatchlist: jest.fn(),
}));

import {
  addToWatchlist,
  getWatchlistItems,
  removeFromWatchlist,
} from "@/services/content-service";

const mockAddToWatchlist = addToWatchlist as jest.MockedFunction<
  typeof addToWatchlist
>;
const mockGetWatchlistItems = getWatchlistItems as jest.MockedFunction<
  typeof getWatchlistItems
>;
const mockRemoveFromWatchlist = removeFromWatchlist as jest.MockedFunction<
  typeof removeFromWatchlist
>;

describe("/api/watchlist", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return watchlist items for a user", async () => {
      const mockItems = [
        {
          id: "item1",
          userId: "user1",
          mediaId: 456,
          title: "Test TV Show",
          poster_path: "/tvposter.jpg",
          backdrop_path: "/tvbackdrop.jpg",
          overview: "TV overview",
          vote_average: 9.2,
          media_type: "tv",
          addedAt: "2023-01-01T00:00:00.000Z",
        },
      ];

      mockGetWatchlistItems.mockResolvedValue(mockItems);

      const { req } = createMocks({
        method: "GET",
        url: "/api/watchlist?userId=user1",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watchlist?userId=user1",
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(mockGetWatchlistItems).toHaveBeenCalledWith("user1");
      expect(response.status).toBe(200);
      expect(data).toEqual(mockItems);
    });

    it("should return 400 when userId is missing", async () => {
      const { req } = createMocks({
        method: "GET",
        url: "/api/watchlist",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watchlist",
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(mockGetWatchlistItems).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "userId required" });
    });

    it("should handle service errors", async () => {
      mockGetWatchlistItems.mockRejectedValue(new Error("Database error"));

      const { req } = createMocks({
        method: "GET",
        url: "/api/watchlist?userId=user1",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watchlist?userId=user1",
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to get watchlist items" });
    });
  });

  describe("POST", () => {
    it("should add an item to watchlist", async () => {
      const requestBody = {
        userId: "user1",
        mediaId: 456,
        title: "Test TV Show",
        posterPath: "/tvposter.jpg",
        backdropPath: "/tvbackdrop.jpg",
        overview: "TV overview",
        voteAverage: 9.2,
        mediaType: "tv",
      };

      const mockResult = {
        id: "new-item-id",
        userId: "user1",
        mediaId: 456,
        title: "Test TV Show",
        poster_path: "/tvposter.jpg",
        backdrop_path: "/tvbackdrop.jpg",
        overview: "TV overview",
        vote_average: 9.2,
        media_type: "tv",
        addedAt: "2023-01-01T00:00:00.000Z",
      };

      mockAddToWatchlist.mockResolvedValue(mockResult);

      const { req } = createMocks({
        method: "POST",
        url: "/api/watchlist",
      });

      req.json = jest.fn().mockResolvedValue(requestBody);

      const response = await POST(req as any);
      const data = await response.json();

      expect(mockAddToWatchlist).toHaveBeenCalledWith(requestBody);
      expect(response.status).toBe(200);
      expect(data).toEqual(mockResult);
    });

    it("should handle service errors", async () => {
      const requestBody = {
        userId: "user1",
        mediaId: 456,
        title: "Test TV Show",
        overview: "TV overview",
        voteAverage: 9.2,
        mediaType: "tv",
      };

      mockAddToWatchlist.mockRejectedValue(new Error("Database error"));

      const { req } = createMocks({
        method: "POST",
        url: "/api/watchlist",
      });

      req.json = jest.fn().mockResolvedValue(requestBody);

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to add to watchlist" });
    });
  });

  describe("DELETE", () => {
    it("should remove an item from watchlist", async () => {
      mockRemoveFromWatchlist.mockResolvedValue();

      const { req } = createMocks({
        method: "DELETE",
        url: "/api/watchlist?id=item1",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watchlist?id=item1",
      });

      const response = await DELETE(req as any);
      const data = await response.json();

      expect(mockRemoveFromWatchlist).toHaveBeenCalledWith("item1");
      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
    });

    it("should return 400 when id is missing", async () => {
      const { req } = createMocks({
        method: "DELETE",
        url: "/api/watchlist",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watchlist",
      });

      const response = await DELETE(req as any);

      expect(mockRemoveFromWatchlist).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
    });

    it("should handle service errors", async () => {
      mockRemoveFromWatchlist.mockRejectedValue(new Error("Database error"));

      const { req } = createMocks({
        method: "DELETE",
        url: "/api/watchlist?id=item1",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watchlist?id=item1",
      });

      const response = await DELETE(req as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to remove from watchlist" });
    });
  });
});

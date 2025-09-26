// tests/integration/api/watched.test.ts
import { GET, POST, PUT, DELETE } from "@/app/api/watched/route";
import { createMocks } from "node-mocks-http";

// Mock the content service
jest.mock("@/services/content-service", () => ({
  addWatchedItem: jest.fn(),
  getWatchedItems: jest.fn(),
  updateWatchedItem: jest.fn(),
  deleteWatchedItem: jest.fn(),
  addToWatchedFromWatchlist: jest.fn(),
}));

import {
  addWatchedItem,
  getWatchedItems,
  updateWatchedItem,
  deleteWatchedItem,
  addToWatchedFromWatchlist,
} from "@/services/content-service";

const mockAddWatchedItem = addWatchedItem as jest.MockedFunction<
  typeof addWatchedItem
>;
const mockGetWatchedItems = getWatchedItems as jest.MockedFunction<
  typeof getWatchedItems
>;
const mockUpdateWatchedItem = updateWatchedItem as jest.MockedFunction<
  typeof updateWatchedItem
>;
const mockDeleteWatchedItem = deleteWatchedItem as jest.MockedFunction<
  typeof deleteWatchedItem
>;
const mockAddToWatchedFromWatchlist =
  addToWatchedFromWatchlist as jest.MockedFunction<
    typeof addToWatchedFromWatchlist
  >;

describe("/api/watched", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return watched items for a user", async () => {
      const mockItems = [
        {
          id: "item1",
          userId: "user1",
          mediaId: 123,
          title: "Test Movie",
          poster_path: "/poster.jpg",
          backdrop_path: "/backdrop.jpg",
          overview: "Test overview",
          vote_average: 8.5,
          media_type: "movie",
          watchedDate: "2023-01-01T00:00:00.000Z",
          rating: 9,
          notes: "Great movie",
          createdAt: "2023-01-01T00:00:00.000Z",
        },
      ];

      mockGetWatchedItems.mockResolvedValue(mockItems);

      const { req } = createMocks({
        method: "GET",
        url: "/api/watched?userId=user1",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watched?userId=user1",
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(mockGetWatchedItems).toHaveBeenCalledWith("user1");
      expect(response.status).toBe(200);
      expect(data).toEqual(mockItems);
    });

    it("should return 400 when userId is missing", async () => {
      const { req } = createMocks({
        method: "GET",
        url: "/api/watched",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watched",
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(mockGetWatchedItems).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "userId required" });
    });

    it("should handle service errors", async () => {
      mockGetWatchedItems.mockRejectedValue(new Error("Database error"));

      const { req } = createMocks({
        method: "GET",
        url: "/api/watched?userId=user1",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watched?userId=user1",
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to get watched items" });
    });
  });

  describe("POST", () => {
    it("should add a new watched item", async () => {
      const requestBody = {
        userId: "user1",
        mediaId: 123,
        title: "Test Movie",
        posterPath: "/poster.jpg",
        backdropPath: "/backdrop.jpg",
        overview: "Test overview",
        voteAverage: 8.5,
        mediaType: "movie",
        watchedDate: "2023-01-01T00:00:00.000Z",
        rating: 9,
        notes: "Great movie",
      };

      const mockResult = {
        id: "new-item-id",
        ...requestBody,
        poster_path: "/poster.jpg",
        backdrop_path: "/backdrop.jpg",
        vote_average: 8.5,
        media_type: "movie",
        watchedDate: "2023-01-01T00:00:00.000Z",
        createdAt: "2023-01-01T00:00:00.000Z",
      };

      mockAddWatchedItem.mockResolvedValue(mockResult);

      const { req } = createMocks({
        method: "POST",
        url: "/api/watched",
      });

      req.json = jest.fn().mockResolvedValue(requestBody);

      const response = await POST(req as any);
      const data = await response.json();

      expect(mockAddWatchedItem).toHaveBeenCalledWith(requestBody);
      expect(response.status).toBe(200);
      expect(data).toEqual(mockResult);
    });

    it("should move item from watchlist to watched", async () => {
      const requestBody = {
        fromWatchlistId: "watchlist-item-id",
      };

      mockAddToWatchedFromWatchlist.mockResolvedValue();

      const { req } = createMocks({
        method: "POST",
        url: "/api/watched",
      });

      req.json = jest.fn().mockResolvedValue(requestBody);

      const response = await POST(req as any);
      const data = await response.json();

      expect(mockAddToWatchedFromWatchlist).toHaveBeenCalledWith(
        "watchlist-item-id"
      );
      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
    });

    it("should handle service errors", async () => {
      const requestBody = {
        userId: "user1",
        mediaId: 123,
        title: "Test Movie",
        overview: "Test overview",
        voteAverage: 8.5,
        mediaType: "movie",
        watchedDate: "2023-01-01T00:00:00.000Z",
      };

      mockAddWatchedItem.mockRejectedValue(new Error("Database error"));

      const { req } = createMocks({
        method: "POST",
        url: "/api/watched",
      });

      req.json = jest.fn().mockResolvedValue(requestBody);

      const response = await POST(req as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to add watched item" });
    });
  });

  describe("PUT", () => {
    it("should update a watched item", async () => {
      const requestBody = {
        rating: 10,
        notes: "Updated notes",
      };

      mockUpdateWatchedItem.mockResolvedValue();

      const { req } = createMocks({
        method: "PUT",
        url: "/api/watched?id=item1",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watched?id=item1",
      });

      req.json = jest.fn().mockResolvedValue(requestBody);

      const response = await PUT(req as any);
      const data = await response.json();

      expect(mockUpdateWatchedItem).toHaveBeenCalledWith("item1", requestBody);
      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
    });

    it("should return 400 when id is missing", async () => {
      const { req } = createMocks({
        method: "PUT",
        url: "/api/watched",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watched",
      });

      const response = await PUT(req as any);

      expect(mockUpdateWatchedItem).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
    });

    it("should handle service errors", async () => {
      const requestBody = {
        rating: 8,
      };

      mockUpdateWatchedItem.mockRejectedValue(new Error("Database error"));

      const { req } = createMocks({
        method: "PUT",
        url: "/api/watched?id=item1",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watched?id=item1",
      });

      req.json = jest.fn().mockResolvedValue(requestBody);

      const response = await PUT(req as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to update watched item" });
    });
  });

  describe("DELETE", () => {
    it("should delete a watched item", async () => {
      mockDeleteWatchedItem.mockResolvedValue();

      const { req } = createMocks({
        method: "DELETE",
        url: "/api/watched?id=item1",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watched?id=item1",
      });

      const response = await DELETE(req as any);
      const data = await response.json();

      expect(mockDeleteWatchedItem).toHaveBeenCalledWith("item1");
      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
    });

    it("should return 400 when id is missing", async () => {
      const { req } = createMocks({
        method: "DELETE",
        url: "/api/watched",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watched",
      });

      const response = await DELETE(req as any);

      expect(mockDeleteWatchedItem).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
    });

    it("should handle service errors", async () => {
      mockDeleteWatchedItem.mockRejectedValue(new Error("Database error"));

      const { req } = createMocks({
        method: "DELETE",
        url: "/api/watched?id=item1",
      });

      Object.defineProperty(req, "url", {
        value: "http://localhost:3000/api/watched?id=item1",
      });

      const response = await DELETE(req as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to delete watched item" });
    });
  });
});

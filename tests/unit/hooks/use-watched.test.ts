// tests/unit/hooks/use-watched.test.ts
import { renderHook, waitFor, act } from "@testing-library/react";
import { useWatched } from "@/hooks/use-watched";
import { WatchedItem } from "@/types";

// Mock global.fetch
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

describe("useWatched", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it("initializes with empty state", () => {
    const { result } = renderHook(() => useWatched());

    expect(result.current.watchedItems).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("fetches watched items successfully", async () => {
    const mockItems: WatchedItem[] = [
      {
        id: "1",
        userId: "user1",
        mediaId: 123,
        title: "Test Movie",
        overview: "Test overview",
        vote_average: 8.5,
        media_type: "movie",
        watchedDate: "2023-01-01",
        createdAt: "2023-01-01",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockItems),
    });

    const { result } = renderHook(() => useWatched());

    await act(async () => {
      result.current.fetchWatchedItems("user1");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.watchedItems).toEqual(mockItems);
    expect(result.current.error).toBeNull();

    expect(mockFetch).toHaveBeenCalledWith("/api/watched?userId=user1");
  });

  it("handles fetch error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useWatched());

    await act(async () => {
      result.current.fetchWatchedItems("user1");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(
      "Failed to fetch watched items. Please try again."
    );
    expect(result.current.watchedItems).toEqual([]);
  });

  it("handles fetch response not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useWatched());

    await act(async () => {
      result.current.fetchWatchedItems("user1");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(
      "Failed to fetch watched items. Please try again."
    );
  });

  it("deletes watched item successfully", async () => {
    const mockItems: WatchedItem[] = [
      {
        id: "1",
        userId: "user1",
        mediaId: 123,
        title: "Test Movie",
        overview: "Test overview",
        vote_average: 8.5,
        media_type: "movie",
        watchedDate: "2023-01-01",
        createdAt: "2023-01-01",
      },
      {
        id: "2",
        userId: "user1",
        mediaId: 456,
        title: "Test Movie 2",
        overview: "Test overview 2",
        vote_average: 7.5,
        media_type: "movie",
        watchedDate: "2023-01-02",
        createdAt: "2023-01-02",
      },
    ];

    const { result } = renderHook(() => useWatched());

    // First fetch items to populate state
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockItems),
    });

    await act(async () => {
      result.current.fetchWatchedItems("user1");
    });

    // Now delete one item
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    await act(async () => {
      await result.current.deleteWatchedItem("1", "user1");
    });

    expect(result.current.watchedItems).toEqual([mockItems[1]]);
    expect(mockFetch).toHaveBeenCalledWith("/api/watched?id=1", {
      method: "DELETE",
    });
  });

  it("handles delete error", async () => {
    const mockItems: WatchedItem[] = [
      {
        id: "1",
        userId: "user1",
        mediaId: 123,
        title: "Test Movie",
        overview: "Test overview",
        vote_average: 8.5,
        media_type: "movie",
        watchedDate: "2023-01-01",
        createdAt: "2023-01-01",
      },
    ];

    const { result } = renderHook(() => useWatched());

    // First fetch items to populate state
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockItems),
    });

    await act(async () => {
      result.current.fetchWatchedItems("user1");
    });

    // Now try to delete with error
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    await act(async () => {
      await expect(
        result.current.deleteWatchedItem("1", "user1")
      ).rejects.toThrow();
    });

    expect(result.current.error).toBe(
      "Failed to delete watched item. Please try again."
    );
    expect(result.current.watchedItems).toEqual(mockItems); // Should not change on error
  });

  it("clears error on successful operations", async () => {
    // Set initial error
    const { result } = renderHook(() => useWatched());
    result.current.error = "Previous error";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    await act(async () => {
      result.current.fetchWatchedItems("user1");
    });

    expect(result.current.error).toBeNull();
  });
});

// tests/unit/hooks/use-watchlist.test.ts
import { renderHook, waitFor, act } from "@testing-library/react";
import { useWatchlist } from "@/hooks/use-watchlist";
import { WatchlistItem } from "@/types";

// Mock global.fetch
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

describe("useWatchlist", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it("initializes with empty state", () => {
    const { result } = renderHook(() => useWatchlist());

    expect(result.current.watchlistItems).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("fetches watchlist items successfully", async () => {
    const mockItems: WatchlistItem[] = [
      {
        id: "1",
        userId: "user1",
        mediaId: 123,
        title: "Test Movie",
        overview: "Test overview",
        vote_average: 8.5,
        media_type: "movie",
        addedAt: "2023-01-01",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockItems),
    });

    const { result } = renderHook(() => useWatchlist());

    await act(async () => {
      result.current.fetchWatchlistItems("user1");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.watchlistItems).toEqual(mockItems);
    expect(result.current.error).toBeNull();

    expect(mockFetch).toHaveBeenCalledWith("/api/watchlist?userId=user1");
  });

  it("handles fetch error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useWatchlist());

    await act(async () => {
      result.current.fetchWatchlistItems("user1");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(
      "Failed to fetch watchlist items. Please try again."
    );
    expect(result.current.watchlistItems).toEqual([]);
  });

  it("handles fetch response not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useWatchlist());

    await act(async () => {
      result.current.fetchWatchlistItems("user1");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(
      "Failed to fetch watchlist items. Please try again."
    );
  });

  it("removes from watchlist successfully", async () => {
    const mockItems: WatchlistItem[] = [
      {
        id: "1",
        userId: "user1",
        mediaId: 123,
        title: "Test Movie",
        overview: "Test overview",
        vote_average: 8.5,
        media_type: "movie",
        addedAt: "2023-01-01",
      },
      {
        id: "2",
        userId: "user1",
        mediaId: 456,
        title: "Test Movie 2",
        overview: "Test overview 2",
        vote_average: 7.5,
        media_type: "movie",
        addedAt: "2023-01-02",
      },
    ];

    const { result } = renderHook(() => useWatchlist());

    // First fetch items to populate state
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockItems),
    });

    await act(async () => {
      result.current.fetchWatchlistItems("user1");
    });

    // Now remove one item
    mockFetch.mockResolvedValueOnce({
      ok: true,
    });

    await act(async () => {
      await result.current.removeFromWatchlist("1", "user1");
    });

    expect(result.current.watchlistItems).toEqual([mockItems[1]]);
    expect(mockFetch).toHaveBeenCalledWith("/api/watchlist?id=1", {
      method: "DELETE",
    });
  });

  it("handles remove error", async () => {
    const mockItems: WatchlistItem[] = [
      {
        id: "1",
        userId: "user1",
        mediaId: 123,
        title: "Test Movie",
        overview: "Test overview",
        vote_average: 8.5,
        media_type: "movie",
        addedAt: "2023-01-01",
      },
    ];

    const { result } = renderHook(() => useWatchlist());

    // First fetch items to populate state
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockItems),
    });

    await act(async () => {
      result.current.fetchWatchlistItems("user1");
    });

    // Now try to remove with error
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    await act(async () => {
      await expect(
        result.current.removeFromWatchlist("1", "user1")
      ).rejects.toThrow();
    });

    expect(result.current.error).toBe(
      "Failed to remove from watchlist. Please try again."
    );
    expect(result.current.watchlistItems).toEqual(mockItems); // Should not change on error
  });

  it("clears error on successful operations", async () => {
    // Set initial error
    const { result } = renderHook(() => useWatchlist());
    result.current.error = "Previous error";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    await act(async () => {
      result.current.fetchWatchlistItems("user1");
    });

    expect(result.current.error).toBeNull();
  });
});

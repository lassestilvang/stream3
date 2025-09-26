// tests/unit/hooks/use-movies.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useMovies } from "@/hooks/use-movies";

// Mock global.fetch
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({
    results: [{ id: 1, title: "Test Movie", media_type: "movie" }],
  }),
} as any);

describe("useMovies", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("searches for movies correctly", async () => {
    const { result } = renderHook(() => useMovies());

    result.current.searchMovies("Test");

    // Advance timers to trigger the debounced search
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(1);
      expect(result.current.searchResults[0].title).toBe("Test Movie");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("handles empty search query", async () => {
    const { result } = renderHook(() => useMovies());

    result.current.searchMovies("");

    // Advance timers
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(0);
    });
  });

  it("handles search errors", async () => {
    // Mock fetch to reject
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    const { result } = renderHook(() => useMovies());

    result.current.searchMovies("Test");

    // Advance timers
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current.error).toBe(
        "Failed to search movies. Please try again."
      );
    });
  });
});

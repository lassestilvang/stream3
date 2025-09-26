// tests/unit/components/movie-card.test.tsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import MovieCard from "@/components/movie-card";
import { Movie } from "@/types";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  overview: "This is a test movie",
  vote_average: 8.5,
  media_type: "movie",
  genre_ids: [18, 80],
};

describe("MovieCard", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });
  });

  it("renders movie information correctly", () => {
    render(<MovieCard movie={mockMovie} userId="user123" />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText(/This is a test movie/)).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
  });

  it("allows adding to watched list", async () => {
    render(<MovieCard movie={mockMovie} userId="user123" />);

    const watchedButton = screen.getByText("Watched");
    act(() => fireEvent.click(watchedButton));

    expect(mockFetch).toHaveBeenCalledWith("/api/watched", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: expect.stringMatching(/"userId":"user123"/),
    });
  });

  it("allows adding to watchlist", async () => {
    render(<MovieCard movie={mockMovie} userId="user123" />);

    const watchlistButton = screen.getByText("Watchlist");
    act(() => fireEvent.click(watchlistButton));

    expect(mockFetch).toHaveBeenCalledWith("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: expect.stringMatching(/"userId":"user123"/),
    });
  });

  it("disables buttons when no user is signed in", () => {
    render(<MovieCard movie={mockMovie} userId={undefined} />);

    const watchedButton = screen.getByText("Watched");
    const watchlistButton = screen.getByText("Watchlist");

    expect(watchedButton).toBeDisabled();
    expect(watchlistButton).toBeDisabled();
  });
});

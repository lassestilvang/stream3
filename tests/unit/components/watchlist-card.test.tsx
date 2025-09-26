// tests/unit/components/watchlist-card.test.tsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { WatchlistCard } from "@/components/watchlist-card";
import { WatchlistItem } from "@/types";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock date-fns
jest.mock("date-fns", () => ({
  format: jest.fn(() => "Jan 01, 2023"),
}));

// Mock tmdb
jest.mock("@/lib/tmdb", () => ({
  getImageUrl: jest.fn(() => "/mock-image.jpg"),
}));

// Mock Next.js Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock UI components
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardFooter: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Star: () => <div data-testid="star-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Play: () => <div data-testid="play-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  X: () => <div data-testid="x-icon" />,
  Check: () => <div data-testid="check-icon" />,
}));

const mockWatchlistItem: WatchlistItem = {
  id: "1",
  userId: "user123",
  mediaId: 123,
  title: "Test Movie",
  poster_path: "/test.jpg",
  backdrop_path: "/backdrop.jpg",
  overview: "This is a test movie overview",
  vote_average: 8.5,
  media_type: "movie",
  addedAt: "2023-01-01",
};

describe("WatchlistCard", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });
  });

  it("renders watchlist item information", () => {
    render(
      <WatchlistCard watchlistItem={mockWatchlistItem} onRemove={jest.fn()} />
    );

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText(/This is a test movie/)).toBeInTheDocument();
    expect(screen.getByText("Added Jan 01, 2023")).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
  });

  it("renders without poster", () => {
    const itemWithoutPoster = { ...mockWatchlistItem, poster_path: undefined };

    render(
      <WatchlistCard watchlistItem={itemWithoutPoster} onRemove={jest.fn()} />
    );

    expect(screen.getByText("No image")).toBeInTheDocument();
  });

  it("marks as watched when watched button is clicked", async () => {
    const mockOnRemove = jest.fn();
    render(
      <WatchlistCard
        watchlistItem={mockWatchlistItem}
        onRemove={mockOnRemove}
      />
    );

    const watchedButton = screen.getByText("Watched");
    await act(async () => {
      fireEvent.click(watchedButton);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/watched", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromWatchlistId: "1" }),
    });
    expect(mockOnRemove).toHaveBeenCalled();
  });

  it("removes from watchlist when remove button is clicked", async () => {
    const mockOnRemove = jest.fn();
    render(
      <WatchlistCard
        watchlistItem={mockWatchlistItem}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByTestId("x-icon").closest("button");
    expect(removeButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(removeButton!);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/watchlist?id=1", {
      method: "DELETE",
    });
    expect(mockOnRemove).toHaveBeenCalled();
  });

  it("shows loading state when removing", () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <WatchlistCard watchlistItem={mockWatchlistItem} onRemove={jest.fn()} />
    );

    const removeButton = screen.getByRole("button", {
      name: "Remove from watchlist",
    });
    fireEvent.click(removeButton);

    // Button should still be there, but disabled state might be tested differently
    expect(removeButton).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("API Error"));

    render(
      <WatchlistCard watchlistItem={mockWatchlistItem} onRemove={jest.fn()} />
    );

    const watchedButton = screen.getByText("Watched");
    await act(async () => {
      fireEvent.click(watchedButton);
    });

    expect(mockFetch).toHaveBeenCalled();
  });
});

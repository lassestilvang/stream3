// tests/unit/components/watched-card.test.tsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { WatchedCard } from "@/components/watched-card";
import { WatchedItem } from "@/types";

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

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  DialogHeader: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  DialogTitle: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  DialogDescription: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  DialogTrigger: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Star: () => <div data-testid="star-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Edit3: () => <div data-testid="edit-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
}));

const mockWatchedItem: WatchedItem = {
  id: "1",
  userId: "user123",
  mediaId: 123,
  title: "Test Movie",
  poster_path: "/test.jpg",
  backdrop_path: "/backdrop.jpg",
  overview: "This is a test movie overview",
  vote_average: 8.5,
  media_type: "movie",
  watchedDate: "2023-01-01",
  rating: 9,
  notes: "Great movie",
  createdAt: "2023-01-01",
};

describe("WatchedCard", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });
  });

  it("renders watched item information", () => {
    render(<WatchedCard watchedItem={mockWatchedItem} onRemove={jest.fn()} />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText(/This is a test movie/)).toBeInTheDocument();
    expect(screen.getByText("Jan 01, 2023")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getAllByText("Great movie")).toHaveLength(2); // One in display, one in textarea
  });

  it("renders without poster", () => {
    const itemWithoutPoster = { ...mockWatchedItem, poster_path: undefined };

    render(
      <WatchedCard watchedItem={itemWithoutPoster} onRemove={jest.fn()} />
    );

    expect(screen.getByText("No image")).toBeInTheDocument();
  });

  it("opens edit dialog when edit button is clicked", () => {
    render(<WatchedCard watchedItem={mockWatchedItem} onRemove={jest.fn()} />);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(screen.getByText("Edit Watched Item")).toBeInTheDocument();
  });

  it("saves changes when save button is clicked", async () => {
    render(<WatchedCard watchedItem={mockWatchedItem} onRemove={jest.fn()} />);

    // Open dialog
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    // Change rating
    const ratingInput = screen.getByDisplayValue("9");
    fireEvent.change(ratingInput, { target: { value: "8" } });

    // Click save
    const saveButton = screen.getByText("Save");
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/watched?id=1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: 8, notes: "Great movie" }),
    });
  });

  it("deletes item when delete button is clicked", async () => {
    const mockOnRemove = jest.fn();
    render(
      <WatchedCard watchedItem={mockWatchedItem} onRemove={mockOnRemove} />
    );

    const deleteButton = screen.getByTestId("trash-icon").closest("button");
    expect(deleteButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(deleteButton!);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/watched?id=1", {
      method: "DELETE",
    });
    expect(mockOnRemove).toHaveBeenCalled();
  });

  it("handles API errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("API Error"));

    render(<WatchedCard watchedItem={mockWatchedItem} onRemove={jest.fn()} />);

    const deleteButton = screen.getByRole("button", {
      name: "Delete watched item",
    });
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Should still call onRemove or handle error
    expect(mockFetch).toHaveBeenCalled();
  });
});

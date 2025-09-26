// tests/unit/components/navigation.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock next/navigation
const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock hooks
const mockUseAuth = jest.fn();
jest.mock("@/hooks/use-auth", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock next-themes
const mockUseTheme = jest.fn();
jest.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
}));

// Mock next-auth/react
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
jest.mock("next-auth/react", () => ({
  signIn: mockSignIn,
  signOut: mockSignOut,
}));

import { Navigation } from "@/components/navigation";
import { signIn, signOut } from "next-auth/react";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Moon: () => <div data-testid="moon-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
  User: () => <div data-testid="user-icon" />,
  Film: () => <div data-testid="film-icon" />,
  Bookmark: () => <div data-testid="bookmark-icon" />,
  Search: () => <div data-testid="search-icon" />,
}));

describe("Navigation", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    mockUseTheme.mockReturnValue({ theme: "light", setTheme: jest.fn() });
  });

  it("renders navigation with logo and links", () => {
    render(<Navigation />);

    expect(screen.getByText("MovieTracker")).toBeInTheDocument();
    expect(screen.getAllByText("Search")).toHaveLength(2);
    expect(screen.getAllByText("Watched")).toHaveLength(2);
    expect(screen.getByText("Watchlist")).toBeInTheDocument();
  });

  it("highlights active link", () => {
    mockUsePathname.mockReturnValue("/watched");
    render(<Navigation />);

    // Get desktop nav links - there are multiple with same name, get the first (desktop)
    const watchedLinks = screen.getAllByRole("link", { name: "Watched" });
    expect(watchedLinks[0]).toHaveClass("text-foreground");

    const searchLinks = screen.getAllByRole("link", { name: "Search" });
    expect(searchLinks[0]).toHaveClass("text-foreground/60");
  });

  it("toggles theme when theme button is clicked", () => {
    const mockSetTheme = jest.fn();
    mockUseTheme.mockReturnValue({ theme: "light", setTheme: mockSetTheme });

    render(<Navigation />);

    const themeButton = screen.getByLabelText("Toggle theme");
    fireEvent.click(themeButton);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("shows sign in button when no user", () => {
    render(<Navigation />);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("calls signIn when sign in button is clicked", () => {
    render(<Navigation />);

    const signInButton = screen.getByText("Sign In");
    fireEvent.click(signInButton);

    expect(signIn).toHaveBeenCalled();
  });

  it("shows loading state", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    render(<Navigation />);

    expect(screen.queryByText("Sign In")).toBeNull();
    // Loading state shows pulse div instead of sign in button
  });

  it("shows user info and sign out button when authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: { name: "John Doe", email: "john@example.com" },
      loading: false,
    });

    render(<Navigation />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByLabelText("Sign out")).toBeInTheDocument();
  });

  it("calls signOut when sign out button is clicked", () => {
    mockUseAuth.mockReturnValue({
      user: { name: "John Doe", email: "john@example.com" },
      loading: false,
    });

    render(<Navigation />);

    const signOutButton = screen.getByLabelText("Sign out");
    fireEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("renders mobile navigation", () => {
    render(<Navigation />);

    // Mobile nav should be present
    expect(screen.getAllByText("Search")).toHaveLength(2); // Appears in both desktop and mobile
    expect(screen.getAllByText("Watched")).toHaveLength(2); // Appears in both desktop and mobile
    expect(screen.getByText("List")).toBeInTheDocument(); // Mobile version of Watchlist
  });
});

// tests/unit/components/search-bar.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "@/components/search-bar";

// Mock lucide-react
jest.mock("lucide-react", () => ({
  Search: () => <div data-testid="search-icon" />,
}));

describe("SearchBar", () => {
  it("renders with default placeholder", () => {
    const mockOnChange = jest.fn();

    render(<SearchBar value="" onChange={mockOnChange} />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    const mockOnChange = jest.fn();

    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        placeholder="Find movies..."
      />
    );

    expect(screen.getByPlaceholderText("Find movies...")).toBeInTheDocument();
  });

  it("displays the provided value", () => {
    const mockOnChange = jest.fn();

    render(<SearchBar value="test query" onChange={mockOnChange} />);

    const input = screen.getByDisplayValue("test query");
    expect(input).toBeInTheDocument();
  });

  it("calls onChange when input value changes", () => {
    const mockOnChange = jest.fn();

    render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new search" } });

    expect(mockOnChange).toHaveBeenCalledWith("new search");
  });

  it("has correct input attributes", () => {
    const mockOnChange = jest.fn();

    render(<SearchBar value="test" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveClass("pl-10", "py-6", "text-lg");
  });
});

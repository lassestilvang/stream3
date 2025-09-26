// tests/unit/components/textarea.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Textarea } from "@/components/ui/textarea";

describe("Textarea", () => {
  it("renders with default props", () => {
    render(<Textarea />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass(
      "flex",
      "min-h-[80px]",
      "w-full",
      "rounded-md",
      "border",
      "border-input",
      "bg-background",
      "px-3",
      "py-2",
      "text-sm",
      "ring-offset-background",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-ring",
      "focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed",
      "disabled:opacity-50"
    );
  });

  it("renders with placeholder", () => {
    render(<Textarea placeholder="Enter text" />);

    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders with value", () => {
    render(<Textarea value="test value" onChange={() => {}} />);

    expect(screen.getByDisplayValue("test value")).toBeInTheDocument();
  });

  it("calls onChange when value changes", () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "new value" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Textarea disabled />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Textarea className="custom-class" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-class");
  });

  it("passes through other props", () => {
    render(<Textarea data-testid="custom-textarea" rows={5} />);

    const textarea = screen.getByTestId("custom-textarea");
    expect(textarea).toHaveAttribute("rows", "5");
  });
});

// tests/unit/components/button.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with default variant and size", () => {
    render(<Button>Default Button</Button>);

    const button = screen.getByRole("button", { name: "Default Button" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      "inline-flex",
      "items-center",
      "justify-center",
      "whitespace-nowrap",
      "rounded-md",
      "text-sm",
      "font-medium",
      "bg-primary",
      "text-primary-foreground",
      "hover:bg-primary/90",
      "h-10",
      "px-4",
      "py-2"
    );
  });

  it("renders with secondary variant", () => {
    render(<Button variant="secondary">Secondary Button</Button>);

    const button = screen.getByRole("button", { name: "Secondary Button" });
    expect(button).toHaveClass(
      "bg-secondary",
      "text-secondary-foreground",
      "hover:bg-secondary/80"
    );
  });

  it("renders with destructive variant", () => {
    render(<Button variant="destructive">Destructive Button</Button>);

    const button = screen.getByRole("button", { name: "Destructive Button" });
    expect(button).toHaveClass(
      "bg-destructive",
      "text-destructive-foreground",
      "hover:bg-destructive/90"
    );
  });

  it("renders with outline variant", () => {
    render(<Button variant="outline">Outline Button</Button>);

    const button = screen.getByRole("button", { name: "Outline Button" });
    expect(button).toHaveClass(
      "border",
      "border-input",
      "bg-background",
      "hover:bg-accent",
      "hover:text-accent-foreground"
    );
  });

  it("renders with ghost variant", () => {
    render(<Button variant="ghost">Ghost Button</Button>);

    const button = screen.getByRole("button", { name: "Ghost Button" });
    expect(button).toHaveClass(
      "hover:bg-accent",
      "hover:text-accent-foreground"
    );
  });

  it("renders with link variant", () => {
    render(<Button variant="link">Link Button</Button>);

    const button = screen.getByRole("button", { name: "Link Button" });
    expect(button).toHaveClass(
      "text-primary",
      "underline-offset-4",
      "hover:underline"
    );
  });

  it("renders with small size", () => {
    render(<Button size="sm">Small Button</Button>);

    const button = screen.getByRole("button", { name: "Small Button" });
    expect(button).toHaveClass("h-9", "rounded-md", "px-3");
  });

  it("renders with large size", () => {
    render(<Button size="lg">Large Button</Button>);

    const button = screen.getByRole("button", { name: "Large Button" });
    expect(button).toHaveClass("h-11", "rounded-md", "px-8");
  });

  it("renders with icon size", () => {
    render(<Button size="icon">Icon</Button>);

    const button = screen.getByRole("button", { name: "Icon" });
    expect(button).toHaveClass("h-10", "w-10");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole("button", { name: "Disabled Button" });
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      "disabled:pointer-events-none",
      "disabled:opacity-50"
    );
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);

    const button = screen.getByRole("button", { name: "Clickable Button" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const button = screen.getByRole("button", { name: "Custom Button" });
    expect(button).toHaveClass("custom-class");
  });

  it("passes through other props", () => {
    render(
      <Button type="submit" data-testid="submit-button">
        Submit
      </Button>
    );

    const button = screen.getByTestId("submit-button");
    expect(button).toHaveAttribute("type", "submit");
  });
});

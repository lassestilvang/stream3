// tests/unit/components/badge.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders with default variant", () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "inline-flex",
      "items-center",
      "rounded-full",
      "border",
      "px-2.5",
      "py-0.5",
      "text-xs",
      "font-semibold"
    );
  });

  it("renders with secondary variant", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);

    const badge = screen.getByText("Secondary Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "border-transparent",
      "bg-secondary",
      "text-secondary-foreground"
    );
  });

  it("renders with destructive variant", () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);

    const badge = screen.getByText("Destructive Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "border-transparent",
      "bg-destructive",
      "text-destructive-foreground"
    );
  });

  it("renders with outline variant", () => {
    render(<Badge variant="outline">Outline Badge</Badge>);

    const badge = screen.getByText("Outline Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-foreground");
  });

  it("applies custom className", () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);

    const badge = screen.getByText("Custom Badge");
    expect(badge).toHaveClass("custom-class");
  });

  it("passes through other props", () => {
    render(<Badge data-testid="test-badge">Test Badge</Badge>);

    const badge = screen.getByTestId("test-badge");
    expect(badge).toBeInTheDocument();
  });
});

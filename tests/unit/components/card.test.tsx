// tests/unit/components/card.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

describe("Card", () => {
  it("renders Card with children", () => {
    render(<Card>Card Content</Card>);

    const card = screen.getByText("Card Content");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass(
      "rounded-lg",
      "border",
      "bg-card",
      "text-card-foreground",
      "shadow-sm"
    );
  });

  it("renders CardHeader", () => {
    render(<CardHeader>Header Content</CardHeader>);

    const header = screen.getByText("Header Content");
    expect(header).toHaveClass("flex", "flex-col", "space-y-1.5", "p-6");
  });

  it("renders CardTitle", () => {
    render(<CardTitle>Title Content</CardTitle>);

    const title = screen.getByText("Title Content");
    expect(title).toHaveClass(
      "text-2xl",
      "font-semibold",
      "leading-none",
      "tracking-tight"
    );
  });

  it("renders CardDescription", () => {
    render(<CardDescription>Description Content</CardDescription>);

    const description = screen.getByText("Description Content");
    expect(description).toHaveClass("text-sm", "text-muted-foreground");
  });

  it("renders CardContent", () => {
    render(<CardContent>Content</CardContent>);

    const content = screen.getByText("Content");
    expect(content).toHaveClass("p-6", "pt-0");
  });

  it("renders CardFooter", () => {
    render(<CardFooter>Footer Content</CardFooter>);

    const footer = screen.getByText("Footer Content");
    expect(footer).toHaveClass("flex", "items-center", "p-6", "pt-0");
  });

  it("applies custom className", () => {
    render(<Card className="custom-class">Custom Card</Card>);

    const card = screen.getByText("Custom Card");
    expect(card).toHaveClass("custom-class");
  });
});

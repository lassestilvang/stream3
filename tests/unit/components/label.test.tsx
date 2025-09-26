// tests/unit/components/label.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

// Mock Radix UI
jest.mock("@radix-ui/react-label", () => ({
  Root: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

describe("Label", () => {
  it("renders with children", () => {
    render(<Label>Label Text</Label>);

    const label = screen.getByText("Label Text");
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass(
      "text-sm",
      "font-medium",
      "leading-none",
      "peer-disabled:cursor-not-allowed",
      "peer-disabled:opacity-70"
    );
  });

  it("applies custom className", () => {
    render(<Label className="custom-class">Custom Label</Label>);

    const label = screen.getByText("Custom Label");
    expect(label).toHaveClass("custom-class");
  });

  it("passes through other props", () => {
    render(
      <Label htmlFor="input-id" data-testid="custom-label">
        Test Label
      </Label>
    );

    const label = screen.getByTestId("custom-label");
    expect(label).toHaveAttribute("for", "input-id");
  });
});

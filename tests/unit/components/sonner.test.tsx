// tests/unit/components/sonner.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock sonner
const mockSonner = jest.fn(({ children, ...props }) => (
  <div {...props}>{children}</div>
));
jest.mock("sonner", () => ({
  Toaster: mockSonner,
}));

import { Toaster } from "@/components/ui/sonner";

describe("Toaster", () => {
  beforeEach(() => {
    mockSonner.mockClear();
  });

  it("renders Toaster with correct props", () => {
    render(<Toaster />);

    expect(mockSonner).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: "system",
        className: "toaster group",
        toastOptions: {
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        },
      }),
      {}
    );
  });

  it("passes through additional props", () => {
    render(<Toaster position="top-right" />);

    expect(mockSonner).toHaveBeenCalledWith(
      expect.objectContaining({
        position: "top-right",
      }),
      {}
    );
  });
});

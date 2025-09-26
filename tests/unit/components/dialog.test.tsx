// tests/unit/components/dialog.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock Radix UI
jest.mock("@radix-ui/react-dialog", () => ({
  Root: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Trigger: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  Portal: ({ children }: any) => <div>{children}</div>,
  Overlay: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Content: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Close: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  Title: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  Description: ({ children, ...props }: any) => <p {...props}>{children}</p>,
}));

// Mock lucide-react
jest.mock("lucide-react", () => ({
  X: () => <div data-testid="x-icon" />,
}));

describe("Dialog", () => {
  it("renders DialogContent with correct classes", () => {
    render(
      <Dialog>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );

    const content = screen.getByText("Dialog Content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass(
      "fixed",
      "left-[50%]",
      "top-[50%]",
      "z-50",
      "grid",
      "w-full",
      "max-w-lg",
      "translate-x-[-50%]",
      "translate-y-[-50%]",
      "gap-4",
      "border",
      "bg-background",
      "p-6",
      "shadow-lg",
      "duration-200"
    );
  });

  it("renders DialogHeader", () => {
    render(
      <Dialog>
        <DialogContent>
          <DialogHeader>Header Content</DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const header = screen.getByText("Header Content");
    expect(header).toHaveClass(
      "flex",
      "flex-col",
      "space-y-1.5",
      "text-center",
      "sm:text-left"
    );
  });

  it("renders DialogTitle", () => {
    render(
      <Dialog>
        <DialogContent>
          <DialogTitle>Title Content</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const title = screen.getByText("Title Content");
    expect(title).toHaveClass(
      "text-lg",
      "font-semibold",
      "leading-none",
      "tracking-tight"
    );
  });

  it("renders DialogDescription", () => {
    render(
      <Dialog>
        <DialogContent>
          <DialogDescription>Description Content</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    const description = screen.getByText("Description Content");
    expect(description).toHaveClass("text-sm", "text-muted-foreground");
  });

  it("renders DialogFooter", () => {
    render(
      <Dialog>
        <DialogContent>
          <DialogFooter>Footer Content</DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const footer = screen.getByText("Footer Content");
    expect(footer).toHaveClass(
      "flex",
      "flex-col-reverse",
      "sm:flex-row",
      "sm:justify-end",
      "sm:space-x-2"
    );
  });

  it("renders close button with X icon", () => {
    render(
      <Dialog>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });
});

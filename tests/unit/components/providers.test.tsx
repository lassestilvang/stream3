// tests/unit/components/providers.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock next-auth/react
const mockSessionProvider = jest.fn(({ children }) => (
  <div data-testid="session-provider">{children}</div>
));
jest.mock("next-auth/react", () => ({
  SessionProvider: mockSessionProvider,
}));

// Mock theme-provider
const mockThemeProvider = jest.fn(({ children }) => (
  <div data-testid="theme-provider">{children}</div>
));
jest.mock("@/components/theme-provider", () => ({
  ThemeProvider: mockThemeProvider,
}));

import { Providers } from "@/components/providers";

describe("Providers", () => {
  beforeEach(() => {
    mockSessionProvider.mockClear();
    mockThemeProvider.mockClear();
  });

  it("renders children wrapped with SessionProvider and ThemeProvider", () => {
    const testChild = <div>Test Child</div>;

    render(<Providers>{testChild}</Providers>);

    expect(screen.getByTestId("session-provider")).toBeInTheDocument();
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("passes correct props to ThemeProvider", () => {
    const testChild = <div>Test Child</div>;

    render(<Providers>{testChild}</Providers>);

    expect(mockThemeProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        attribute: "class",
        defaultTheme: "system",
        enableSystem: true,
        disableTransitionOnChange: true,
      }),
      {}
    );
  });
});

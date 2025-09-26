// tests/unit/components/theme-provider.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock next-themes
const mockNextThemesProvider = jest.fn(({ children }) => (
  <div data-testid="next-themes-provider">{children}</div>
));
jest.mock("next-themes", () => ({
  ThemeProvider: mockNextThemesProvider,
}));

import { ThemeProvider } from "@/components/theme-provider";

describe("ThemeProvider", () => {
  beforeEach(() => {
    mockNextThemesProvider.mockClear();
  });

  it("renders children wrapped with NextThemesProvider", () => {
    const testChild = <div>Test Child</div>;

    render(<ThemeProvider>{testChild}</ThemeProvider>);

    expect(screen.getByTestId("next-themes-provider")).toBeInTheDocument();
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("passes props to NextThemesProvider", () => {
    const testProps = {
      attribute: "class",
      defaultTheme: "dark",
      enableSystem: true,
      disableTransitionOnChange: false,
    };

    render(
      <ThemeProvider {...testProps}>
        <div>Test</div>
      </ThemeProvider>
    );

    expect(mockNextThemesProvider).toHaveBeenCalledWith(
      expect.objectContaining(testProps),
      {}
    );
  });
});

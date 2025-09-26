// tests/unit/hooks/use-auth.test.ts
import { renderHook } from "@testing-library/react";
import { useAuth } from "@/hooks/use-auth";

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

import { useSession } from "next-auth/react";

const mockUseSession = useSession as jest.Mock;

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns loading true when session status is loading", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "loading",
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("returns user when authenticated", () => {
    const mockUser = { id: "1", name: "Test User", email: "test@example.com" };
    mockUseSession.mockReturnValue({
      data: { user: mockUser },
      status: "authenticated",
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it("returns null user when unauthenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("handles session data without user", () => {
    mockUseSession.mockReturnValue({
      data: {},
      status: "authenticated",
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

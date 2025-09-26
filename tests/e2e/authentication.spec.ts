// tests/e2e/authentication.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("user can sign in and access protected routes", async ({ page }) => {
    // Mock authenticated user session
    await page.addInitScript(() => {
      // Mock NextAuth session
      window.localStorage.setItem(
        "next-auth.session-token",
        "mock-session-token"
      );
    });

    // Mock API responses for authenticated user
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "test-user-id",
            name: "Test User",
            email: "test@example.com",
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
    });

    // Navigate to home page
    await page.goto("/");

    // Should show authenticated navigation
    await expect(page.getByText("Test User")).toBeVisible();

    // Navigate to watchlist (protected route)
    await page.getByRole("link", { name: "Watchlist" }).click();
    await expect(page).toHaveURL(/\/watchlist/);

    // Should be able to access watchlist page
    await expect(page.getByText("My Watchlist")).toBeVisible();

    // Navigate to watched page
    await page.getByRole("link", { name: "Watched" }).click();
    await expect(page).toHaveURL(/\/watched/);

    // Should be able to access watched page
    await expect(page.getByText("Watched Content")).toBeVisible();
  });

  test("unauthenticated user is redirected to sign in", async ({ page }) => {
    // Mock unauthenticated session
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ user: null }),
      });
    });

    // Navigate to watchlist
    await page.goto("/watchlist");

    // Should redirect to sign in page
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.getByText("Sign in to track your movies")).toBeVisible();

    // Should show sign in options
    await expect(
      page.getByRole("button", { name: "Sign in with GitHub" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign in with Google" })
    ).toBeVisible();
  });

  test("user can sign out", async ({ page }) => {
    // Mock authenticated user session
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "next-auth.session-token",
        "mock-session-token"
      );
    });

    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "test-user-id",
            name: "Test User",
            email: "test@example.com",
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
    });

    // Navigate to home page
    await page.goto("/");

    // Should show authenticated navigation
    await expect(page.getByText("Test User")).toBeVisible();

    // Click sign out button
    await page.getByRole("button", { name: "Sign out" }).click();

    // Mock sign out API call
    await page.route("**/api/auth/signout", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Should redirect to home page and show sign in button
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("authenticated user can access search functionality", async ({
    page,
  }) => {
    // Mock authenticated user session
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "next-auth.session-token",
        "mock-session-token"
      );
    });

    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "test-user-id",
            name: "Test User",
            email: "test@example.com",
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
    });

    // Navigate to home page
    await page.goto("/");

    // Search bar should be visible and functional
    const searchBar = page.locator('input[type="text"]');
    await expect(searchBar).toBeVisible();

    // Fill search and verify it's enabled for authenticated user
    await searchBar.fill("Test Movie");
    await expect(searchBar).toHaveValue("Test Movie");
  });
});

// tests/e2e/watchlist-management.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Watchlist Management", () => {
  test("user can view watchlist with items", async ({ page }) => {
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

    // Mock watchlist API with items
    await page.route("**/api/watchlist?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "watchlist-1",
            userId: "test-user-id",
            mediaId: 27205,
            title: "Inception",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
            overview:
              "A thief who steals corporate secrets through dream-sharing technology...",
            vote_average: 8.8,
            media_type: "movie",
            addedAt: new Date().toISOString(),
          },
          {
            id: "watchlist-2",
            userId: "test-user-id",
            mediaId: 603,
            title: "The Matrix",
            poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
            overview:
              "A computer hacker learns about the true nature of reality...",
            vote_average: 8.7,
            media_type: "movie",
            addedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
        ]),
      });
    });

    // Navigate to watchlist page
    await page.goto("/watchlist");

    // Verify page title
    await expect(page.getByText("My Watchlist")).toBeVisible();

    // Verify watchlist items are displayed
    await expect(page.getByText("Inception")).toBeVisible();
    await expect(page.getByText("The Matrix")).toBeVisible();

    // Verify movie details
    await expect(
      page.getByText(
        "A thief who steals corporate secrets through dream-sharing technology..."
      )
    ).toBeVisible();
    await expect(page.getByText("8.8")).toBeVisible();
    await expect(page.getByText("Added today")).toBeVisible();
  });

  test("user can remove item from watchlist", async ({ page }) => {
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

    // Mock watchlist API with one item
    await page.route("**/api/watchlist?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "watchlist-1",
            userId: "test-user-id",
            mediaId: 27205,
            title: "Inception",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
            overview: "A thief who steals corporate secrets...",
            vote_average: 8.8,
            media_type: "movie",
            addedAt: new Date().toISOString(),
          },
        ]),
      });
    });

    // Mock delete API
    await page.route("**/api/watchlist?id=watchlist-1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Navigate to watchlist page
    await page.goto("/watchlist");

    // Verify item is displayed
    await expect(page.getByText("Inception")).toBeVisible();

    // Click remove button (X button)
    await page
      .locator("button")
      .filter({ hasText: "" })
      .locator("svg")
      .first()
      .click();

    // Verify success toast
    await expect(page.getByText("Removed from watchlist")).toBeVisible();

    // Mock empty watchlist for subsequent calls
    await page.route("**/api/watchlist?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    // Verify item is removed from UI
    await expect(page.getByText("Your watchlist is empty")).toBeVisible();
  });

  test("user can mark item as watched from watchlist", async ({ page }) => {
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

    // Mock watchlist API with one item
    await page.route("**/api/watchlist?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "watchlist-1",
            userId: "test-user-id",
            mediaId: 27205,
            title: "Inception",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
            overview: "A thief who steals corporate secrets...",
            vote_average: 8.8,
            media_type: "movie",
            addedAt: new Date().toISOString(),
          },
        ]),
      });
    });

    // Mock watched API
    await page.route("**/api/watched", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Navigate to watchlist page
    await page.goto("/watchlist");

    // Verify item is displayed
    await expect(page.getByText("Inception")).toBeVisible();

    // Click "Watched" button
    await page.getByRole("button", { name: "Watched" }).click();

    // Verify success toast
    await expect(page.getByText("Marked as watched")).toBeVisible();

    // Mock empty watchlist for subsequent calls
    await page.route("**/api/watchlist?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    // Verify item is removed from watchlist
    await expect(page.getByText("Your watchlist is empty")).toBeVisible();
  });

  test("user can search within watchlist", async ({ page }) => {
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

    // Mock watchlist API with multiple items
    await page.route("**/api/watchlist?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "watchlist-1",
            userId: "test-user-id",
            mediaId: 27205,
            title: "Inception",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
            overview:
              "A thief who steals corporate secrets through dream-sharing technology...",
            vote_average: 8.8,
            media_type: "movie",
            addedAt: new Date().toISOString(),
          },
          {
            id: "watchlist-2",
            userId: "test-user-id",
            mediaId: 603,
            title: "The Matrix",
            poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
            overview:
              "A computer hacker learns about the true nature of reality...",
            vote_average: 8.7,
            media_type: "movie",
            addedAt: new Date().toISOString(),
          },
        ]),
      });
    });

    // Navigate to watchlist page
    await page.goto("/watchlist");

    // Verify both items are displayed
    await expect(page.getByText("Inception")).toBeVisible();
    await expect(page.getByText("The Matrix")).toBeVisible();

    // Search for "Inception"
    const searchInput = page.getByPlaceholder("Search watchlist...");
    await searchInput.fill("Inception");

    // Verify only Inception is shown
    await expect(page.getByText("Inception")).toBeVisible();
    await expect(page.getByText("The Matrix")).not.toBeVisible();

    // Clear search
    await searchInput.clear();

    // Verify both items are visible again
    await expect(page.getByText("Inception")).toBeVisible();
    await expect(page.getByText("The Matrix")).toBeVisible();
  });

  test("empty watchlist shows appropriate message", async ({ page }) => {
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

    // Mock empty watchlist
    await page.route("**/api/watchlist?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    // Navigate to watchlist page
    await page.goto("/watchlist");

    // Verify empty state message
    await expect(page.getByText("Your watchlist is empty")).toBeVisible();
    await expect(
      page.getByText("Search for content and add it to your watchlist")
    ).toBeVisible();
  });
});

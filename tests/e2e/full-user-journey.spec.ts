// tests/e2e/full-user-journey.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Full User Journey", () => {
  test("complete flow from search to watching with rating", async ({
    page,
  }) => {
    // Start with unauthenticated state
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ user: null }),
      });
    });

    // Navigate to home page
    await page.goto("/");

    // Should show sign in button
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();

    // Mock sign in process
    await page.route("**/api/auth/signin/github", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Mock authenticated session after sign in
    await page.route(
      "**/api/auth/session",
      async (route) => {
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
      },
      { times: 1 }
    );

    // Click sign in button
    await page.getByRole("button", { name: "Sign In" }).click();

    // Mock successful sign in redirect
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

    // Should be redirected to home page and show authenticated navigation
    await expect(page.getByText("Test User")).toBeVisible();

    // Mock TMDB search for "Interstellar"
    await page.route("**/api/tmdb/search?q=Interstellar", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            {
              id: 157336,
              title: "Interstellar",
              name: null,
              overview:
                "A team of explorers travel through a wormhole in space...",
              poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
              backdrop_path: "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
              vote_average: 8.6,
              media_type: "movie",
              release_date: "2014-11-05",
              first_air_date: null,
            },
          ],
          total_results: 1,
          page: 1,
          total_pages: 1,
        }),
      });
    });

    // Search for Interstellar
    const searchBar = page.locator('input[type="text"]');
    await searchBar.fill("Interstellar");
    await searchBar.press("Enter");

    // Verify search results
    await expect(page.getByText("Search Results")).toBeVisible();
    await expect(page.getByText("Interstellar")).toBeVisible();

    // Mock watchlist API
    await page.route("**/api/watchlist", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Add to watchlist
    await page.getByRole("button", { name: "Watchlist" }).first().click();
    await expect(page.getByText("Added to watchlist!")).toBeVisible();

    // Navigate to watchlist
    await page.getByRole("link", { name: "Watchlist" }).click();
    await expect(page).toHaveURL(/\/watchlist/);

    // Mock watchlist with the added item
    await page.route("**/api/watchlist?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "watchlist-1",
            userId: "test-user-id",
            mediaId: 157336,
            title: "Interstellar",
            poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            backdrop_path: "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
            overview:
              "A team of explorers travel through a wormhole in space...",
            vote_average: 8.6,
            media_type: "movie",
            addedAt: new Date().toISOString(),
          },
        ]),
      });
    });

    // Verify Interstellar is in watchlist
    await expect(page.getByText("Interstellar")).toBeVisible();

    // Mock watched API for marking as watched
    await page.route("**/api/watched", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Mark as watched
    await page.getByRole("button", { name: "Watched" }).click();
    await expect(page.getByText("Marked as watched")).toBeVisible();

    // Mock empty watchlist after moving to watched
    await page.route("**/api/watchlist?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    // Verify watchlist is now empty
    await expect(page.getByText("Your watchlist is empty")).toBeVisible();

    // Navigate to watched list
    await page.getByRole("link", { name: "Watched" }).click();
    await expect(page).toHaveURL(/\/watched/);

    // Mock watched list with the item
    await page.route("**/api/watched?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "watched-1",
            userId: "test-user-id",
            mediaId: 157336,
            title: "Interstellar",
            poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            backdrop_path: "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
            overview:
              "A team of explorers travel through a wormhole in space...",
            vote_average: 8.6,
            media_type: "movie",
            watchedDate: new Date().toISOString(),
            rating: null,
            notes: null,
          },
        ]),
      });
    });

    // Verify Interstellar is in watched list
    await expect(page.getByText("Interstellar")).toBeVisible();

    // Mock update API for editing
    await page.route("**/api/watched?id=watched-1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Edit the watched item - add rating and notes
    await page.getByRole("button", { name: "Edit" }).click();
    await expect(page.getByText("Edit Watched Item")).toBeVisible();

    await page.getByLabel("Rating (1-10)").fill("10");
    await page
      .getByLabel("Notes")
      .fill("Absolutely stunning visually. Nolan at his best!");

    await page.getByRole("button", { name: "Save" }).click();
    await expect(
      page.getByText("Watched item updated successfully")
    ).toBeVisible();

    // Mock updated watched item
    await page.route("**/api/watched?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "watched-1",
            userId: "test-user-id",
            mediaId: 157336,
            title: "Interstellar",
            poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            backdrop_path: "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
            overview:
              "A team of explorers travel through a wormhole in space...",
            vote_average: 8.6,
            media_type: "movie",
            watchedDate: new Date().toISOString(),
            rating: 10,
            notes: "Absolutely stunning visually. Nolan at his best!",
          },
        ]),
      });
    });

    // Verify rating and notes are displayed
    await expect(page.getByText("10")).toBeVisible();
    await expect(page.getByText("Notes:")).toBeVisible();
    await expect(
      page.getByText("Absolutely stunning visually. Nolan at his best!")
    ).toBeVisible();

    // Sign out
    await page.getByRole("button", { name: "Sign out" }).click();

    // Mock sign out
    await page.route("**/api/auth/signout", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Mock unauthenticated session
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ user: null }),
      });
    });

    // Should show sign in button again
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });
});

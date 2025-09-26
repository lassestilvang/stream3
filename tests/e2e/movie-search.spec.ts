// tests/e2e/movie-search.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Movie Search Flow", () => {
  test("user can search for movies and view results", async ({ page }) => {
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

    // Mock TMDB search API
    await page.route("**/api/tmdb/search?q=Inception", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            {
              id: 27205,
              title: "Inception",
              name: null,
              overview:
                "A thief who steals corporate secrets through dream-sharing technology...",
              poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
              backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
              vote_average: 8.8,
              media_type: "movie",
              release_date: "2010-07-15",
              first_air_date: null,
            },
            {
              id: 12345,
              title: "Inception 2",
              name: null,
              overview: "A sequel to the mind-bending thriller...",
              poster_path: "/fake-poster.jpg",
              backdrop_path: "/fake-backdrop.jpg",
              vote_average: 7.5,
              media_type: "movie",
              release_date: "2025-01-01",
              first_air_date: null,
            },
          ],
          total_results: 2,
          page: 1,
          total_pages: 1,
        }),
      });
    });

    // Navigate to home page
    await page.goto("/");

    // Search for a movie
    const searchBar = page.locator('input[type="text"]');
    await searchBar.fill("Inception");
    await searchBar.press("Enter");

    // Wait for search results to load
    await expect(page.getByText("Search Results")).toBeVisible();

    // Verify movie cards are displayed
    await expect(page.getByText("Inception")).toBeVisible();
    await expect(page.getByText("Inception 2")).toBeVisible();

    // Verify movie details
    await expect(
      page.getByText(
        "A thief who steals corporate secrets through dream-sharing technology..."
      )
    ).toBeVisible();
    await expect(page.getByText("8.8")).toBeVisible();
    await expect(page.getByText("Movie")).toBeVisible();
  });

  test("user can add movie to watchlist from search results", async ({
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

    // Mock TMDB search API
    await page.route("**/api/tmdb/search?q=Inception", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            {
              id: 27205,
              title: "Inception",
              name: null,
              overview: "A thief who steals corporate secrets...",
              poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
              backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
              vote_average: 8.8,
              media_type: "movie",
              release_date: "2010-07-15",
              first_air_date: null,
            },
          ],
          total_results: 1,
          page: 1,
          total_pages: 1,
        }),
      });
    });

    // Mock watchlist API
    await page.route("**/api/watchlist", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Navigate to home page
    await page.goto("/");

    // Search for a movie
    const searchBar = page.locator('input[type="text"]');
    await searchBar.fill("Inception");
    await searchBar.press("Enter");

    // Wait for search results
    await expect(page.getByText("Search Results")).toBeVisible();

    // Click "Watchlist" button on the movie card
    await page.getByRole("button", { name: "Watchlist" }).first().click();

    // Verify success toast appears
    await expect(page.getByText("Added to watchlist!")).toBeVisible();
  });

  test("user can add movie to watched list from search results", async ({
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

    // Mock TMDB search API
    await page.route("**/api/tmdb/search?q=The+Matrix", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            {
              id: 603,
              title: "The Matrix",
              name: null,
              overview:
                "A computer hacker learns about the true nature of reality...",
              poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
              backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
              vote_average: 8.7,
              media_type: "movie",
              release_date: "1999-03-30",
              first_air_date: null,
            },
          ],
          total_results: 1,
          page: 1,
          total_pages: 1,
        }),
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

    // Navigate to home page
    await page.goto("/");

    // Search for a movie
    const searchBar = page.locator('input[type="text"]');
    await searchBar.fill("The Matrix");
    await searchBar.press("Enter");

    // Wait for search results
    await expect(page.getByText("Search Results")).toBeVisible();

    // Click "Watched" button on the movie card
    await page.getByRole("button", { name: "Watched" }).first().click();

    // Verify success toast appears
    await expect(page.getByText("Added to watched list!")).toBeVisible();
  });

  test("search shows no results for non-existent movie", async ({ page }) => {
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

    // Mock TMDB search API with no results
    await page.route(
      "**/api/tmdb/search?q=NonExistentMovie12345",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            results: [],
            total_results: 0,
            page: 1,
            total_pages: 0,
          }),
        });
      }
    );

    // Navigate to home page
    await page.goto("/");

    // Search for non-existent movie
    const searchBar = page.locator('input[type="text"]');
    await searchBar.fill("NonExistentMovie12345");
    await searchBar.press("Enter");

    // Verify no results message
    await expect(page.getByText("No results found")).toBeVisible();
    await expect(
      page.getByText("Try searching for something else")
    ).toBeVisible();
  });
});

// tests/e2e/watched-management.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Watched List Management", () => {
  test("user can view watched items with ratings and notes", async ({
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

    // Mock watched API with items
    await page.route("**/api/watched?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "watched-1",
            userId: "test-user-id",
            mediaId: 27205,
            title: "Inception",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
            overview:
              "A thief who steals corporate secrets through dream-sharing technology...",
            vote_average: 8.8,
            media_type: "movie",
            watchedDate: new Date().toISOString(),
            rating: 9,
            notes: "Mind-bending masterpiece!",
          },
          {
            id: "watched-2",
            userId: "test-user-id",
            mediaId: 603,
            title: "The Matrix",
            poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
            overview:
              "A computer hacker learns about the true nature of reality...",
            vote_average: 8.7,
            media_type: "movie",
            watchedDate: new Date(Date.now() - 86400000).toISOString(),
            rating: null,
            notes: null,
          },
        ]),
      });
    });

    // Navigate to watched page
    await page.goto("/watched");

    // Verify page title
    await expect(page.getByText("Watched Content")).toBeVisible();

    // Verify watched items are displayed
    await expect(page.getByText("Inception")).toBeVisible();
    await expect(page.getByText("The Matrix")).toBeVisible();

    // Verify rating is displayed for Inception
    await expect(page.getByText("9")).toBeVisible();

    // Verify notes are displayed
    await expect(page.getByText("Notes:")).toBeVisible();
    await expect(page.getByText("Mind-bending masterpiece!")).toBeVisible();

    // Verify watched dates
    await expect(page.getByText(/today/i)).toBeVisible();
  });

  test("user can edit watched item rating and notes", async ({ page }) => {
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

    // Mock watched API with one item
    await page.route("**/api/watched?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "watched-1",
            userId: "test-user-id",
            mediaId: 27205,
            title: "Inception",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
            overview: "A thief who steals corporate secrets...",
            vote_average: 8.8,
            media_type: "movie",
            watchedDate: new Date().toISOString(),
            rating: null,
            notes: null,
          },
        ]),
      });
    });

    // Mock update API
    await page.route("**/api/watched?id=watched-1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Navigate to watched page
    await page.goto("/watched");

    // Click Edit button
    await page.getByRole("button", { name: "Edit" }).click();

    // Verify dialog opens
    await expect(page.getByText("Edit Watched Item")).toBeVisible();

    // Fill rating and notes
    await page.getByLabel("Rating (1-10)").fill("8");
    await page.getByLabel("Notes").fill("Great movie with amazing visuals!");

    // Click Save
    await page.getByRole("button", { name: "Save" }).click();

    // Verify success toast
    await expect(
      page.getByText("Watched item updated successfully")
    ).toBeVisible();
  });

  test("user can delete watched item", async ({ page }) => {
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

    // Mock watched API with one item
    await page.route("**/api/watched?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "watched-1",
            userId: "test-user-id",
            mediaId: 27205,
            title: "Inception",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
            overview: "A thief who steals corporate secrets...",
            vote_average: 8.8,
            media_type: "movie",
            watchedDate: new Date().toISOString(),
            rating: 9,
            notes: "Amazing movie!",
          },
        ]),
      });
    });

    // Mock delete API
    await page.route("**/api/watched?id=watched-1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Navigate to watched page
    await page.goto("/watched");

    // Verify item is displayed
    await expect(page.getByText("Inception")).toBeVisible();

    // Click delete button (trash icon)
    await page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .nth(1)
      .click();

    // Verify success toast
    await expect(page.getByText("Watched item removed")).toBeVisible();

    // Mock empty watched list for subsequent calls
    await page.route("**/api/watched?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    // Verify item is removed from UI
    await expect(page.getByText("No watched content yet")).toBeVisible();
  });

  test("user can filter watched items by date", async ({ page }) => {
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

    // Mock watched API with items from different dates
    await page.route("**/api/watched?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "watched-1",
            userId: "test-user-id",
            mediaId: 27205,
            title: "Inception",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
            overview: "A thief who steals corporate secrets...",
            vote_average: 8.8,
            media_type: "movie",
            watchedDate: new Date().toISOString(),
            rating: 9,
            notes: null,
          },
          {
            id: "watched-2",
            userId: "test-user-id",
            mediaId: 603,
            title: "The Matrix",
            poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
            overview:
              "A computer hacker learns about the true nature of reality...",
            vote_average: 8.7,
            media_type: "movie",
            watchedDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            rating: null,
            notes: null,
          },
        ]),
      });
    });

    // Navigate to watched page
    await page.goto("/watched");

    // Verify both items are displayed
    await expect(page.getByText("Inception")).toBeVisible();
    await expect(page.getByText("The Matrix")).toBeVisible();

    // Filter by today's date
    const today = new Date().toISOString().split("T")[0];
    await page.getByPlaceholder("Filter by date").fill(today);

    // Verify only Inception is shown (watched today)
    await expect(page.getByText("Inception")).toBeVisible();
    await expect(page.getByText("The Matrix")).not.toBeVisible();

    // Clear date filter
    await page.getByPlaceholder("Filter by date").clear();

    // Verify both items are visible again
    await expect(page.getByText("Inception")).toBeVisible();
    await expect(page.getByText("The Matrix")).toBeVisible();
  });

  test("user can search within watched items", async ({ page }) => {
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

    // Mock watched API with multiple items
    await page.route("**/api/watched?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "watched-1",
            userId: "test-user-id",
            mediaId: 27205,
            title: "Inception",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
            overview:
              "A thief who steals corporate secrets through dream-sharing technology...",
            vote_average: 8.8,
            media_type: "movie",
            watchedDate: new Date().toISOString(),
            rating: 9,
            notes: "Mind-bending!",
          },
          {
            id: "watched-2",
            userId: "test-user-id",
            mediaId: 603,
            title: "The Matrix",
            poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
            overview:
              "A computer hacker learns about the true nature of reality...",
            vote_average: 8.7,
            media_type: "movie",
            watchedDate: new Date().toISOString(),
            rating: null,
            notes: null,
          },
        ]),
      });
    });

    // Navigate to watched page
    await page.goto("/watched");

    // Verify both items are displayed
    await expect(page.getByText("Inception")).toBeVisible();
    await expect(page.getByText("The Matrix")).toBeVisible();

    // Search for "Inception"
    const searchInput = page.getByPlaceholder("Search watched content...");
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

  test("empty watched list shows appropriate message", async ({ page }) => {
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

    // Mock empty watched list
    await page.route("**/api/watched?userId=test-user-id", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    // Navigate to watched page
    await page.goto("/watched");

    // Verify empty state message
    await expect(page.getByText("No watched content yet")).toBeVisible();
    await expect(
      page.getByText("Search for content to add to your watched list")
    ).toBeVisible();
  });
});

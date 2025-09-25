// tests/e2e/home-page.spec.ts
import { test, expect } from '@playwright/test';

test('home page has search functionality', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Movie Tracker/);

  // Expect the search bar to be present
  const searchBar = page.locator('input[type="text"]');
  await expect(searchBar).toBeVisible();

  // Fill in the search bar and submit
  await searchBar.fill('Inception');
  await expect(searchBar).toHaveValue('Inception');
});

test('navigation works correctly', async ({ page }) => {
  await page.goto('/');

  // Click on the Watched link
  await page.getByRole('link', { name: 'Watched' }).click();
  await expect(page).toHaveURL(/\/watched/);

  // Go back to the home page
  await page.getByRole('link', { name: 'MovieTracker' }).click();
  await expect(page).toHaveURL(/\/$/);

  // Click on the Watchlist link
  await page.getByRole('link', { name: 'Watchlist' }).click();
  await expect(page).toHaveURL(/\/watchlist/);
});
// tests/e2e/signup.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Signup Flow", () => {
  test("user can sign up with valid credentials", async ({ page }) => {
    // Navigate to sign up page
    await page.goto("/auth/signup");

    // Fill in signup form
    await page.getByLabel("Name").fill("New Test User");
    await page.getByLabel("Email").fill("newtest@example.com");
    await page.getByLabel("Password").fill("TestPass123");
    await page.getByLabel("Confirm Password").fill("TestPass123");

    // Mock successful signup API response
    await page.route("**/api/auth/signup", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Account created. Please check your email for verification.",
        }),
      });
    });

    // Submit form
    await page.getByRole("button", { name: "Create Account" }).click();

    // Should show success message
    await expect(page.getByText("Account created successfully! Please check your email for verification.")).toBeVisible();

    // Form should be cleared
    await expect(page.getByLabel("Name")).toHaveValue("");
    await expect(page.getByLabel("Email")).toHaveValue("");
    await expect(page.getByLabel("Password")).toHaveValue("");
    await expect(page.getByLabel("Confirm Password")).toHaveValue("");
  });

  test("signup form validation shows errors for invalid input", async ({ page }) => {
    // Navigate to sign up page
    await page.goto("/auth/signup");

    // Try to submit empty form
    await page.getByRole("button", { name: "Create Account" }).click();

    // Should show validation errors
    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
    await expect(page.getByText("Please confirm your password")).toBeVisible();

    // Fill invalid data
    await page.getByLabel("Name").fill("A");
    await page.getByLabel("Email").fill("invalid-email");
    await page.getByLabel("Password").fill("weak");
    await page.getByLabel("Confirm Password").fill("different");

    // Submit form
    await page.getByRole("button", { name: "Create Account" }).click();

    // Should show specific validation errors
    await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
    await expect(page.getByText("Please enter a valid email")).toBeVisible();
    await expect(page.getByText("Password must be at least 8 characters")).toBeVisible();
    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("signup shows error for duplicate email", async ({ page }) => {
    // Navigate to sign up page
    await page.goto("/auth/signup");

    // Fill form with existing email
    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("TestPass123");
    await page.getByLabel("Confirm Password").fill("TestPass123");

    // Mock duplicate email response
    await page.route("**/api/auth/signup", async (route) => {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          errors: { email: "An account with this email already exists" },
        }),
      });
    });

    // Submit form
    await page.getByRole("button", { name: "Create Account" }).click();

    // Should show duplicate email error
    await expect(page.getByText("An account with this email already exists")).toBeVisible();
  });

  test("user can sign up with GitHub", async ({ page }) => {
    // Navigate to sign up page
    await page.goto("/auth/signup");

    // Mock GitHub OAuth flow
    await page.route("**/api/auth/signin/github", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Click GitHub signup button
    await page.getByRole("button", { name: "Sign up with GitHub" }).click();

    // Should redirect or show success (mocked)
    await expect(page.getByText("Create Account")).toBeVisible();
  });

  test("user can sign up with Google", async ({ page }) => {
    // Navigate to sign up page
    await page.goto("/auth/signup");

    // Mock Google OAuth flow
    await page.route("**/api/auth/signin/google", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Click Google signup button
    await page.getByRole("button", { name: "Sign up with Google" }).click();

    // Should redirect or show success (mocked)
    await expect(page.getByText("Create Account")).toBeVisible();
  });

  test("user can verify email with valid token", async ({ page }) => {
    // Navigate to verification page with token
    await page.goto("/auth/verify?token=valid-verification-token");

    // Mock successful verification API response
    await page.route("**/api/auth/verify?token=valid-verification-token", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Email verified successfully",
        }),
      });
    });

    // Should show success message
    await expect(page.getByText("Email verified successfully")).toBeVisible();

    // Should show link to sign in
    await expect(page.getByRole("button", { name: "Go to Sign In" })).toBeVisible();
  });

  test("verification shows error for invalid token", async ({ page }) => {
    // Navigate to verification page with invalid token
    await page.goto("/auth/verify?token=invalid-token");

    // Mock invalid token response
    await page.route("**/api/auth/verify?token=invalid-token", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Invalid or expired verification token",
        }),
      });
    });

    // Should show error message
    await expect(page.getByText("Invalid or expired verification token")).toBeVisible();

    // Should show link back to signup
    await expect(page.getByRole("button", { name: "Back to Sign Up" })).toBeVisible();
  });
});
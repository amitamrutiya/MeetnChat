import { test, expect } from "@playwright/test";

test("should allow a user to sign up", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page.locator("text=Please Login to Use")).toBeVisible();
  await expect(page.locator("text=Sign in to start your anonymous adventure")).toBeVisible();

  await expect(page.locator("text=Please enter a valid email address")).toBeHidden();
  await expect(page.locator("text=Password must be at least 6 characters")).toBeHidden();

  await page.click('button:has-text("Log In")');

  await expect(page.locator("text=Please enter a valid email address")).toBeVisible();
  await expect(page.locator("text=Password must be at least 6 characters")).toBeVisible();

  await page.fill('input[placeholder="Email/Username"]', "testuser");
  await page.fill('input[placeholder="Password"]', "TestPassword123");

  await expect(page.locator("text=Please enter a valid email address")).toBeHidden();
  await expect(page.locator("text=Password must be at least 6 characters")).toBeHidden();

});

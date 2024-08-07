import { test, expect } from "@playwright/test";

test("homapge text", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("domcontentloaded");

  await expect(page.locator("text=ChillChat")).toBeVisible();
  await expect(page.locator("text=Miss")).toBeVisible();
  await expect(page.locator("text=All in one Website for Meet")).toBeVisible();
  await expect(page.locator("text=Please Login to Use")).toBeVisible();
  await expect(page.locator("text=Sign in to start your anonymous adventure")).toBeVisible();
  await expect(page.locator('input[name="identifier"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator("text=Log In")).toBeVisible();
  await expect(page.locator("text=Sign in with Google")).toBeVisible();

  await expect(page.locator('h2:has-text("Best way to connect with people")')).toBeVisible();
  await expect(
    page.locator(
      "text=Connect with people around the world with just a click of a button. Best way to connect with people."
    )
  ).toBeVisible();
  await expect(page.locator("canvas")).toBeVisible();
});

import { test, expect } from "@playwright/test";

test("homapge has title", async ({ page }) => {
  page.on("console", (msg) => console.log(msg.text()));

  await page.goto("http://localhost:3000");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/MeetnChillChat/);
});

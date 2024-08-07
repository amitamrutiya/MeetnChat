import { test, expect } from "@playwright/test";

test("should allow a user to sign up", async ({ page }) => {
  // Navigate to the signup page
  await page.goto("http://localhost:3000");

  // Click on the 'SignUp' tab
  await expect(page.locator("text=Please SignUp to Use")).toBeHidden();
  await expect(page.locator("text=Sign up to start your anonymous adventure")).toBeHidden();

  await page.click("text=SignUp");

  await expect(page.locator("text=Please SignUp to Use")).toBeVisible();
  await expect(page.locator("text=Sign up to start your anonymous adventure")).toBeVisible();

  // Fill out the signup form
  await page.fill('input[placeholder="Enter Full Name"]', "Test User");
  await page.fill('input[placeholder="Username"]', "testuser");
  await page.fill('input[placeholder="Email"]', "testuser@example.com");
  await page.fill('input[placeholder="Password"]', "TestPassword123");

  // Click the 'Sign Up' button
  // await page.click('button:has-text("Sign Up")');

  // You might want to check for a success message or redirection
  // await expect(page).toHaveURL(/.*dashboard/); // Adjust the URL or condition as needed
  // Or check for a success message
  // await expect(page.locator('text=Signup successful')).toBeVisible();
});

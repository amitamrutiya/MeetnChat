import { test, expect } from '@playwright/test';

const functions = [
  {
    title: "One-to-One Video Call",
    subtitle: "Fast and Direct Communication",
    description:
      "Connect instantly with another user for a direct video call. Experience seamless communication with real-time video streaming, ensuring a swift exchange of information.",
    link: `/room/one-video/`, // Use a placeholder for dynamic UUIDs
  },
  {
    title: "Group Video Call",
    subtitle: "Collaborate with Multiple Participants",
    description:
      "Host video calls with multiple participants for collaborative discussions. Although slightly slower due to increased data transfer, enjoy the benefits of real-time interaction with multiple team members or friends.",
    link: `/room/group-video/`,
  },
  {
    title: "One-to-One Meeting Call",
    subtitle: "Efficient and Personalized Meetings",
    description:
      "Conduct efficient one-to-one meetings with colleagues or clients. Enjoy faster connection speeds for personalized discussions, allowing for effective communication and decision-making.",
    link: `/room/one-meet/`,
  },
  {
    title: "Group Meeting Call",
    subtitle: "Coordinate with Large Groups",
    description:
      "Organize meetings with larger groups for discussions, presentations, or brainstorming sessions. While slightly slower due to increased data handling, benefit from the ability to engage with multiple participants simultaneously.",
    link: `/room/group-meet/`,
  },
  {
    title: "One-to-One User Chat",
    subtitle: "Instant Text Communication",
    description:
      "Engage in private text conversations with individual users. Experience instantaneous message delivery for seamless communication, enabling quick exchange of ideas, information, or updates.",
    link: `/room/one-chat`,
  },
  {
    title: "Group User Chat",
    subtitle: "Collaborative Text Communication",
    description:
      "Participate in group chats with multiple users for collaborative discussions or coordination. Enjoy real-time messaging with the added benefit of engaging with a larger community simultaneously.",
    link: `/room/group-chat`,
  },
  {
    title: "Random Video Call",
    subtitle: "Connect with Random Users",
    description:
      "Connect with random users for spontaneous video calls. Experience the excitement of meeting new people while engaging in real-time video conversations.",
    link: `/room/random-video`,
  },
];

test.describe('IconCardButton component tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the target URL
    await page.goto('http://localhost:3000');
  });

  functions.forEach((func, index) => {
    test(`should display correct information for ${func.title}`, async ({ page }) => {
      // Verify the title
      await expect(page.locator(`text=${func.title}`)).toBeVisible();

      // Verify the subtitle
      await expect(page.locator(`text=${func.subtitle}`)).toBeVisible();

      // Verify the description in the hover card content
      await page.hover(`text=${func.title}`);
      await expect(page.locator('text=' + func.description)).toBeVisible();
    });

    test(`should navigate to correct link when ${func.title} is clicked`, async ({ page }) => {
      // Click the element
      await page.click(`text=${func.title}`);

      // Construct the expected URL pattern
      const baseURL = func.link.replace(/\/\{.+\}$/, '');
      // const expectedURLPattern = new RegExp(`${baseURL}/[a-f0-9-]{36}$`); // UUID regex pattern

      // Verify the URL after clicking
      await expect(page).toHaveURL(baseURL);
    });

  });
});

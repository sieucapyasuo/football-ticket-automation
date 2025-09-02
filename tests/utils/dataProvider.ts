import { Page, expect } from "@playwright/test";
import { EventPage } from "../pages/EventPage";

export async function openFirstTeamFromFinal(page: Page): Promise<void> {
  // Click the first visible "View All .* Matches" link on the page and wait for navigation
  const link = page.getByRole("link", { name: /View All .* Matches/i }).first();
  await expect(link).toBeVisible({ timeout: 10000 });
  await link.scrollIntoViewIfNeeded().catch(() => {});
  await Promise.all([
    page.waitForURL(/\/[a-z\-]+-football-tickets/i, { timeout: 15000 }),
    link.click(),
  ]);
  // Ensure team/events list is rendered
  await page.waitForLoadState("domcontentloaded");
  await expect(page.locator('a:has-text("View Tickets")').first()).toBeVisible({
    timeout: 15000,
  });
}

export async function openFirstEventFromTeam(page: Page): Promise<void> {
  // Prefer the first visible event card link that contains "View Tickets"
  const candidates = page.locator('a:has-text("View Tickets")');
  await expect(candidates.first()).toBeVisible({ timeout: 15000 });
  const count = await candidates.count();
  for (let i = 0; i < count; i += 1) {
    const link = candidates.nth(i);
    if (await link.isVisible()) {
      await link.scrollIntoViewIfNeeded().catch(() => {});
      await link.click();
      await page.waitForLoadState("domcontentloaded");
      // Assert stable event page markers instead of brittle matrix hint
      const eventPage = new EventPage(page);
      await eventPage.assertCoreInfoVisible();
      break;
    }
  }
}

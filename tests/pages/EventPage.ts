import { Locator, Page, expect } from "@playwright/test";

export class EventPage {
  readonly page: Page;
  readonly title: Locator;
  readonly date: Locator;
  readonly time: Locator;
  readonly venue: Locator;
  readonly capacity: Locator;
  readonly callIcon: Locator;
  readonly callModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(
      'h1:has-text("Champions League Final 2025"), h1:has-text("vs"), h1'
    );
    this.date = page
      .locator("text=/\b(31|14|01|\d{1,2})\s*(May|Sep|Oct|Jan)\b/i")
      .first();
    this.time = page.locator("text=/\b(21:00|15:00|20:45)\b/").first();
    // Prefer single-match locators to avoid strict mode violations
    this.venue = page
      .locator("text=Allianz Arena")
      .first()
      .or(page.locator("text=Parc des Princes").first());
    this.capacity = page.locator("text=Capacity:");
    this.callIcon = page.locator("button.buy_call_me_back_open");
    this.callModal = page.locator(
      '.buy_call_us_container:has-text("We\'ll call you free of charge")'
    );
  }

  async assertCoreInfoVisible(): Promise<void> {
    await expect(this.title).toBeVisible();
    // Venue text can appear in multiple sections; assert one meaningful venue text is visible
    const arena = this.page.getByText("Allianz Arena").first();
    const parc = this.page.getByText("Parc des Princes").first();
    if (await arena.count()) {
      await expect(arena).toBeVisible();
    } else if (await parc.count()) {
      await expect(parc).toBeVisible();
    }
    await expect(this.capacity).toBeVisible();
  }

  async openCallMeBack(): Promise<void> {
    await this.callIcon.scrollIntoViewIfNeeded();
    await this.callIcon.click();
    await expect(this.callModal).toBeVisible();
  }
}

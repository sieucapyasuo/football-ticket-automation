import { Locator, Page, expect } from "@playwright/test";

export class TeamPage {
  readonly page: Page;
  readonly firstEventTitle: Locator;
  readonly firstViewTickets: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstEventTitle = page
      .locator(
        'section:has-text("Upcoming Football Events") >> css=[class*=event] >> text=VS'
      )
      .first();
    this.firstViewTickets = page.locator("text=View Tickets").first();
  }

  async openFirstEvent(): Promise<void> {
    await this.firstViewTickets.scrollIntoViewIfNeeded();
    await this.firstViewTickets.click();
    await expect(this.page).toHaveURL(
      /\/(french|spanish|german|italian|champions)/i
    );
  }
}

import { Locator, Page } from "@playwright/test";

export class Footer {
  readonly page: Page;
  readonly privacyLink: Locator;
  readonly termsLink: Locator;
  readonly faqsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.privacyLink = page.locator("a[href='/privacy-policy']");
    this.termsLink = page.locator("a[href='/terms-and-conditions']");
    this.faqsLink = page.locator("a[href='/faqs']");
  }
}

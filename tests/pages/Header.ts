import { Locator, Page, expect } from "@playwright/test";

export class Header {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly currencyToggle: Locator;
  readonly currencyList: Locator;
  readonly languageToggle: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.locator("a.login_btn");
    this.currencyToggle = page.locator("#currency-select dt a");
    this.currencyList = page.locator("#currency-select dd ul");
    this.languageToggle = page.locator("#country-select dt a");
    this.breadcrumb = page
      .locator("text=Home")
      .locator(
        'xpath=ancestor::div[contains(@class, "bread")] | //nav[contains(@class,"breadcrumb")]'
      );
  }

  async openLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async openCurrency(): Promise<void> {
    await this.currencyToggle.click();
    await expect(this.currencyList).toBeVisible();
  }

  async selectCurrency(code: "EUR" | "USD" | "GBP"): Promise<void> {
    await this.openCurrency();
    await this.page.locator(`a[title='${code}']`).first().click();
  }
}

import { test as base, expect, Page } from "@playwright/test";

type Fixtures = {
  acceptCookies: () => Promise<void>;
  gotoFinalPage: () => Promise<void>;
};

export const test = base.extend<Fixtures>({
  acceptCookies: async ({ page }, use) => {
    await use(async () => {
      const accept = page.locator("button.iubenda-cs-accept-btn");
      if (await accept.count()) {
        try {
          await accept.click({ timeout: 3000 });
        } catch {}
      }
    });
  },
  gotoFinalPage: async ({ page }, use) => {
    await use(async () => {
      await page.goto("/champions-league/champions-league-final-2025", {
        waitUntil: "domcontentloaded",
      });
    });
  },
});

export { expect };

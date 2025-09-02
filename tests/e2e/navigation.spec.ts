import { test, expect } from "../fixtures/test-fixtures";
import { EventPage } from "../pages/EventPage";
import { Footer } from "../pages/Footer";
import {
  openFirstTeamFromFinal,
  openFirstEventFromTeam,
} from "../utils/dataProvider";

test.describe("Navigation & integration", () => {
  test("View All -> Team page -> open event (dynamic)", async ({
    page,
    acceptCookies,
    gotoFinalPage,
  }) => {
    await gotoFinalPage();
    await acceptCookies();
    await openFirstTeamFromFinal(page);
    await openFirstEventFromTeam(page);
    // Assert using stable event page markers
    const eventPage = new EventPage(page);
    await eventPage.assertCoreInfoVisible();
  });

  test("Footer legal links open", async ({
    page,
    acceptCookies,
    gotoFinalPage,
  }) => {
    await gotoFinalPage();
    await acceptCookies();
    // Disambiguate by role name to avoid strict violations
    // These links open in a new tab; switch to the new page context
    const [privacy] = await Promise.all([
      page.context().waitForEvent("page"),
      page.getByRole("link", { name: "Privacy Policy" }).first().click(),
    ]);
    await privacy.waitForLoadState("domcontentloaded");
    await expect(privacy).toHaveTitle(/Privacy Policy/);
    await privacy.close();

    const [terms] = await Promise.all([
      page.context().waitForEvent("page"),
      page.getByRole("link", { name: "Terms & Conditions" }).first().click(),
    ]);
    await terms.waitForLoadState("domcontentloaded");
    // Some locales render a shortened title; assert URL path instead
    await expect(terms).toHaveURL(/\/terms-and-conditions$/);
    await terms.close();

    const [faqs] = await Promise.all([
      page.context().waitForEvent("page"),
      page.getByRole("link", { name: "FAQs" }).first().click(),
    ]);
    await faqs.waitForLoadState("domcontentloaded");
    // Title may be spelled out fully
    await expect(faqs).toHaveTitle(/FAQ|Frequently Asked Questions/i);
    await faqs.close();
  });
});

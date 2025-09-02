import { test, expect } from "../fixtures/test-fixtures";
import {
  openFirstTeamFromFinal,
  openFirstEventFromTeam,
} from "../utils/dataProvider";

test.describe("Event ticket matrix basic checks", () => {
  test("Event page shows ticket filters and prices (dynamic)", async ({
    page,
    acceptCookies,
  }) => {
    // Navigate dynamically: Final page -> first team -> first event
    await page.goto("/champions-league/champions-league-final-2025");
    await acceptCookies();
    await openFirstTeamFromFinal(page);
    await openFirstEventFromTeam(page);

    // Basic smoke checks (flexible)
    const matrixHint = page.getByText(/Tickets by (Zone|Block)/i).first();
    await expect(matrixHint).toBeVisible();

    // Price presence in DOM (not necessarily in viewport)
    const priceLocator = page.getByText(/(€|£|\$)\s*\d/);
    const count = await priceLocator.count();
    expect(count).toBeGreaterThan(0);
  });
});

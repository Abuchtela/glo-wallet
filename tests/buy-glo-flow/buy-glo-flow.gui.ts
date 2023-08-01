import { test } from "@guardianui/test";
import { expect } from "@playwright/test";

import { getBaseURL } from "../utils";

test.use({
  baseURL: getBaseURL(),
});

test.describe("Buy Glo Flow", () => {
  test.beforeEach(async ({ page, gui }) => {
    const POLYGON = 137;
    await gui.initializeChain(POLYGON, 45735806);
    await page.goto("/");

    const GLO = "0x4F604735c1cF31399C6E711D5962b2B3E0225AD3";
    await gui.setBalance(GLO, "12340000000000000000000");

    const authPopupVisible = await page.isVisible(
      "text=Thanks for being part of the Glo movement"
    );
    if (!authPopupVisible) {
      await page.getByTestId("primary-login-button").click();
    }

    await page.getByTestId("tos-checkbox").check();
  });
});

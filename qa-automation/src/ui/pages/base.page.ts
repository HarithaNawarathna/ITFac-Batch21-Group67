import { Page, expect } from "@playwright/test";
import { ROUTES } from "../../config/routes.js";

/**
 * Base page representing the dashboard (post-login shell).
 * Other app pages (plants, sales, categories) can extend this.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Asserts the user has left login and is on the dashboard. */
  async expectOnDashboard(): Promise<void> {
    await expect(this.page).not.toHaveURL(new RegExp(`${ROUTES.UI_LOGIN}$`));
    await expect(this.page).toHaveURL(new RegExp(ROUTES.UI_DASHBOARD));
  }
}

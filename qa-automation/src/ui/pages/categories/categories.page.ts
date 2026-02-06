import { Page, expect } from "@playwright/test";
import { ENV } from "../../../config/env.js";
import { ROUTES } from "../../../config/routes.js";
import { BasePage } from "../base.page.js";

export class CategoriesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.goto(`${ENV.UI_BASE_URL}${ROUTES.UI_CATEGORIES}`, {
      waitUntil: "networkidle",
    });
  }

  async expectOnCategoriesPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(ROUTES.UI_CATEGORIES));
  }
}

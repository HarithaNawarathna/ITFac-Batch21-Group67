import { Page, Locator, expect } from "@playwright/test";
import { ENV } from "../../../config/env.js";
import { SalesSelectors } from "../../support/selectors.js";

export class SalesPage {
  readonly page: Page;
  readonly table: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator(SalesSelectors.table);
    this.pagination = page.locator(SalesSelectors.pagination);
  }

  async open() {
    await this.page.goto(`${ENV.UI_BASE_URL}/ui/sales`, {
      waitUntil: "networkidle"
    });
  }

  async expectTableVisible() {
    await expect(this.table).toBeVisible();
  }

  async expectPaginationVisible() {
    await expect(this.pagination).toBeVisible();
  }
}

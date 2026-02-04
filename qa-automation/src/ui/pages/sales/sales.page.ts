import { Page, Locator, expect } from "@playwright/test";
import { ENV } from "../../../config/env.js";
import { SalesSelectors } from "../../support/selectors.js";

export class SalesPage {
  readonly page: Page;
  readonly table: Locator;
  readonly pagination: Locator;
  readonly plantSelect: Locator;
  readonly quantityInput: Locator;
  readonly submitButton: Locator;
  readonly plantRequiredError: Locator;
  readonly sellPlantLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.table = page.locator(SalesSelectors.table);
    this.pagination = page.locator(SalesSelectors.pagination);

    this.plantSelect = page.locator('#plantId');
    this.quantityInput = page.locator('#quantity');
    this.submitButton = page.locator('button:has-text("Sell")');

    //  inline red error under plant select
    this.plantRequiredError = page.locator(
      'select#plantId + .text-danger'
    );

    this.sellPlantLink = page.locator(
      'a.btn.btn-primary.btn-sm.mb-3:has-text("Sell Plant")'
    );
  }

  // ---------- Navigation ----------

  async open() {
    await this.page.goto(`${ENV.UI_BASE_URL}/ui/sales`, {
      waitUntil: "networkidle"
    });
  }

  async openSellPlantPage() {
    await this.page.goto(`${ENV.UI_BASE_URL}/ui/sales/new`, {
      waitUntil: "networkidle"
    });
  }

  // ---------- Expectations ----------

  async expectTableVisible() {
    await expect(this.table).toBeVisible();
  }

  async expectPaginationVisible() {
    await expect(this.pagination).toBeVisible();
  }

  async expectSellPlantLinkVisible() {
    await expect(this.sellPlantLink).toBeVisible();
  }

  async expectSoldDateSortedDesc() {
    const dateCells = this.page.locator("table tbody tr td.sold-date");
    const count = await dateCells.count();
    const dates: Date[] = [];

    for (let i = 0; i < count; i++) {
      dates.push(new Date(await dateCells.nth(i).innerText()));
    }

    const sorted = [...dates].sort((a, b) => b.getTime() - a.getTime());
    expect(dates).toEqual(sorted);
  }

  // ---------- VALIDATION CHECKS ----------

  //  browser native validation message
  async expectQuantityAlertVisible() {
    const msg = await this.quantityInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );

    console.log("Quantity validation:", msg);
    expect(msg.length).toBeGreaterThan(0);
    expect(msg.toLowerCase()).toContain("greater");
  }

  //  inline red text error
  async expectPlantRequiredErrorVisible() {
    await expect(this.plantRequiredError).toBeVisible();
  }

  // ---------- Form Submission ----------

  async submitSellPlantForm({
    plant,
    quantity
  }: {
    plant: string;
    quantity: number;
  }) {
    if (plant) {
      await this.plantSelect.selectOption(plant);
    } else {
      await this.plantSelect.selectOption([]);
    }

    await this.quantityInput.fill(quantity.toString());
    await this.submitButton.click();
  }
}

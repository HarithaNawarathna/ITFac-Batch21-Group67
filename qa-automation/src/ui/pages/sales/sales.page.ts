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
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    this.table = page.locator(SalesSelectors.table);
    this.pagination = page.locator(SalesSelectors.pagination);

    this.plantSelect = page.locator('#plantId');
    this.quantityInput = page.locator('#quantity');
    this.submitButton = page.locator('button:has-text("Sell")');

    this.plantRequiredError = page.locator('select#plantId + .text-danger');

    this.sellPlantLink = page.locator('a.btn.btn-primary.btn-sm.mb-3:has-text("Sell Plant")');

    const firstRow = page.locator("table tbody tr").first();
    this.deleteButtons = firstRow.locator(
      [
        'button:has-text("Delete")',
        'a:has-text("Delete")',
        'button:has-text("Remove")',
        'a:has-text("Remove")',
        'button[aria-label*="delete" i]',
        'a[aria-label*="delete" i]',
        'button[title*="delete" i]',
        'a[title*="delete" i]',
        'button[data-testid*="delete" i]',
        'a[data-testid*="delete" i]',
        'button:has(i[class*="trash" i])',
        'a:has(i[class*="trash" i])',
        'button:has(i[class*="delete" i])',
        'a:has(i[class*="delete" i])',
        'button:has(svg[aria-label*="trash" i])',
        'a:has(svg[aria-label*="trash" i])',
        'button:has(svg[data-icon*="trash" i])',
        'a:has(svg[data-icon*="trash" i])',
        '.btn-danger',
        '.text-danger',
      ].join(", ")
    ).first();
  }

  // ---------- Navigation ----------

  async open() {
    await this.page.goto(`${ENV.UI_BASE_URL}/ui/sales`, { waitUntil: "networkidle" });
  }

  async openSellPlantPage() {
    await this.page.goto(`${ENV.UI_BASE_URL}/ui/sales/new`, { waitUntil: "networkidle" });
  }

  // ---------- Expectations ----------

  async expectTableVisible() {
    await expect(this.table).toBeVisible();
  }

  async expectPaginationVisible() {
    const count = await this.pagination.count();
    if (count > 0) {
      await expect(this.pagination).toBeVisible();
    } else {
      console.log("Pagination not displayed — only one page of results");
    }
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

  // ---------- Validation Checks ----------

  async expectQuantityAlertVisible() {
    const msg = await this.quantityInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );

    console.log("Quantity validation:", msg);
    expect(msg.length).toBeGreaterThan(0);
    expect(msg.toLowerCase()).toContain("greater");
  }

  async expectPlantRequiredErrorVisible() {
    await expect(this.plantRequiredError).toBeVisible();
  }

  // ---------- Form Submission ----------

  async submitSellPlantForm({ plant, quantity }: { plant: string; quantity: number }) {
    if (plant) {
      await this.plantSelect.selectOption(plant);
    } else {
      await this.plantSelect.selectOption([]);
    }

    await this.quantityInput.fill(quantity.toString());
    await this.submitButton.click();
  }

  // ---------- TC_UI_006: Select plant with stock and get initial stock ----------

  async selectPlantWithStock(): Promise<{ plantId: string; plantName: string; initialStock: number }> {
    const options = await this.plantSelect.locator('option').allTextContents();

    for (let i = 1; i < options.length; i++) {
      const optionText = options[i];
      const stockRegex = /stock:\s*(\d+)/i;
      const stockMatch = stockRegex.exec(optionText);

      if (stockMatch && Number.parseInt(stockMatch[1], 10) > 0) {
        const optionValue = await this.plantSelect.locator('option').nth(i).getAttribute('value');
        await this.plantSelect.selectOption(optionValue || '');

        const namePart = optionText.split(/stock:/i)[0];
        const plantName = namePart.replace(/[\(\-:]+$/g, "").trim() || optionText.trim();

        return {
          plantId: optionValue || '',
          plantName,
          initialStock: Number.parseInt(stockMatch[1], 10)
        };
      }
    }

    throw new Error("No plants with stock >= 1 found");
  }

  async getPlantStockByName(plantName: string): Promise<number> {
    await this.page.goto(`${ENV.UI_BASE_URL}/ui/plants`, { waitUntil: "networkidle" });

    const row = this.page.locator(`table tbody tr:has(td:has-text("${plantName}"))`).first();
    await expect(row).toBeVisible();

    const preferredStockCell = row.locator('td.stock, td.quantity, td[data-label*="stock" i]').first();
    const hasPreferred = (await preferredStockCell.count()) > 0;

    const stockCell = hasPreferred ? preferredStockCell : row.locator('td').nth(3);
    const stockText = await stockCell.innerText();

    return Number.parseInt(stockText.trim(), 10);
  }

  async expectRedirectedToSalesList() {
    await expect(this.page).toHaveURL(/\/ui\/sales/, { timeout: 10000 });
  }

  // ---------- Delete sale with confirmation ----------

  async deleteFirstSaleWithConfirm() {
    const rows = this.page.locator("table tbody tr");
    const rowsBefore = await rows.count();
    console.log("Rows before delete:", rowsBefore);

    if (rowsBefore === 0) {
      throw new Error("No rows found in sales table to delete");
    }

    await expect(this.deleteButtons).toBeVisible({ timeout: 10000 });

    this.page.once("dialog", async dialog => {
      console.log("Confirm dialog message:", dialog.message());
      await dialog.accept();
      console.log("Sale deleted successfully");
    });

    await this.deleteButtons.click();

    await expect(rows).toHaveCount(rowsBefore - 1, { timeout: 10000 });
  }
}

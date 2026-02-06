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
    // Wait for the select to be ready
    await this.plantSelect.waitFor({ state: "visible" });
    await this.page.waitForLoadState("networkidle");

    const options = await this.plantSelect.locator("option").all();
    console.log(`Total options found: ${options.length}`);

    for (let i = 1; i < options.length; i++) {
      const optionElement = options[i];
      const optionText = await optionElement.innerText();
      const optionValue = await optionElement.getAttribute("value");

      console.log(`Option ${i}: "${optionText}" (value: ${optionValue})`);

      const stockPatterns = [
        /stock:\s*(\d+)/i,
        /\(stock:\s*(\d+)\)/i,
        /stock\s*=\s*(\d+)/i,
        /\[\s*(\d+)\s*\]/,
        /qty:\s*(\d+)/i,
        /quantity:\s*(\d+)/i,
      ];

      let stockFound = 0;
      for (const pattern of stockPatterns) {
        const match = pattern.exec(optionText);
        if (match && match[1]) {
          stockFound = Number.parseInt(match[1], 10);
          console.log(`  → Stock matched: ${stockFound}`);
          break;
        }
      }

      if (stockFound > 0) {
        const plantName = optionText
          // remove any parenthetical that contains stock/qty/quantity info
          .replace(/\([^)]*(stock|qty|quantity)\s*[:=]\s*\d+[^)]*\)/gi, "")
          // remove inline stock/qty/quantity fragments (if not parenthesized)
          .replace(/\b(stock|qty|quantity)\s*[:=]\s*\d+\b/gi, "")
          // remove bracketed counts like [123]
          .replace(/\[\s*\d+\s*\]/g, "")
          // remove leftover empty parentheses from prior replacements
          .replace(/\(\s*\)/g, "")
          // normalize whitespace
          .replace(/\s{2,}/g, " ")
          .trim();

        console.log(`Selected plant: "${plantName}" with stock ${stockFound}`);

        await this.plantSelect.selectOption(optionValue || "");

        return {
          plantId: optionValue || "",
          plantName,
          initialStock: stockFound,
        };
      }
    }

    console.error("Available options:", await this.plantSelect.locator("option").allInnerTexts());
    throw new Error("No plants with stock >= 1 found");
  }

  async getPlantStockByName(plantName: string): Promise<number> {
    await this.page.goto(`${ENV.UI_BASE_URL}/ui/plants`, { waitUntil: "networkidle" });

    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Prefer exact-ish match (case-insensitive), then fall back to contains
    const exactName = new RegExp(`^\\s*${escapeRegex(plantName)}\\s*$`, "i");
    const containsName = new RegExp(escapeRegex(plantName), "i");

    let row = this.page
      .locator("table tbody tr")
      .filter({ has: this.page.locator("td", { hasText: exactName }) })
      .first();

    if ((await row.count()) === 0) {
      row = this.page
        .locator("table tbody tr")
        .filter({ has: this.page.locator("td", { hasText: containsName }) })
        .first();
    }

    await expect(row).toBeVisible({ timeout: 10000 });

    const preferredStockCell = row.locator("td.stock, td.quantity, td[data-label*='stock' i]").first();
    const hasPreferred = (await preferredStockCell.count()) > 0;

    const stockCell = hasPreferred ? preferredStockCell : row.locator("td").nth(3);
    const stockText = await stockCell.innerText();

    return Number.parseInt(stockText.trim(), 10);
  }

  async expectRedirectedToSalesList() {
    await expect(this.page).toHaveURL(/\/ui\/sales/, { timeout: 10000 });
  }

  // ---------- Delete sale with confirmation ----------

  async deleteFirstSaleWithConfirm(): Promise<{ soldAt: string }> {
    const firstRow = this.page.locator("table tbody tr").first();
    await expect(firstRow).toBeVisible({ timeout: 10000 });

    // Capture a unique identifier for the row (Sold At column)
    const soldAt = (await firstRow.locator("td:nth-child(4)").innerText()).trim();
    console.log("Deleting sale with Sold At:", soldAt);

    await expect(this.deleteButtons).toBeVisible({ timeout: 10000 });

    this.page.once("dialog", async (dialog) => {
      console.log("Confirm dialog message:", dialog.message());
      await dialog.accept();
    });

    await this.deleteButtons.click();

    // Wait for success UI (toast/alert) and verify the deleted row is gone
    await this.expectDeleteSuccessMessageVisible();
    await this.expectSaleNotPresentBySoldAt(soldAt);

    return { soldAt };
  }

  async expectDeleteSuccessMessageVisible() {
    const successMsg = this.page
      .locator(".alert-success, [role='alert'], .toast, .toast-body")
      .filter({ hasText: /deleted successfully/i })
      .first();

    await expect(successMsg).toBeVisible({ timeout: 10000 });
  }

  async expectSaleNotPresentBySoldAt(soldAt: string) {
    // Sold At is 4th column in your screenshot/table
    const soldAtCells = this.page.locator("table tbody tr td:nth-child(4)").filter({ hasText: soldAt });
    await expect(soldAtCells).toHaveCount(0, { timeout: 10000 });
  }

  // ---------- TC_UI_009: Column Sorting ----------

  async clickPlantColumnHeader() {
    // Plant column is 1st column in your current checks
    await this.clickSortableHeader("Plant", 1);
  }

  async expectSortedByPlantName() {
    const cleaned = await this.getSalesColumnTexts(1);

    const sortedAsc = [...cleaned].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    const sortedDesc = [...cleaned].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: "base" }));

    const isSorted =
      JSON.stringify(cleaned) === JSON.stringify(sortedAsc) ||
      JSON.stringify(cleaned) === JSON.stringify(sortedDesc);

    expect(isSorted).toBe(true);
  }

  async clickQuantityColumnHeader() {
    // Quantity column is 2nd column
    await this.clickSortableHeader("Quantity", 2);
  }

  async expectSortedByQuantity() {
    const quantityTexts = await this.getSalesColumnTexts(2);
    const quantities = quantityTexts.map(q => Number.parseInt(q, 10));

    const sortedAsc = [...quantities].sort((a, b) => a - b);
    const sortedDesc = [...quantities].sort((a, b) => b - a);

    const isSorted =
      JSON.stringify(quantities) === JSON.stringify(sortedAsc) ||
      JSON.stringify(quantities) === JSON.stringify(sortedDesc);

    expect(isSorted).toBe(true);
  }

  async clickTotalPriceColumnHeader() {
    // Total Price column is 3rd column (since Sold At is 4th in your delete method)
    await this.clickSortableHeader("Total Price", 3);
  }

  async expectSortedByTotalPrice() {
    const priceTexts = await this.getSalesColumnTexts(3);
    const prices = priceTexts.map(p => Number.parseFloat(p.replace(/[^0-9.]/g, "")));

    const sortedAsc = [...prices].sort((a, b) => a - b);
    const sortedDesc = [...prices].sort((a, b) => b - a);

    const isSorted =
      JSON.stringify(prices) === JSON.stringify(sortedAsc) ||
      JSON.stringify(prices) === JSON.stringify(sortedDesc);

    expect(isSorted).toBe(true);
  }

  // ---------- TC_UI_010: Permission Checks ----------

  async expectSellPlantLinkNotVisible() {
    await expect(this.sellPlantLink).not.toBeVisible();
  }

  async expectNoDeleteActionsVisible() {
    const deleteButtons = this.page.locator('button:has-text("Delete"), a:has-text("Delete"), button[aria-label*="delete" i], .btn-danger');
    await expect(deleteButtons).toHaveCount(0);
  }

  // ---------- Small helpers for sorting tests ----------
  private async getSalesColumnTexts(colIndex1Based: number): Promise<string[]> {
    const cells = this.page.locator(`table tbody tr td:nth-child(${colIndex1Based})`);
    const texts = await cells.allInnerTexts();
    return texts.map(t => t.trim());
  }

  private async clickSortableHeader(headerText: string, colIndex1Based: number): Promise<void> {
    const header = this.page.locator("table thead th").filter({ hasText: new RegExp(`^\\s*${headerText}\\s*$`, "i") }).first();
    await expect(header).toBeVisible({ timeout: 10000 });

    const before = (await this.getSalesColumnTexts(colIndex1Based)).join("|");

    // Prefer clicking a link/button inside the header 
    const interactive = header.locator("a, button").first();
    if ((await interactive.count()) > 0) {
      await interactive.click();
    } else {
      await header.click();
    }

    // Wait for actual table change 
    await expect
      .poll(async () => (await this.getSalesColumnTexts(colIndex1Based)).join("|"), { timeout: 10000 })
      .not.toBe(before);
  }
}

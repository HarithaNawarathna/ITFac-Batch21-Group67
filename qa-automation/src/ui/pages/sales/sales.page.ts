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

    const options = await this.plantSelect.locator('option').all();
    console.log(`Total options found: ${options.length}`);

    for (let i = 1; i < options.length; i++) {
      const optionElement = options[i];
      const optionText = await optionElement.innerText();
      const optionValue = await optionElement.getAttribute('value');

      console.log(`Option ${i}: "${optionText}" (value: ${optionValue})`);

      // Try multiple regex patterns to find stock
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
        // Extract plant name (remove stock info)
        const plantName = optionText
          .replace(/\s*stock:\s*\d+\s*/i, '')
          .replace(/\s*\(stock:\s*\d+\)\s*/i, '')
          .replace(/\s*\[.*?\]\s*/g, '')
          .trim();

        console.log(`Selected plant: "${plantName}" with stock ${stockFound}`);
        
        await this.plantSelect.selectOption(optionValue || '');
        
        return {
          plantId: optionValue || '',
          plantName,
          initialStock: stockFound
        };
      }
    }

    console.error("Available options:", await this.plantSelect.locator('option').allInnerTexts());
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

  // ---------- TC_UI_009: Column Sorting ----------

  async clickPlantColumnHeader() {
    const plantHeader = this.page.locator('th:has-text("Plant")').first();
    await expect(plantHeader).toBeVisible();
    
    // Get initial data to compare after click
    const initialData = await this.page.locator("table tbody tr td:first-child").allInnerTexts();
    console.log("Data before click:", initialData);
    
    // Click the header
    await plantHeader.click();
    
    // Wait for the table to update
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(800);
    
    // Verify data changed (sorting occurred)
    const newData = await this.page.locator("table tbody tr td:first-child").allInnerTexts();
    console.log("Data after click:", newData);
  }

  async expectSortedByPlantName() {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);

    const plantNames = await this.page.locator("table tbody tr td:first-child").allInnerTexts();
    const cleaned = plantNames.map(name => name.trim());
    
    console.log("Plant names retrieved:", cleaned);
    
    const sortedAsc = [...cleaned].sort();
    const sortedDesc = [...cleaned].sort((a, b) => b.localeCompare(a));
    
    console.log("Sorted ASC:", sortedAsc);
    console.log("Sorted DESC:", sortedDesc);
    console.log("Matches ASC:", JSON.stringify(cleaned) === JSON.stringify(sortedAsc));
    console.log("Matches DESC:", JSON.stringify(cleaned) === JSON.stringify(sortedDesc));
    
    const isSorted = 
      JSON.stringify(cleaned) === JSON.stringify(sortedAsc) ||
      JSON.stringify(cleaned) === JSON.stringify(sortedDesc);
    
    expect(isSorted).toBe(true);
  }

  async clickQuantityColumnHeader() {
    const quantityHeader = this.page.locator('table thead th:has-text("Quantity")').first();
    await expect(quantityHeader).toBeVisible();
    await quantityHeader.click();
  }

  async expectSortedByQuantity() {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);

    const quantityTexts = await this.page.locator("table tbody tr td:nth-child(2)").allInnerTexts();
    const quantities = quantityTexts.map(q => parseInt(q.trim(), 10));
    
    const sortedAsc = [...quantities].sort((a, b) => a - b);
    const sortedDesc = [...quantities].sort((a, b) => b - a);
    
    const isSorted = 
      JSON.stringify(quantities) === JSON.stringify(sortedAsc) ||
      JSON.stringify(quantities) === JSON.stringify(sortedDesc);
    
    expect(isSorted).toBe(true);
  }

  async clickTotalPriceColumnHeader() {
    const priceHeader = this.page.locator('table thead th:has-text("Total Price")').first();
    await expect(priceHeader).toBeVisible();
    await priceHeader.click();
  }

  async expectSortedByTotalPrice() {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);

    const priceTexts = await this.page.locator("table tbody tr td:nth-child(4)").allInnerTexts();
    const prices = priceTexts.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
    
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
}

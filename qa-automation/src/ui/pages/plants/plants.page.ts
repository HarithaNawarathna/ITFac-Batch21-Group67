import { Page, Locator, expect } from "@playwright/test";
import { ENV } from "../../../config/env.js";
import { ROUTES } from "../../../config/routes.js";
import { BasePage } from "../base.page.js";

export class PlantsPage extends BasePage {
  readonly plantsTable: Locator;
  readonly tableHeader: Locator;
  readonly tableBody: Locator;
  readonly plantRows: Locator;
  
  readonly headerName: Locator;
  readonly headerCategory: Locator;
  readonly headerPrice: Locator;
  readonly headerQuantity: Locator;
  readonly headerActions: Locator;

  readonly addPlantButton: Locator;

  constructor(page: Page) {
    super(page);
    
    this.plantsTable = page.locator('table.table.table-striped.table-bordered');
    this.tableHeader = page.locator('thead.table-dark');
    this.tableBody = page.locator('tbody');
    this.plantRows = page.locator('tbody tr');
    
    this.headerName = page.locator('th:has-text("Name")');
    this.headerCategory = page.locator('th:has-text("Category")');
    this.headerPrice = page.locator('th:has-text("Price")');
    this.headerQuantity = page.locator('th:has-text("Stock")');
    this.headerActions = page.locator('th:has-text("Actions")');

    this.addPlantButton = page.locator('a[href="/ui/plants/add"]');
  }

  async open(): Promise<void> {
    await this.page.goto(`${ENV.UI_BASE_URL}${ROUTES.UI_PLANTS}`, {
      waitUntil: "networkidle",
    });
  }//

  async expectOnPlantsPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(ROUTES.UI_PLANTS));
  }//

  async clickAddPlantButton(): Promise<void> {
    await expect(this.addPlantButton).toBeVisible();
    await this.addPlantButton.click();
  }//

  async expectPlantListDisplayed(): Promise<void> {
    await expect(this.plantsTable).toBeVisible();
    await expect(this.tableHeader).toBeVisible();
    await expect(this.tableBody).toBeVisible();
  } //

  async expectPlantsVisibleWithDetails(): Promise<void> {
    await expect(this.plantRows.first()).toBeVisible({ timeout: 10000 });
    
    const rowCount = await this.plantRows.count();
    expect(rowCount).toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      const cells = this.plantRows.nth(i).locator('td');
      
      for (let j = 0; j < 4; j++) {
        const text = await cells.nth(j).textContent();
        expect(text?.trim()).toBeTruthy();
      }
    }
  }//

  async expectCorrectTableHeaders(): Promise<void> {
    await expect(this.headerName).toBeVisible();
    await expect(this.headerCategory).toBeVisible();
    await expect(this.headerPrice).toBeVisible();
    await expect(this.headerQuantity).toBeVisible();
    await expect(this.headerActions).toBeVisible();
  }//

  async expectPlantExistsInList(plantName: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await expect(this.plantsTable).toBeVisible({ timeout: 10000 });

    const plantRow = this.page.locator(`tbody tr:has-text("${plantName}")`);
    await expect(plantRow).toBeVisible({ timeout: 10000 });
  }//

  async clickEditButtonForFirstPlant(): Promise<string> {
    const firstRow = this.plantRows.first();
    await expect(firstRow).toBeVisible();
    
    const nameCell = firstRow.locator('td').first();
    const plantName = (await nameCell.textContent())?.trim() || '';

    const editButton = firstRow.locator('a[title="Edit"]');
    await expect(editButton).toBeVisible();
    await editButton.click();

    return plantName;
  }//

  async selectFirstPlantForDeletion(): Promise<string> {
  const firstRow = this.plantRows.first();
  await expect(firstRow).toBeVisible();

    const plantName = (await firstRow.locator("td").first().innerText()).trim();
    const deleteBtn = firstRow.locator('a[title="Delete"], button[title="Delete"]');
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();
    return plantName;
  }//

  async expectAddPlantButtonNotVisible(): Promise<void> {
    await expect(this.addPlantButton).not.toBeVisible();
  }//

  async expectEditButtonsNotVisible(): Promise<void> {
    const editButtons = this.page.locator('tbody a[title="Edit"]');
    await expect(editButtons).toHaveCount(0);
  }//

  async expectDeleteButtonsNotVisible(): Promise<void> {
    const deleteButtons = this.page.locator('tbody button[title="Delete"]');
    await expect(deleteButtons).toHaveCount(0);
  }//
}
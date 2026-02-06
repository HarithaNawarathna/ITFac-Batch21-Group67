import { Page, Locator, expect } from "@playwright/test";
import { ENV } from "../../../config/env.js";
import { ROUTES } from "../../../config/routes.js";
import { BasePage } from "../base.page.js";

export class AddPlantPage extends BasePage {
  readonly nameInput: Locator;
  readonly categorySelect: Locator;
  readonly priceInput: Locator;
  readonly quantityInput: Locator;
  readonly saveButton: Locator;
  readonly successAlert: Locator;
  readonly errorAlert: Locator;
  
  // Optional: Other elements
  readonly cancelButton: Locator;
  readonly formTitle: Locator;

  constructor(page: Page) {
    super(page);
    
    this.nameInput = page.locator('input[name="name"]');
    this.categorySelect = page.locator('select[name="categoryId"]');
    this.priceInput = page.locator('input[name="price"]');
    this.quantityInput = page.locator('input[name="quantity"]');
    this.saveButton = page.locator('button:has-text("Save")');
    
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.formTitle = page.locator('h3:has-text("Add Plant")');

    this.successAlert = page.locator('.alert-success, .toast-success, [role="alert"]', {hasText: /success/i});   
    this.errorAlert = page.locator('.alert-danger, .toast-error, [role="alert"]:has-text("error")');
  }

  async open(): Promise<void> {
    await this.page.goto(`${ENV.UI_BASE_URL}${ROUTES.UI_PLANTS_ADD}`, {
      waitUntil: "networkidle",
    });
  }

  async expectOnAddPlantPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(ROUTES.UI_PLANTS_ADD));
  }//

  async expectRequiredFieldsVisible(): Promise<void> {
    await expect(this.nameInput).toBeVisible();
    await expect(this.categorySelect).toBeVisible();
    await expect(this.priceInput).toBeVisible();
    await expect(this.quantityInput).toBeVisible();
  }//

  async expectSaveButtonVisible(): Promise<void> {
    await expect(this.saveButton).toBeVisible();
  }//

  async fillPlantForm(data: {
    name: string;
    category: string;
    price: string;
    quantity: string;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.categorySelect.selectOption({ label: data.category });
    await this.priceInput.fill(data.price);
    await this.quantityInput.fill(data.quantity);
  }//

  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }//

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectSuccessMessage(): Promise<void> {
    // Wait for page to settle after save
    await this.page.waitForLoadState('networkidle');

    // Try to find an on-page success alert (quick check)
    const alertVisible = await this.successAlert.isVisible().catch(() => false);
    if (alertVisible) {
      return;
    }

    // If no alert, confirm redirect to plants list as success signal
    await expect(this.page).toHaveURL(new RegExp(ROUTES.UI_PLANTS), { timeout: 10000 });
  }//

  async expectRedirectedToPlantsList(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(ROUTES.UI_PLANTS), { timeout: 10000 });
  }
}
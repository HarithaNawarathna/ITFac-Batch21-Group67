import { Page, Locator, expect } from "@playwright/test";
import { ENV } from "../../../config/env.js";
import { ROUTES } from "../../../config/routes.js";
import { BasePage } from "../base.page.js";

export class EditPlantPage extends BasePage {
  // Form input fields
  readonly nameInput: Locator;
  readonly categorySelect: Locator;
  readonly priceInput: Locator;
  readonly quantityInput: Locator;
  readonly saveButton: Locator;
  
  // Success/Error messages
  readonly successAlert: Locator;
  readonly errorAlert: Locator;
  
  // Optional
  readonly cancelButton: Locator;
  readonly formTitle: Locator;

  constructor(page: Page) {
    super(page);
    
    // UPDATE THESE SELECTORS based on your actual HTML
    this.nameInput = page.locator('input[name="name"]');
    this.categorySelect = page.locator('select[name="categoryId"]');
    this.priceInput = page.locator('input[name="price"]');
    this.quantityInput = page.locator('input[name="quantity"]');
    
    this.saveButton = page.locator('button:has-text("Save")');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    
    this.formTitle = page.locator('h3:has-text("Edit Plant")');
    
    this.successAlert = page.locator('.alert-success, .toast-success, [role="alert"]');
    this.errorAlert = page.locator('.alert-danger, .toast-error, [role="alert"]:has-text("error")');
  }

  async expectOnEditPlantPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/ui\/plants\/edit\/\d+/);
  }//

  /**
   * Get current form values
   */
  async getCurrentFormValues(): Promise<{
    name: string;
    category: string;
    price: string;
    quantity: string;
  }> {
    return {
      name: await this.nameInput.inputValue(),
      category: await this.categorySelect.inputValue(),
      price: await this.priceInput.inputValue(),
      quantity: await this.quantityInput.inputValue(),
    };
  }

  async updatePlantForm(data: {
    name: string;
    category: string;
    price: string;
    quantity: string;
  }): Promise<void> {
    await this.nameInput.clear();
    await this.nameInput.fill(data.name);
    await this.categorySelect.selectOption(data.category);
    
    await this.priceInput.clear();
    await this.priceInput.fill(data.price);
    
    await this.quantityInput.clear();
    await this.quantityInput.fill(data.quantity);
  }//

  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }//

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
  }
}
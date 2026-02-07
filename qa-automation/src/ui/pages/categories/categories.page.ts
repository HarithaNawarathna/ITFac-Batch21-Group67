import { Page, expect } from "@playwright/test";
import { ENV } from "../../../config/env.js";
import { ROUTES } from "../../../config/routes.js";
import { BasePage } from "../base.page.js";
import { CategorySelectors } from "../../support/selectors.js";

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

  async isAddCategoryButtonVisible(): Promise<boolean> {
    const btn = this.page.locator(CategorySelectors.addCategoryButton).first();
    return btn.isVisible();
  }

  async isAddCategoryButtonEnabled(): Promise<boolean> {
    const btn = this.page.locator(CategorySelectors.addCategoryButton).first();
    return btn.isEnabled();
  }

  async clickAddCategory(): Promise<void> {
    await this.page.locator(CategorySelectors.addCategoryButton).first().click();
  }

  async setCategoryName(name: string): Promise<void> {
    await this.page.locator(CategorySelectors.categoryNameInput).fill(name);
  }

  async clickSaveCategory(): Promise<void> {
    await this.page.locator(CategorySelectors.saveCategoryButton).first().click();
  }

  async expectSuccessMessage(): Promise<void> {
    const listUrl = /\/ui\/categories(\?|$)/;
    const successLocator = this.page
      .locator(CategorySelectors.successMessage)
      .first();
    await Promise.race([
      this.page.waitForURL(listUrl, { timeout: 10_000 }),
      successLocator.waitFor({ state: "visible", timeout: 10_000 }),
    ]);
  }

  async expectNameRequiredValidation(): Promise<void> {
    await expect(
      this.page.locator(CategorySelectors.nameRequiredError)
    ).toBeVisible();
  }

  async clickEditFirstCategory(): Promise<void> {
    await this.page.locator(CategorySelectors.firstEditButton).first().click();
  }

  async clearCategoryName(): Promise<void> {
    await this.page.locator(CategorySelectors.categoryNameInput).clear();
  }

  async clickDeleteFirstCategory(): Promise<void> {
    this.page.once("dialog", (dialog) => dialog.accept());
    await this.page.locator(CategorySelectors.firstDeleteButton).first().click();
  }

  async clickReset(): Promise<void> {
    await this.page.locator(CategorySelectors.resetLink).first().click();
  }

  async setSearchFilter(searchText: string): Promise<void> {
    await this.page.locator(CategorySelectors.searchCategoryInput).fill(searchText);
    await this.page.locator(CategorySelectors.searchButton).first().click();
  }

  async expectCategoryListDisplayed(): Promise<void> {
    await expect(this.page.locator(CategorySelectors.categoriesTable)).toBeVisible();
  }

  async expectEditOptionHiddenOrDisabled(): Promise<void> {
    const editLink = this.page.locator(CategorySelectors.editButton).first();
    await expect(editLink).toBeDisabled();
  }

  async expectDeleteOptionHiddenOrDisabled(): Promise<void> {
    const deleteBtn = this.page.locator(CategorySelectors.deleteButton).first();
    await expect(deleteBtn).toBeDisabled();
  }

  async goToAddCategoryDirect(): Promise<void> {
    await this.page.goto(`${ENV.UI_BASE_URL}/ui/categories/add`, {
      waitUntil: "networkidle",
    });
  }

  async expect403OrAccessDenied(): Promise<void> {
    const url = this.page.url();
    const body = (await this.page.locator("body").textContent()) ?? "";
    const has403 =
      /403|access.?denied|forbidden/i.test(url) ||
      /403|access denied|forbidden/i.test(body);
    expect(has403).toBe(true);
  }
  async clickDeleteCategoryByName(name: string): Promise<void> {
    this.page.once("dialog", (dialog) => dialog.accept());
    // Finds the row containing the text 'name', then finds the delete button within that row
    await this.page
      .locator(`tr:has-text("${name}")`)
      .locator(CategorySelectors.deleteButton)
      .click();
  }

  async expectDependencyError(): Promise<void> {
    // Adjust selector to match your specific error toast/alert
    const errorLocator = this.page.locator(".alert-danger, .toast-error").first(); 
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText(/cannot delete|dependency|assigned/i);
  }
}


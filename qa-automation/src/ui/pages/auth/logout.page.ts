import { Page, Locator, expect } from "@playwright/test";
import { ENV } from "../../../config/env.js";
import { LoginSelectors, LogoutSelectors } from "../../support/selectors.js";

export class LogoutPage {
  readonly page: Page;

  readonly logoutButton: Locator;
  readonly alert: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logoutButton = page.locator(LogoutSelectors.logoutButton);
    this.alert = page.locator(LoginSelectors.alert);
  }

  async logout() {
    await this.logoutButton.click();
  }

  async expectRedirectedToLogin() {
    await expect(this.page).toHaveURL(/\/ui\/login$/);
  }

  async expectSuccessMessage(text: string) {
    await expect(this.alert.first()).toBeVisible();
    await expect(this.alert.first()).toContainText(text);
  }

  async expectLogoutButtonVisible() {
    await expect(this.logoutButton).toBeVisible();
  }

  async expectLogoutButtonEnabled() {
    await expect(this.logoutButton).toBeEnabled();
  }

  async expectLogoutButtonText(text: string) {
    await expect(this.logoutButton).toHaveText(text);
  }
}

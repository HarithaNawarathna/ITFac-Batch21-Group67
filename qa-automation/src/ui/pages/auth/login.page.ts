import { Page, Locator, expect } from "@playwright/test";
import { ENV } from "../../../config/env.js";
import { LoginSelectors } from "../../support/selectors.js";

export class LoginPage {
  readonly page: Page;

  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly alert: Locator;

  constructor(page: Page) {
    this.page = page;

    this.username = page.locator(LoginSelectors.usernameInput);
    this.password = page.locator(LoginSelectors.passwordInput);
    this.loginButton = page.locator(LoginSelectors.loginButton);

    this.usernameError = page.locator(LoginSelectors.usernameError);
    this.passwordError = page.locator(LoginSelectors.passwordError);

    this.alert = page.locator(LoginSelectors.alert);
  }

  async open() {
    await this.page.goto(`${ENV.UI_BASE_URL}/ui/login`, {
      waitUntil: "networkidle"
    });
    await expect(this.page).toHaveURL(/\/ui\/login$/);
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async expectUsernameError(message: string) {
    await expect(this.usernameError).toBeVisible();
    await expect(this.usernameError).toHaveText(message);
  }

  async expectPasswordError(message: string) {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toHaveText(message);
  }

  async expectSuccessAlert(text: string) {
    await expect(this.alert.first()).toBeVisible();
    await expect(this.alert.first()).toContainText(text);
  }

  async expectRedirectedFromLogin() {
    await expect(this.page).not.toHaveURL(/\/ui\/login/);
  }

  async expectGlobalErrorMessage(message: string) {
    await expect(this.alert).toBeVisible();
    await expect(this.alert.first()).toContainText(message);
  }

  async expectLoginButtonVisible() {
    await expect(this.loginButton).toBeVisible();
  }

  async expectLoginButtonEnabled() {
    await expect(this.loginButton).toBeEnabled();
  }

  async expectLoginButtonText(text: string) {
    await expect(this.loginButton).toHaveText(text);
  }

  async expectErrorAlert(message: string) {
    await expect(this.alert).toBeVisible();
    await expect(this.alert.first()).toContainText(message);
  }
}

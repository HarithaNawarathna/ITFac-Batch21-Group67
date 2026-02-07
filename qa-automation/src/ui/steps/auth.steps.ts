import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { UIWorld } from "../support/world.js";
import { LoginPage } from "../pages/auth/login.page.js";
import { LogoutPage } from "../pages/auth/logout.page.js";
import { BasePage } from "../pages/base.page.js";
import { ENV } from "../../config/env.js";

Given("I am on the login page", async function (this: UIWorld) {
  const login = new LoginPage(this.page);
  await login.open();
  this.state.loginPage = login;
});

Given("I am logged in as admin", async function (this: UIWorld) {
  const login = new LoginPage(this.page);
  await login.open();
  this.state.loginPage = login;
  const creds = ENV.USERS.admin;
  await login.login(creds.username, creds.password);
  const dashboard = new BasePage(this.page);
  await dashboard.expectOnDashboard();
});

Given("I am logged in as user", async function (this: UIWorld) {
  const login = new LoginPage(this.page);
  await login.open();
  this.state.loginPage = login;
  const creds = ENV.USERS.user;
  await login.login(creds.username, creds.password);
  const dashboard = new BasePage(this.page);
  await dashboard.expectOnDashboard();
});

When(
  "I login as {string}",
  async function (this: UIWorld, role: "admin" | "user") {
    const login = this.state.loginPage!;
    const creds = ENV.USERS[role];
    await login.login(creds.username, creds.password);
  }
);

When(
  "I submit login with empty username",
  async function (this: UIWorld) {
    const login = this.state.loginPage!;
    await login.login("", "dummy");
  }
);

When(
  "I submit login with empty password",
  async function (this: UIWorld) {
    const login = this.state.loginPage!;
    await login.login("dummy", "");
  }
);

When(
  "I login with invalid username or invalid password",
  async function (this: UIWorld) {
    const login = this.state.loginPage!;
    await login.login("invaliduser", "invalidpassword");
  }
);

Then(
  "I should see username validation message {string}",
  async function (this: UIWorld, message: string) {
    const login = this.state.loginPage!;
    await login.expectUsernameError(message);
  }
);

Then(
  "I should see password validation message {string}",
  async function (this: UIWorld, message: string) {
    const login = this.state.loginPage!;
    await login.expectPasswordError(message);
  }
);

Then(
  "I should be redirected away from login page",
  async function (this: UIWorld) {
    await expect(this.page).not.toHaveURL(/\/login/);
  }
);

Then("I should be on the dashboard", async function (this: UIWorld) {
  const dashboard = new BasePage(this.page);
  await dashboard.expectOnDashboard();
});

Then(
  "I should see a global error message {string}",
  async function (this: UIWorld, message: string) {
    const login = this.state.loginPage!;
    await login.expectGlobalErrorMessage(message);
  }
);

Then(
  "the login button should be visible",
  async function (this: UIWorld) {
    const login = this.state.loginPage!;
    await login.expectLoginButtonVisible();
  }
);

Then(
  "the login button should be enabled",
  async function (this: UIWorld) {
    const login = this.state.loginPage!;
    await login.expectLoginButtonEnabled();
  }
);

Then(
  "the login button should have text {string}",
  async function (this: UIWorld, text: string) {
    const login = this.state.loginPage!;
    await login.expectLoginButtonText(text);
  }
);

Then(
  "I should see an error alert with message {string}",
  async function (this: UIWorld, message: string) {
    const login = this.state.loginPage!;
    await login.expectErrorAlert(message);
  }
);

When(
  "I logout as {string}",
  async function (this: UIWorld, role: "admin" | "user") {
    const logout = new LogoutPage(this.page);
    await logout.logout();
  }
);

Then(
  "I should be redirect to login page",
  async function (this: UIWorld) {
    const logout = new LogoutPage(this.page);
    await logout.expectRedirectedToLogin();
  }
);

Then(
  "I should see success Message as {string}",
  async function (this: UIWorld, message: string) {
    const logout = new LogoutPage(this.page);
    await logout.expectSuccessMessage(message);
  }
);

Then(
  "the logout button should be visible",
  async function (this: UIWorld) {
    const logout = new LogoutPage(this.page);
    await logout.expectLogoutButtonVisible();
  }
);

Then(
  "the logout button should be enabled",
  async function (this: UIWorld) {
    const logout = new LogoutPage(this.page);
    await logout.expectLogoutButtonEnabled();
  }
);

Then(
  "the logout button should have text {string}",
  async function (this: UIWorld, text: string) {
    const logout = new LogoutPage(this.page);
    await logout.expectLogoutButtonText(text);
  }
);


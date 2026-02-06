import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { UIWorld } from "../support/world.js";
import { LoginPage } from "../pages/auth/login.page.js";
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

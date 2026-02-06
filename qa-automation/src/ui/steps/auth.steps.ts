import { Given, When, Then } from "@cucumber/cucumber";
import { UIWorld } from "../support/world.js";
import { BasePage } from "../pages/base.page.js";
import { LoginPage } from "../pages/auth/login.page.js";
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
    const login: LoginPage = this.state.loginPage;
    const creds = ENV.USERS[role];
    await login.login(creds.username, creds.password);
  }
);

When(
  "I submit login with empty username",
  async function (this: UIWorld) {
    const login: LoginPage = this.state.loginPage;
    await login.login("", "dummy");
  }
);

When(
  "I submit login with empty password",
  async function (this: UIWorld) {
    const login: LoginPage = this.state.loginPage;
    await login.login("dummy", "");
  }
);

When(
  "I login with invalid username or invalid password",
  async function (this: UIWorld) {
    const login: LoginPage = this.state.loginPage;
    await login.login("invaliduser", "invalidpassword");
  }
);

Then(
  "I should see username validation message {string}",
  async function (this: UIWorld, message: string) {
    const login: LoginPage = this.state.loginPage;
    await login.expectUsernameError(message);
  }
);

Then(
  "I should see password validation message {string}",
  async function (this: UIWorld, message: string) {
    const login: LoginPage = this.state.loginPage;
    await login.expectPasswordError(message);
  }
);

Then(
  "I should be redirected away from login page",
  async function (this: UIWorld) {
    const login: LoginPage = this.state.loginPage;
    await login.expectRedirectedFromLogin();
  }
);

Then("I should be on the dashboard", async function (this: UIWorld) {
  const dashboard = new BasePage(this.page);
  await dashboard.expectOnDashboard();
});

Then(
  "I should see a global error message {string}",
  async function (this: UIWorld, message: string) {
    const login: LoginPage = this.state.loginPage;
    await login.expectGlobalErrorMessage(message);
  }
);

Then(
  "the login button should be visible",
  async function (this: UIWorld) {
    const login: LoginPage = this.state.loginPage;
    await login.expectLoginButtonVisible();
  }
);

Then(
  "the login button should be enabled",
  async function (this: UIWorld) {
    const login: LoginPage = this.state.loginPage;
    await login.expectLoginButtonEnabled();
  }
);

Then(
  "the login button should have text {string}",
  async function (this: UIWorld, text: string) {
    const login: LoginPage = this.state.loginPage;
    await login.expectLoginButtonText(text);
  }
);

Then(
  "I should see an error alert with message {string}",
  async function (this: UIWorld, message: string) {
    const login: LoginPage = this.state.loginPage;
    await login.expectErrorAlert(message);
  }
);

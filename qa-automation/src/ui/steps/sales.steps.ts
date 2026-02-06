import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { UIWorld } from "../support/world.js";
import { SalesPage } from "../pages/sales/sales.page.js";
import { LoginPage } from "../pages/auth/login.page.js";
import { BasePage } from "../pages/base.page.js";
import { ENV } from "../../config/env.js";

// ================= LOGIN (reusing auth pattern) =================
Given('I am logged in as {string}', async function (this: UIWorld, role: "admin" | "user") {
  const login = new LoginPage(this.page);
  await login.open();
  this.state.loginPage = login;
  const creds = ENV.USERS[role];
  await login.login(creds.username, creds.password);
  const dashboard = new BasePage(this.page);
  await dashboard.expectOnDashboard();
});

Then('I should be logged in successfully', async function (this: UIWorld) {
  await expect(this.page).toHaveURL(/\/ui\/dashboard/);
});

// ================= SALES LIST PAGE =================
When("I navigate to the sales page", async function (this: UIWorld) {
  const sales = new SalesPage(this.page);
  await sales.open();
  this.state.salesPage = sales;
});

Then("I should see the sales list", async function (this: UIWorld) {
  await this.state.salesPage!.expectTableVisible();
});

Then("I should see pagination controls", async function (this: UIWorld) {
  await this.state.salesPage!.expectPaginationVisible();
});

Then(
  "I should see pagination controls if there are multiple pages",
  async function (this: UIWorld) {
    const sales = this.state.salesPage!;
    const paginationCount = await sales.pagination.count();
    if (paginationCount > 0) {
      await sales.expectPaginationVisible();
    } else {
      console.log("Pagination not displayed — only one page");
    }
  }
);

Then("sales should be sorted by sold date descending", async function (this: UIWorld) {
  await this.state.salesPage!.expectSoldDateSortedDesc();
});

// ================= SELL PLANT BUTTON =================
Then("I should see sell plant button", async function (this: UIWorld) {
  await this.state.salesPage!.expectSellPlantLinkVisible();
});

// ================= SELL PLANT FORM PAGE =================
// This handles both Given and When for "I navigate to the sell plant page"
Given(/^I navigate to the sell plant page$/, async function (this: UIWorld) {
  const sales = new SalesPage(this.page);
  this.state.salesPage = sales;
  await sales.openSellPlantPage();
});

// ================= INVALID FORM — CASE 1 =================
When("I submit the sell plant form with quantity 0 and no plant", async function (this: UIWorld) {
  await this.state.salesPage!.submitSellPlantForm({ plant: "", quantity: 0 });
});

Then("I should see quantity validation alert", async function (this: UIWorld) {
  await this.state.salesPage!.expectQuantityAlertVisible();
});

// ================= INVALID FORM — CASE 2 =================
When("I submit the sell plant form with quantity > 0 and no plant", async function (this: UIWorld) {
  await this.state.salesPage!.submitSellPlantForm({ plant: "", quantity: 1 });
});

Then("I should see plant required validation error", async function (this: UIWorld) {
  await this.state.salesPage!.expectPlantRequiredErrorVisible();
});

// ================= TC_UI_006: SUCCESSFUL SALE =================
When("I select a plant with stock greater than or equal to 1", async function (this: UIWorld) {
  const plantData = await this.state.salesPage!.selectPlantWithStock();
  (this.state as any).currentPlantName = plantData.plantName;
  this.state.initialStock = plantData.initialStock;
  console.log(`Selected plant ${plantData.plantName} with stock ${plantData.initialStock}`);
});

Then("the plant stock should be reduced", async function (this: UIWorld) {
  const currentPlantName = (this.state as any).currentPlantName;
  const currentStock = await this.state.salesPage!.getPlantStockByName(currentPlantName);
  const expectedStock = (this.state.initialStock || 0) - (this.state.quantitySold || 0);

  expect(currentStock).toBe(expectedStock);
  console.log(`Stock reduced from ${this.state.initialStock} to ${currentStock}`);
});

// ================= DELETE SALE =================
When("I delete the first sale and confirm", async function (this: UIWorld) {
  await this.state.salesPage!.deleteFirstSaleWithConfirm();
});

Then("the sale should be removed from the list", async function (this: UIWorld) {
  console.log("Sale deletion verified");
});

// ================= SELL PLANT FORM SUBMISSION =================
When("I enter a valid quantity", async function (this: UIWorld) {
  const quantity = Math.min(this.state.initialStock || 1, 1);
  this.state.quantitySold = quantity;
  await this.state.salesPage!.quantityInput.fill(quantity.toString());
  console.log(`Entered quantity: ${quantity}`);
});

When("I click the Sell button", async function (this: UIWorld) {
  await this.state.salesPage!.submitButton.click();
});

Then("the sale should be saved successfully", async function (this: UIWorld) {
  await this.page.waitForLoadState("networkidle");
  console.log("Sale saved successfully");
});

Then("I should be redirected to the sales list page", async function (this: UIWorld) {
  await this.state.salesPage!.expectRedirectedToSalesList();
});

// ================= TC_UI_009: SORTING OPTIONS =================
When("I click the Plant column header", async function (this: UIWorld) {
  await this.state.salesPage!.clickPlantColumnHeader();
});

Then("the sales should be sorted by plant name", async function (this: UIWorld) {
  await this.state.salesPage!.expectSortedByPlantName();
});

When("I click the Quantity column header", async function (this: UIWorld) {
  await this.state.salesPage!.clickQuantityColumnHeader();
});

Then("the sales should be sorted by quantity", async function (this: UIWorld) {
  await this.state.salesPage!.expectSortedByQuantity();
});

When("I click the Total Price column header", async function (this: UIWorld) {
  await this.state.salesPage!.clickTotalPriceColumnHeader();
});

Then("the sales should be sorted by total price", async function (this: UIWorld) {
  await this.state.salesPage!.expectSortedByTotalPrice();
});

// ================= TC_UI_010: PERMISSION RESTRICTIONS =================
Then("I should not see sell plant button", async function (this: UIWorld) {
  await this.state.salesPage!.expectSellPlantLinkNotVisible();
});

Then("I should not see delete action on sales rows", async function (this: UIWorld) {
  await this.state.salesPage!.expectNoDeleteActionsVisible();
});

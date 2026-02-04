import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { UIWorld } from "../support/world.js";
import { SalesPage } from "../pages/sales/sales.page.js";


// ================= LOGIN =================

Given('I am logged in as {string}', async function (this: UIWorld, role: string) {
  await this.loginAs(role);
});

Then('I should be logged in successfully', async function () {
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

When("I navigate to the sell plant page", async function (this: UIWorld) {
  const sales = new SalesPage(this.page);
  this.state.salesPage = sales;
  await sales.openSellPlantPage();
});


// ================= INVALID FORM — CASE 1 =================
// quantity = 0, no plant

When(
  "I submit the sell plant form with quantity 0 and no plant",
  async function (this: UIWorld) {
    await this.state.salesPage!.submitSellPlantForm({
      plant: "",
      quantity: 0
    });
  }
);

Then(
  "I should see quantity validation alert",
  async function (this: UIWorld) {
    await this.state.salesPage!.expectQuantityAlertVisible();
  }
);


// ================= INVALID FORM — CASE 2 =================
// quantity > 0, no plant

When(
  "I submit the sell plant form with quantity > 0 and no plant",
  async function (this: UIWorld) {
    await this.state.salesPage!.submitSellPlantForm({
      plant: "",
      quantity: 1
    });
  }
);

Then(
  "I should see plant required validation error",
  async function (this: UIWorld) {
    await this.state.salesPage!.expectPlantRequiredErrorVisible();
  }
);

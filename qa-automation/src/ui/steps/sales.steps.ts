import { Given, When, Then } from "@cucumber/cucumber";
import { UIWorld } from "../support/world.js";
import { SalesPage } from "../pages/sales/sales.page.js";

// logging in as a user
Given('I am logged in as {string}', async function (this: UIWorld, role: string) {
  await this.loginAs(role); 
});

//navigating to the sales page
When("I navigate to the sales page", async function (this: UIWorld) {
  const sales = new SalesPage(this.page);
  await sales.open(); 
  this.state.salesPage = sales; 
});

// verifying the sales list is visible
Then("I should see the sales list", async function (this: UIWorld) {
  await this.state.salesPage!.expectTableVisible();
});

// Step for verifying pagination controls
Then("I should see pagination controls", async function (this: UIWorld) {
  await this.state.salesPage!.expectPaginationVisible(); 
});

// step for conditional pagination
Then("I should see pagination controls if there are multiple pages", async function (this: UIWorld) {
  const sales = this.state.salesPage!;
  const paginationCount = await sales.pagination.count();
  
  if (paginationCount > 0) {
    await sales.expectPaginationVisible();
  } else {
    console.log('Pagination not displayed - likely only one page of results');
  }
});

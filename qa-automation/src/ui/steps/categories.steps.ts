import { When, Then } from "@cucumber/cucumber";
import { CategoriesPage } from "../pages/categories/categories.page.js";
import type { UIWorld } from "../support/world.js";

When("I navigate to the category page", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.open();
});

Then("I should be on the category page", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.expectOnCategoriesPage();
});

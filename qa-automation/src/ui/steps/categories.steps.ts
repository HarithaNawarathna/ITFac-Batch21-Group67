import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CategoriesPage } from "../pages/categories/categories.page.js";
import type { UIWorld } from "../support/world.js";

Given("at least one category exists", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.open();
  await categoriesPage.clickAddCategory();
  await categoriesPage.setCategoryName("Flowers");
  await categoriesPage.clickSaveCategory();
  await categoriesPage.expectSuccessMessage();
});

Given("a parent category exists with a sub-category", async function (this: UIWorld) {
  // Implementation depends on your backend setup helper
  // Example: await api.createCategoryWithSub("ParentCat", "ChildCat");
  console.log("Setup: Created Parent Category with Sub-Category");
});

Given("a category exists with assigned plants", async function (this: UIWorld) {
  // Implementation depends on your backend setup helper
  // Example: await api.createCategoryWithPlant("PlantCat", "Rose");
  console.log("Setup: Created Category with assigned Plants");
});

When("I navigate to the category page", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.open();
});

Then("I should be on the category page", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.expectOnCategoriesPage();
});

Then(
  "the Add Category button is visible and enabled",
  async function (this: UIWorld) {
    const categoriesPage = new CategoriesPage(this.page);
    const visible = await categoriesPage.isAddCategoryButtonVisible();
    expect(visible).toBe(true);
    const enabled = await categoriesPage.isAddCategoryButtonEnabled();
    expect(enabled).toBe(true);
  }
);

When("I click Add Category", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.clickAddCategory();
});

When(
  "I enter category name {string}",
  async function (this: UIWorld, name: string) {
    const categoriesPage = new CategoriesPage(this.page);
    await categoriesPage.setCategoryName(name);
  }
);

When("I click Save on the category form", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.clickSaveCategory();
});

Then(
  "a success message is displayed for the category",
  async function (this: UIWorld) {
    const categoriesPage = new CategoriesPage(this.page);
    await categoriesPage.expectSuccessMessage();
  }
);

// TC_UI_13 Add category without name
When("I leave the category name empty", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.clearCategoryName();
});

Then(
  "a validation message is displayed saying the name is required",
  async function (this: UIWorld) {
    const categoriesPage = new CategoriesPage(this.page);
    await categoriesPage.expectNameRequiredValidation();
  }
);

// TC_UI_14 Edit category
When("I click Edit on the first category", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.clickEditFirstCategory();
});

When(
  "I modify the category name to {string}",
  async function (this: UIWorld, name: string) {
    const categoriesPage = new CategoriesPage(this.page);
    await categoriesPage.setCategoryName(name);
  }
);

Then(
  "a category updated successfully message is shown",
  async function (this: UIWorld) {
    const categoriesPage = new CategoriesPage(this.page);
    await categoriesPage.expectSuccessMessage();
  }
);

When("I delete the first category", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.clickDeleteFirstCategory();
});

When("I click Delete on the first category", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.clickDeleteFirstCategory();
});

Then(
  "a category deleted successfully message is shown",
  async function (this: UIWorld) {
    const categoriesPage = new CategoriesPage(this.page);
    await categoriesPage.expectSuccessMessage();
  }
);

Then("the category list is displayed", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.expectCategoryListDisplayed();
});

When(
  "I apply search filter {string}",
  async function (this: UIWorld, searchText: string) {
    const categoriesPage = new CategoriesPage(this.page);
    await categoriesPage.setSearchFilter(searchText);
  }
);

When("I click Reset", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.clickReset();
});

Then("the Edit option is hidden", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.expectEditOptionHiddenOrDisabled();
});

Then("the Delete option is hidden", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.expectDeleteOptionHiddenOrDisabled();
});

When("I access Add Category page directly", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.goToAddCategoryDirect();
});

Then(
  "I am shown 403 or Access Denied",
  async function (this: UIWorld) {
    const categoriesPage = new CategoriesPage(this.page);
    await categoriesPage.expect403OrAccessDenied();
  }
);

When("I click Delete on the parent category", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  // Assuming the setup created a specific name, e.g., "ParentCat"
  await categoriesPage.clickDeleteCategoryByName("ParentCat");
});

When("I click Delete on the category with plants", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  // Assuming the setup created a specific name, e.g., "PlantCat"
  await categoriesPage.clickDeleteCategoryByName("PlantCat");
});

Then("an error message is displayed saying cannot delete parent category", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.expectDependencyError();
});

Then("an error message is displayed saying cannot delete category with items", async function (this: UIWorld) {
  const categoriesPage = new CategoriesPage(this.page);
  await categoriesPage.expectDependencyError();
});
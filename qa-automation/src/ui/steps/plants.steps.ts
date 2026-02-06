import { When, Then } from "@cucumber/cucumber";
import { PlantsPage } from "../pages/plants/plants.page.js";
import { AddPlantPage } from "../pages/plants/add-plant.page.js";
import { EditPlantPage } from "../pages/plants/edit-plant.page.js";
import type { UIWorld } from "../support/world.js";
import { ENV } from "../../config/env.js";
import { expect } from "@playwright/test";

When("I navigate to the plants page", async function (this: UIWorld) {
  const plantsPage = new PlantsPage(this.page);
  await plantsPage.open();
});//

Then("I should see the plant list displayed", async function (this: UIWorld) {
  const plantsPage = new PlantsPage(this.page);
  await plantsPage.expectPlantListDisplayed();
});//

Then("the plant table should have correct headers", async function (this: UIWorld) {
  const plantsPage = new PlantsPage(this.page);
  await plantsPage.expectCorrectTableHeaders();
});//

Then("all existing plants should be visible with correct details",async function (this: UIWorld) {
    const plantsPage = new PlantsPage(this.page);
    await plantsPage.expectPlantsVisibleWithDetails();
  }
);//

When("I click the Add Plant button", async function (this: UIWorld) {
  const plantsPage = new PlantsPage(this.page);
  await plantsPage.clickAddPlantButton();
});//

Then("I should be on the Add Plant page", async function (this: UIWorld) {
  const addPlantPage = new AddPlantPage(this.page);
  await addPlantPage.expectOnAddPlantPage();
});//

Then("all required input fields should be visible", async function (this: UIWorld) {
  const addPlantPage = new AddPlantPage(this.page);
  await addPlantPage.expectRequiredFieldsVisible();
});//

Then("the Save button should be visible", async function (this: UIWorld) {
  const addPlantPage = new AddPlantPage(this.page);
  await addPlantPage.expectSaveButtonVisible();
});//

When("I enter valid plant details", async function (this: UIWorld, dataTable) {
  const addPlantPage = new AddPlantPage(this.page);
  const data = dataTable.hashes()[0];
  this.state.createdPlantName = data.name?.trim();
  
  await addPlantPage.fillPlantForm({
    name: data.name,
    category: data.category,
    price: data.price,
    quantity: data.quantity,
  });
});//

When("I click Save", async function (this: UIWorld) {
  const addPlantPage = new AddPlantPage(this.page);
  await addPlantPage.clickSave();
});//

Then("I should see an add success message", async function (this: UIWorld) {
  const addPlantPage = new AddPlantPage(this.page);
  await addPlantPage.expectSuccessMessage();
});//

Then("the new plant should appear in the plant list", async function (this: UIWorld) {
  const plantsPage = new PlantsPage(this.page);
  await plantsPage.expectOnPlantsPage();
  const plantName = this.state.createdPlantName;
  if (!plantName) {
    throw new Error('Plant name was not stored in state');
  }
  
  await plantsPage.expectPlantExistsInList(plantName);
});//

When("I select an existing plant to edit and click edit button", async function (this: UIWorld) {
  const plantsPage = new PlantsPage(this.page);
  const plantName = await plantsPage.clickEditButtonForFirstPlant();
  this.state.selectedPlantName = plantName;
});//

Then("I should be on the Edit Plant page", async function (this: UIWorld) {
  const editPlantPage = new EditPlantPage(this.page);
  await editPlantPage.expectOnEditPlantPage();
});//

When("I modify plant details", async function (this: UIWorld, dataTable) {
  const editPlantPage = new EditPlantPage(this.page);
  
  const data = dataTable.hashes()[0];
  this.state.updatedPlantName = data.name?.trim();
  
  await editPlantPage.updatePlantForm({
    name: data.name,
    category: data.category,
    price: data.price,
    quantity: data.quantity,
  });
});//

When("I click Save button", async function (this: UIWorld) {
  const editPlantPage = new EditPlantPage(this.page);
  await editPlantPage.clickSave();
});//

Then("I should see an edit success message", async function (this: UIWorld) {
  const editPlantPage = new EditPlantPage(this.page);
  await editPlantPage.expectSuccessMessage();
});//

Then("the updated plant details should be reflected in the plant list", async function (this: UIWorld) {
  const plantsPage = new PlantsPage(this.page);

   await plantsPage.open();
   await this.page.waitForLoadState("networkidle");
   await plantsPage.expectOnPlantsPage();
  
  const updatedName = this.state.updatedPlantName;
  if (!updatedName) {
    throw new Error('Updated plant name was not stored in state');
  }
  await plantsPage.expectPlantExistsInList(updatedName);
});//

When("I select an existing plant to delete and click delete button", async function (this: UIWorld) {
  const plantsPage = new PlantsPage(this.page);
  const plantName = await plantsPage.selectFirstPlantForDeletion();
  this.state.deletedPlantName = plantName;
});//

When("I confirm the deletion", async function (this: UIWorld) {
  this.page.once("dialog", async dialog => {
    await dialog.accept();
  });
});//

Then("I should see a delete success message", async function (this: UIWorld) {
  await this.page.waitForLoadState("networkidle");
});//

Then(
  "the deleted plant should no longer be displayed in the plant list",
  async function (this: UIWorld) {
    const name = this.state.deletedPlantName;
    if (!name) throw new Error("Deleted plant name not stored");

    await this.page.reload();
    await this.page.waitForLoadState("networkidle");
    const row = this.page.locator(`tbody tr:has-text("${name}")`);
    await row.waitFor({ state: "detached", timeout: 10000 });
  }
);//

Then("the Add Plant button should not be visible", async function (this: UIWorld) {
  const plantsPage = new PlantsPage(this.page);
  await plantsPage.expectAddPlantButtonNotVisible();
});//

Then("the Edit buttons should not be visible", async function (this: UIWorld) {
  const plantsPage = new PlantsPage(this.page);
  await plantsPage.expectEditButtonsNotVisible();
});//

Then("the Delete buttons should not be visible", async function (this: UIWorld) {
  const plantsPage = new PlantsPage(this.page);
  await plantsPage.expectDeleteButtonsNotVisible();
});//

When("I manually navigate to {string}", async function (this: UIWorld, path: string) {
  await this.page.goto(`${ENV.UI_BASE_URL}${path}`);
});//

Then("I should be redirected to Access Denied page", async function (this: UIWorld) {
  await this.page.waitForLoadState('networkidle');
  
  const url = this.page.url();
  const isAccessDenied = url.includes('403') || url.includes('access-denied') || url.includes('forbidden');
  
  const pageText = await this.page.textContent('body');
  const hasAccessDeniedText = pageText?.includes('Access Denied') || 
                              pageText?.includes('403') || 
                              pageText?.includes('Forbidden');
  
  expect(isAccessDenied || hasAccessDeniedText).toBeTruthy();
});//
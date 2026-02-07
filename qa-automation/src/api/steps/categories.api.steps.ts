import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import {
  createCategory,
  createRootCategoryForTest,
  createSubcategoryForTest,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../clients/categories.client.js";
import type { APIWorld } from "../support/world.js";
import { readPretestIds } from "../../shared/utils/pretest-ids.js";

Given("a category exists", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  const token = this.authToken!;
  const unique = Date.now();
  const parentName = `Category-Root-${unique}-${Math.random().toString(36).substring(2, 10)}`;
  const subName = `Category-Sub-${unique}`;
  const rootRes = await createRootCategoryForTest(parentName, token);
  expect(rootRes.status).toBe(201);
  const rootData = rootRes.data as Record<string, unknown>;
  const parentIdRaw = rootData?.id;
  if (parentIdRaw == null) throw new Error("Root category response missing id");
  const parentId = Number(parentIdRaw);
  if (!Number.isFinite(parentId)) throw new Error("Root category id is not a number");
  const subRes = await createSubcategoryForTest(subName, parentId, token);
  expect(subRes.status).toBe(201);
  const subData = subRes.data as Record<string, unknown>;
  const subId = subData?.id;
  if (subId == null) throw new Error("Subcategory response missing id");
  this.createdCategoryId = String(subId);
  this.createdParentCategoryId = String(parentId);
});

Given("a category exists for delete", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  const token = this.authToken!;
  const suffix = Math.random().toString(36).substring(2, 7);
  const name = `Del${suffix}`;
  const res = await createRootCategoryForTest(name, token);
  expect(res.status).toBe(201);
  const data = res.data as Record<string, unknown>;
  const id = data?.id;
  if (id == null) throw new Error("Category response missing id");
  this.createdCategoryId = String(id);
  this.createdParentCategoryId = null;
});

When(
  "I create a category with name {string}",
  async function (this: APIWorld, name: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");
    const response = await createCategory(name, token);
    this.lastResponse = response;
    if (response.status >= 201 && response.status < 300) {
      const data = response.data as Record<string, unknown>;
      const id = data?.id;
      this.createdCategoryId =
        id !== undefined && id !== null ? String(id) : null;
    }
  }
);

When(
  "I update the category with name {string}",
  async function (this: APIWorld, name: string) {
    expect(this.authToken).toBeTruthy();
    expect(this.createdCategoryId).toBeTruthy();
    const token = this.authToken!;
    const id = this.createdCategoryId!;
    const parentId = this.createdParentCategoryId!;
    this.lastResponse = await updateCategory(id, name, parentId, token);
  }
);

When("I delete the category", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  expect(this.createdCategoryId).toBeTruthy();
  const token = this.authToken!;
  const id = this.createdCategoryId!;
  this.lastResponse = await deleteCategory(id, token);
  this.createdCategoryId = null;
});

When("I get the category list", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  const token = this.authToken!;
  this.lastResponse = await getCategories(token);
});

When(
  "I get categories with page {int} and size {int}",
  async function (this: APIWorld, page: number, size: number) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken!;
    this.lastResponse = await getCategories(token, { page, size });
  }
);

When(
  "I get categories with search {string}",
  async function (this: APIWorld, search: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken!;
    this.lastResponse = await getCategories(token, { search });
  }
);

/** Get parent category id from step param: "pretest" → pretest-created parent category, otherwise numeric. */
function getParentCategoryIdFromParam(world: APIWorld, param: string): number {
  const normalized = String(param).trim().toLowerCase();
  if (normalized === "pretest") {
    const id = world.createdParentCategoryId ?? readPretestIds()?.parentCategoryId;
    if (id == null) {
      throw new Error("Use @pretest on this scenario so the pretest creates a parent category, or run pretest.feature first to populate pretest-ids.json");
    }
    return Number(id);
  }
  return Number(param);
}

When(
  "I get categories with parentId {string}",
  async function (this: APIWorld, parentIdParam: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken!;
    const parentId = getParentCategoryIdFromParam(this, parentIdParam);
    this.lastResponse = await getCategories(token, { parentId });
  }
);

When(
  "I get categories with sort {string}",
  async function (this: APIWorld, sort: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken!;
    this.lastResponse = await getCategories(token, { sort });
  }
);

Then(
  "the response status is {int}",
  async function (this: APIWorld, status: number) {
    expect(this.lastResponse).not.toBeNull();
    const response = this.lastResponse;
    if (!response) throw new Error("Expected response");
    expect(response.status).toBe(status);
  }
);

Then("the category is created successfully", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const response = this.lastResponse;
  if (!response) throw new Error("Expected response");
  expect(response.status).toBe(201);
  const data = response.data as Record<string, unknown>;
  expect(data).toHaveProperty("name");
  expect(data.name).toBeTruthy();
});

Then(
  "the error message is {string}",
  async function (this: APIWorld, expectedMessage: string) {
    expect(this.lastResponse).not.toBeNull();
    const response = this.lastResponse;
    if (!response) throw new Error("Expected response");
    const data = (response.data as Record<string, unknown>) || {};
    const message =
      (data.message as string) ?? (data.error as string) ?? "";
    expect(message.toLowerCase()).toContain(expectedMessage.toLowerCase());
  }
);

Then("a validation error is returned", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const response = this.lastResponse;
  if (!response) throw new Error("Expected response");
  expect(response.status).toBeGreaterThanOrEqual(400);
  expect(response.status).toBeLessThan(500);
});

Then("the category is updated successfully", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const response = this.lastResponse;
  if (!response) throw new Error("Expected response");
  expect(response.status).toBe(200);
  const data = response.data as Record<string, unknown>;
  expect(data).toHaveProperty("name");
});

Then("the category is deleted successfully", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const response = this.lastResponse;
  if (!response) throw new Error("Expected response");
  expect(response.status).toBe(200);
});

Then(
  "the category list is returned with status {int}",
  async function (this: APIWorld, status: number) {
    expect(this.lastResponse).not.toBeNull();
    const response = this.lastResponse;
    if (!response) throw new Error("Expected response");
    expect(response.status).toBe(status);
    const data = response.data;
    expect(Array.isArray(data) || (data && typeof data === "object")).toBe(true);
  }
);

Then("a paginated category list is returned", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const response = this.lastResponse;
  if (!response) throw new Error("Expected response");
  expect(response.status).toBe(200);
  const data = response.data as Record<string, unknown>;
  expect(data).toBeDefined();
});

Then("filtered results are returned", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const response = this.lastResponse;
  if (!response) throw new Error("Expected response");
  expect(response.status).toBe(200);
});

Then("filtered categories are returned", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const response = this.lastResponse;
  if (!response) throw new Error("Expected response");
  expect(response.status).toBe(200);
});

Then("a sorted category list is returned", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const response = this.lastResponse;
  if (!response) throw new Error("Expected response");
  expect(response.status).toBe(200);
});
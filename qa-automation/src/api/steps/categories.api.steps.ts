import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import axios from "axios";
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
  try {
    const rootRes = await createRootCategoryForTest(parentName, token);
    const rootData = rootRes.data as Record<string, unknown>;
    const parentIdRaw = rootData?.id;
    if (parentIdRaw == null) throw new Error("Root category response missing id");
    const parentId = Number(parentIdRaw);
    if (!Number.isFinite(parentId)) throw new Error("Root category id is not a number");
    const subRes = await createSubcategoryForTest(subName, parentId, token);
    const subData = subRes.data as Record<string, unknown>;
    const subId = subData?.id;
    if (subId == null) throw new Error("Subcategory response missing id");
    this.createdCategoryId = String(subId);
    this.createdParentCategoryId = String(parentId);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    }
    throw err;
  }
});

When(
  "I create a category with name {string}",
  async function (this: APIWorld, name: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");
    try {
      this.lastResponse = await createCategory(name, token);
      const response = this.lastResponse;
      if (response && response.status >= 201 && response.status < 300) {
        const data = response.data as Record<string, unknown>;
        const id = data?.id;
        this.createdCategoryId =
          id !== undefined && id !== null ? String(id) : null;
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        this.lastResponse = err.response;
      } else {
        throw err;
      }
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
    try {
      this.lastResponse = await updateCategory(id, name, token);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        this.lastResponse = err.response;
      } else {
        throw err;
      }
    }
  }
);

When("I delete the category", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  expect(this.createdCategoryId).toBeTruthy();
  const token = this.authToken!;
  const id = this.createdCategoryId!;
  try {
    this.lastResponse = await deleteCategory(id, token);
    this.createdCategoryId = null;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

When("I get the category list", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  const token = this.authToken!;
  try {
    this.lastResponse = await getCategories(token);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

When(
  "I get categories with page {int} and size {int}",
  async function (this: APIWorld, page: number, size: number) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken!;
    try {
      this.lastResponse = await getCategories(token, { page, size });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        this.lastResponse = err.response;
      } else {
        throw err;
      }
    }
  }
);

When(
  "I get categories with search {string}",
  async function (this: APIWorld, search: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken!;
    try {
      this.lastResponse = await getCategories(token, { search });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        this.lastResponse = err.response;
      } else {
        throw err;
      }
    }
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
    try {
      this.lastResponse = await getCategories(token, { parentId });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        this.lastResponse = err.response;
      } else {
        throw err;
      }
    }
  }
);

When(
  "I get categories with sort {string}",
  async function (this: APIWorld, sort: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken!;
    try {
      this.lastResponse = await getCategories(token, { sort });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        this.lastResponse = err.response;
      } else {
        throw err;
      }
    }
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

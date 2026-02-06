import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import axios from "axios";
import { createCategory } from "../clients/categories.client.js";
import type { APIWorld } from "../support/world.js";

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

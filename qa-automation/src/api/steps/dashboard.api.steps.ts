import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import axios from "axios";
import { ENV } from "../../config/env.js";
import { ROUTES } from "../../config/routes.js";
import { login } from "../clients/auth.client.js";
import type { APIWorld } from "../support/world.js";

const baseURL = ENV.API_BASE_URL;

// Helper to make authenticated GET requests
async function authenticatedGet(url: string, token: string) {
  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
}

// Helper to make unauthenticated GET requests
async function unauthenticatedGet(url: string) {
  return axios.get(url, {
    validateStatus: () => true,
  });
}

Given("I am not authenticated", async function (this: APIWorld) {
  this.authToken = null;
});

When("I send a GET request to the health endpoint", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  try {
    this.lastResponse = await authenticatedGet(
      `${baseURL}${ROUTES.HEALTH}`,
      this.authToken!
    );
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

When("I send a GET request to the plants summary endpoint", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  try {
    this.lastResponse = await authenticatedGet(
      `${baseURL}${ROUTES.PLANTS_SUMMARY}`,
      this.authToken!
    );
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

When("I send a GET request to the categories summary endpoint", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  try {
    this.lastResponse = await authenticatedGet(
      `${baseURL}${ROUTES.CATEGORIES_SUMMARY}`,
      this.authToken!
    );
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

When("I send a GET request to the categories endpoint", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  try {
    this.lastResponse = await authenticatedGet(
      `${baseURL}${ROUTES.CATEGORIES}`,
      this.authToken!
    );
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

When("I send a GET request to the plants endpoint", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  try {
    this.lastResponse = await authenticatedGet(
      `${baseURL}${ROUTES.PLANTS}`,
      this.authToken!
    );
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

When("I send a GET request to the sales endpoint", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  try {
    this.lastResponse = await authenticatedGet(
      `${baseURL}${ROUTES.SALES}`,
      this.authToken!
    );
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

When("I send a GET request to the categories endpoint without auth", async function (this: APIWorld) {
  try {
    this.lastResponse = await unauthenticatedGet(`${baseURL}${ROUTES.CATEGORIES}`);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

When("I send a GET request to the main categories endpoint", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  try {
    this.lastResponse = await authenticatedGet(
      `${baseURL}${ROUTES.CATEGORIES_MAIN}`,
      this.authToken!
    );
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

When("I try to create a category with name {string}", async function (this: APIWorld, name: string) {
  expect(this.authToken).toBeTruthy();
  try {
    this.lastResponse = await axios.post(
      `${baseURL}${ROUTES.CATEGORIES}`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    );
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

Then("the API response status should be {int}", async function (this: APIWorld, status: number) {
  expect(this.lastResponse).not.toBeNull();
  expect(this.lastResponse!.status).toBe(status);
});

Then("the response should contain {string}", async function (this: APIWorld, field: string) {
  expect(this.lastResponse).not.toBeNull();
  const data = this.lastResponse!.data;
  expect(data).toHaveProperty(field);
});

Then("the response should be an array", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const data = this.lastResponse!.data;
  expect(Array.isArray(data)).toBe(true);
});

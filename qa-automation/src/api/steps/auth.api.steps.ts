import { Given, When, Then } from "@cucumber/cucumber";
import { DataTable } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import axios from "axios";
import { login } from "../clients/auth.client.js";
import { ENV } from "../../config/env.js";
import type { APIWorld } from "../support/world.js";
import { jwtDecode } from "jwt-decode";

Given("Admin authenticated", async function (this: APIWorld) {
  const creds = ENV.USERS.admin;
  this.lastResponse = await login(creds.username, creds.password);

  const response = this.lastResponse;
  expect(response?.status).toBe(200);
  if (!response) throw new Error("Expected login response");

  const data = response.data as Record<string, unknown>;
  this.authToken = (data.token as string) ?? null;
  expect(this.authToken).toBeTruthy();
});

Given("User authenticated", async function (this: APIWorld) {
  const creds = ENV.USERS.user;
  this.lastResponse = await login(creds.username, creds.password);

  const response = this.lastResponse;
  expect(response?.status).toBe(200);
  if (!response) throw new Error("Expected login response");

  const data = response.data as Record<string, unknown>;
  this.authToken = (data.token as string) ?? null;
  expect(this.authToken).toBeTruthy();
});

Given("User authenticated", async function (this: APIWorld) {
  const creds = ENV.USERS.user;
  this.lastResponse = await login(creds.username, creds.password);
  const response = this.lastResponse;
  expect(response?.status).toBe(200);
  if (!response) throw new Error("Expected login response");
  const data = response.data as Record<string, unknown>;
  this.authToken = (data.token as string) ?? null;
  expect(this.authToken).toBeTruthy();
});

When(
  "I login via API with following credentials",
  async function (this: APIWorld, table: DataTable) {
    const users = table.hashes();
    this.multipleResponses = [];

    for (const user of users) {
      const username = user.username || "";
      const password = user.password || "";

      try {
        const response = await login(username, password);
        this.multipleResponses.push(response);
      } catch (err) {
        // If axios error with response (like 401), store the response
        if (axios.isAxiosError(err) && err.response) {
          this.multipleResponses.push(err.response);
        } else {
          throw err;
        }
      }
    }
  }
);

Then(
  "each login response status should be {int}",
  function (this: APIWorld, status: number) {
    for (const response of this.multipleResponses) {
      expect(response.status).toBe(status);
    }
  }
);

Then(
  "each response should contain a token",
  function (this: APIWorld) {
    for (const response of this.multipleResponses) {
      const data = response.data as Record<string, unknown>;
      expect(data).toHaveProperty("token");
      expect(data.token).toBeTruthy();
    }
  }
);

Then("each response token should contain the correct role", function (this: APIWorld) {
  for (const response of this.multipleResponses) {
    const data = response.data as Record<string, any>;
    const token = data.token as string;
    expect(token).toBeTruthy();

    // Decode JWT to read claims
    const decoded: any = jwtDecode(token);

    // Get expected role from the response object
    const expectedRole = response.expectedRole;

    // Compare role in JWT with expectedRole
    expect(decoded.role).toBe(expectedRole);
  }
});

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import axios from "axios";
import { login } from "../clients/auth.client.js";
import { ENV } from "../../config/env.js";
import type { APIWorld } from "../support/world.js";

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

When(
  "I login via API as {string}",
  async function (this: APIWorld, role: "admin" | "user") {
    const creds = ENV.USERS[role];
    this.lastResponse = await login(creds.username, creds.password);
  }
);

When(
  "I login via API with username {string} and password {string}",
  async function (this: APIWorld, username: string, password: string) {
    try {
      this.lastResponse = await login(username, password);
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
  "the login response status is {int}",
  async function (this: APIWorld, status: number) {
    expect(this.lastResponse).not.toBeNull();
    const response = this.lastResponse;
    if (!response) throw new Error("Expected response");
    expect(response.status).toBe(status);
  }
);

Then("the response contains a token", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const response = this.lastResponse;
  if (!response) throw new Error("Expected response");
  const data = response.data as Record<string, unknown>;
  expect(data).toHaveProperty("token");
  expect(data.token).toBeTruthy();
});

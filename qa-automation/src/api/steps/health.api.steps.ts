import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import axios from "axios";
import { ENV } from "../../config/env.js";
import { ROUTES } from "../../config/routes.js";
import type { APIWorld } from "../support/world.js";

function looksHealthy(payload: unknown): boolean {
  if (payload == null) return false;

  if (typeof payload === "string") {
    const s = payload.toLowerCase();
    return s.includes("healthy") || s.includes("ok") || s.includes("up");
  }

  if (typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    const status = obj.status;
    if (typeof status === "string") {
      const s = status.toLowerCase();
      if (s === "up" || s === "ok" || s === "healthy") return true;
    }
    if (typeof obj.healthy === "boolean") return obj.healthy === true;
    if (typeof obj.ok === "boolean") return obj.ok === true;
  }

  return false;
}

function buildApiUrl(path: string): string {
  const base = ENV.API_BASE_URL;
  if (!base || typeof base !== "string") {
    throw new Error("ENV.API_BASE_URL is missing/invalid. Check qa-automation/.env");
  }
  return new URL(path, base).toString();
}

When("I request the application health endpoint", async function (this: APIWorld) {
  const url = buildApiUrl(ROUTES.HEALTH);

  try {
    this.lastResponse = await axios.get(url, {
      headers: this.authToken
        ? { Authorization: `Bearer ${this.authToken}`, accept: "*/*" }
        : { accept: "*/*" },
    });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) this.lastResponse = err.response;
    else throw err;
  }
});

Then("the health response status is {int}", async function (this: APIWorld, status: number) {
  expect(this.lastResponse).not.toBeNull();
  const res = this.lastResponse;
  if (!res) throw new Error("Expected response");
  expect(res.status).toBe(status);
});

Then("the health response indicates the application is healthy", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const res = this.lastResponse;
  if (!res) throw new Error("Expected response");
  expect(looksHealthy(res.data)).toBe(true);
});
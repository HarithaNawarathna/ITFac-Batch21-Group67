import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import axios from "axios";
import { getPlantById } from "../clients/plants.client.js";
import { sellPlant } from "../clients/sales.client.js";
import type { APIWorld } from "../support/world.js";

function extractStock(maybePlant: unknown): number | null {
  if (!maybePlant || typeof maybePlant !== "object") return null;
  const obj = maybePlant as Record<string, unknown>;

  const directCandidates: unknown[] = [
    obj.stock,
    obj.quantity,
    obj.availableStock,
    obj.remainingStock,
    obj.currentStock,
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) return candidate;
    if (typeof candidate === "string") {
      const parsed = Number(candidate);
      if (!Number.isNaN(parsed) && Number.isFinite(parsed)) return parsed;
    }
  }

  const nestedCandidates: unknown[] = [obj.plant, obj.data, obj.result];
  for (const nested of nestedCandidates) {
    const nestedStock = extractStock(nested);
    if (typeof nestedStock === "number") return nestedStock;
  }

  return null;
}

//TC_API_002

Given(
  "plant with id {string} is in stock",
  async function (this: APIWorld, plantId: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");

    this.plantId = Number(plantId);
    this.lastResponse = await getPlantById(this.plantId, token);
    const response = this.lastResponse;
    if (!response) throw new Error("Expected response");

    const stock = extractStock(response.data);
    if (stock === null) {
      throw new Error(
        "Could not find a numeric stock/quantity field in GET plant response"
      );
    }
    expect(stock).toBeGreaterThan(0);
    this.initialPlantStock = stock;
  }
);

When(
  "Admin sells plant with id {string} and quantity {int}",
  async function (this: APIWorld, plantId: string, qty: number) {
		expect(this.authToken).toBeTruthy();
		const token = this.authToken;
		if (!token) throw new Error("Expected auth token");

		this.plantId = Number(plantId);
		this.quantitySold = qty;

    try {
      this.lastResponse = await sellPlant(
        Number(plantId),
        qty,
			token
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        this.lastResponse = err.response;
      } else {
        throw err;
      }
    }
  }
);

//TC_API_002

When(
  "Admin sells plant with id {string} with quantity exceeding stock",
  async function (this: APIWorld, plantId: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");

    this.plantId = Number(plantId);
    if (this.initialPlantStock === null) {
      // Ensure we have a stock baseline even if the Given step was skipped/changed.
      const plantResponse = await getPlantById(this.plantId, token);
      const stock = extractStock(plantResponse.data);
      if (stock === null) {
        throw new Error(
          "Could not find a numeric stock/quantity field in GET plant response"
        );
      }
      this.initialPlantStock = stock;
    }

    const exceedingQty = (this.initialPlantStock ?? 0) + 1;
    this.quantitySold = exceedingQty;

    try {
      this.lastResponse = await sellPlant(this.plantId, exceedingQty, token);
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
  "the sales response status is {int}",
  async function (this: APIWorld, status: number) {
    expect(this.lastResponse).not.toBeNull();
		const response = this.lastResponse;
		if (!response) throw new Error("Expected response");
		expect(response.status).toBe(status);
  }
);

Then(
  "the sale is created successfully",
  async function (this: APIWorld) {
    expect(this.lastResponse).not.toBeNull();
    const response = this.lastResponse;
    if (!response) throw new Error("Expected response");
    expect(response.status).toBe(201);

    const data = response.data as Record<string, unknown>;
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("plant");
    expect(data).toHaveProperty("quantity");

    const id = data.id;
    if (typeof id === "string" || typeof id === "number") {
      this.createdSaleId = String(id);
    }

    if (this.quantitySold !== null) {
      expect(Number(data.quantity)).toBe(this.quantitySold);
    }

    if (this.plantId !== null) {
      const plant = data.plant as Record<string, unknown>;
      expect(Number(plant.id)).toBe(this.plantId);
    }
  }
);

Then(
  "the plant stock is reduced",
  async function (this: APIWorld) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");

    if (this.plantId === null) throw new Error("Expected plantId");
    if (this.initialPlantStock === null) throw new Error("Expected initialPlantStock");
    if (this.quantitySold === null) throw new Error("Expected quantitySold");

    const expected = this.initialPlantStock - this.quantitySold;

    // Preferred: verify via GET plant after selling
    const plantResponse = await getPlantById(this.plantId, token);
    const newStock = extractStock(plantResponse.data);
    if (newStock === null) {
      throw new Error(
        "Could not find a numeric stock/quantity field in GET plant response"
      );
    }
    expect(newStock).toBe(expected);
  }
);


import { When, Then, DataTable, Given } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import axios from "axios";
import { getPlants, createPlant, updatePlant, getPlantById, deletePlant } from "../clients/plants.client.js";
import type { APIWorld } from "../support/world.js";

let existingPlantId: number;

When(
  "I send GET request to {string}",
  async function (this: APIWorld, endpoint: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");
    try {
      this.lastResponse = await getPlants(token);
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
  "the plant list is returned in response body",
  async function (this: APIWorld) {
    expect(this.lastResponse).not.toBeNull();
    const response = this.lastResponse;
    if (!response) throw new Error("Expected response");
    const data = response.data as Array<Record<string, unknown>>;
    expect(Array.isArray(data)).toBe(true);
  }
);

When(
  "I create a plant with valid details",
  async function (this: APIWorld, dataTable: DataTable) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");
    
    const rows = dataTable.hashes();
    const data = rows[0];
    
    const plantData = {
      name: data.name,
      categoryId: parseInt(data.categoryId),
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity)
    };
    
    try {
      this.lastResponse = await createPlant(token, plantData);
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
  "the plant is created successfully",
  async function (this: APIWorld) {
    expect(this.lastResponse).not.toBeNull();
    const response = this.lastResponse;
    if (!response) throw new Error("Expected response");
    const data = response.data as Record<string, unknown>;
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("name");
  }
);

When(
  "I create a plant with empty name",
  async function (this: APIWorld, dataTable: DataTable) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");
    
    const rows = dataTable.hashes();
    const data = rows[0];
    
    const plantData = {
      name: data.name,
      categoryId: parseInt(data.categoryId),
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity)
    };
    
    try {
      this.lastResponse = await createPlant(token, plantData);
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
  "validation error message is displayed",
  async function (this: APIWorld) {
    expect(this.lastResponse).not.toBeNull();
    const response = this.lastResponse;
    if (!response) throw new Error("Expected response");
    
    const data = response.data as Record<string, unknown>;
    expect(data.error || data.message).toBeTruthy();
  }
);

Given("a plant exists with ID {int}", async function (this: APIWorld, plantId: number) {
  expect(this.authToken).toBeTruthy();
  const token = this.authToken;
  if (!token) throw new Error("Expected auth token");

  try {
    this.lastResponse = await getPlantById(token, plantId);
    const response = this.lastResponse;
    
    expect(response?.status).toBe(200);
    if (!response) throw new Error("Expected response");
    
    const data = response.data as Record<string, unknown>;
    expect(data).toHaveProperty("id");
    expect(data.id).toBe(plantId);
   
    existingPlantId = plantId;
    
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      throw new Error(`Plant with ID ${plantId} does not exist`);
    }
    throw err;
  }
});

When(
  "I update plant details",
  async function (this: APIWorld, dataTable: DataTable) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");
    
    const rows = dataTable.hashes();
    const data = rows[0];
    
    const plantId = parseInt(data.id);
    const plantData = {
      name: data.name,
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity)
    };
    
    try {
      this.lastResponse = await updatePlant(token, plantId, plantData);
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
  "the updated plant details are returned",
  async function (this: APIWorld) {
    expect(this.lastResponse).not.toBeNull();
    const response = this.lastResponse;
    if (!response) throw new Error("Expected response");
    
    const data = response.data as {
      id: number;
      name: string;
      price: number;
      quantity: number;
    };
    expect(data.id).toBeTruthy();
    expect(data.name).toBe("Criticall Rose");
    expect(data.price).toBe(60);
    expect(data.quantity).toBe(150);
  }
);

When(
  "I delete plant with ID {int}",
  async function (this: APIWorld, plantId: number) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");
 
    const idToDelete = existingPlantId || plantId;
    
    try {
      this.lastResponse = await deletePlant(token, idToDelete);
      this.deletedPlantId = idToDelete;
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
  "plant is removed from database",
  async function (this: APIWorld) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");
    
    const plantId = this.deletedPlantId;
    if (!plantId) throw new Error("No plant ID to verify deletion");
    
    try {
      await getPlantById(token, plantId);
      throw new Error(`Plant with ID ${plantId} still exists in database`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        expect(err.response.status).toBe(404);
      } else {
        throw err;
      }
    }
  }
);
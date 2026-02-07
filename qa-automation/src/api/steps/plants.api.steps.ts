import { When, Then, DataTable, Given } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import axios from "axios";
import { createRootCategoryForTest, createSubcategoryForTest } from "../clients/categories.client.js";
import { getPlants, createPlant, updatePlant, getPlantsById, deletePlant, getPlantsByCategory } from "../clients/plants.client.js";
import type { APIWorld } from "../support/world.js";
import { createPlantForTest } from "../support/support.js";
import { ENV } from "../../config/env.js";
import { readPretestIds } from "../../shared/utils/pretest-ids.js";

let existingPlantId: number;

/** Get category id from step param: "pretest" → pretest-created category, otherwise numeric. */
function getCategoryIdFromParam(world: APIWorld, param: string): number {
  const normalized = String(param).trim().toLowerCase();
  if (normalized === "pretest") {
    const id = world.createdCategoryId ?? readPretestIds()?.categoryId;
    if (id == null) {
      throw new Error("Use @pretest on this scenario so the pretest creates a category, or run pretest.feature first to populate pretest-ids.json");
    }
    return Number(id);
  }
  return Number(param);
}

/** Get plant id from step param: "pretest" → pretest-created plant, otherwise numeric. */
function getPlantIdFromParam(world: APIWorld, param: string): number {
  const normalized = String(param).trim().toLowerCase();
  if (normalized === "pretest") {
    const id = world.createdPlantId ?? readPretestIds()?.plantId;
    if (id == null) {
      throw new Error("Use @pretest on this scenario so the pretest creates a plant, or run pretest.feature first to populate pretest-ids.json");
    }
    return Number(id);
  }
  return Number(param);
}

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

When(
  "I send GET request to plants by category id {string}",
  async function (this: APIWorld, categoryIdParam: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");
    const categoryId = getCategoryIdFromParam(this, categoryIdParam);
    const endpoint = `/api/plants/category/${categoryId}`;
    try {
      this.lastResponse = await getPlantsByCategory(endpoint, token);
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
    const categoryId = getCategoryIdFromParam(this, String(data.categoryId));
    
    const plantData = {
      name: data.name,
      categoryId,
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
    const categoryId = getCategoryIdFromParam(this, String(data.categoryId));
    
    const plantData = {
      name: data.name,
      categoryId,
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

Given("a plant exists with ID {string}", async function (this: APIWorld, plantIdParam: string) {
  expect(this.authToken).toBeTruthy();
  const token = this.authToken;
  if (!token) throw new Error("Expected auth token");

  const plantId = getPlantIdFromParam(this, plantIdParam);
  try {
    this.lastResponse = await getPlantsById(token, plantId);
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

Given("a plant exists for delete", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  const token = this.authToken!;
  const suffix = Math.random().toString(36).substring(2, 6);
  const rootName = `Del${suffix}`;
  const subName = `Sub${suffix}`;
  try {
    const rootRes = await createRootCategoryForTest(rootName, token);
    const rootData = rootRes.data as Record<string, unknown>;
    const parentIdRaw = rootData?.id;
    if (parentIdRaw == null) throw new Error("Root category response missing id");
    const parentId = Number(parentIdRaw);
    if (!Number.isFinite(parentId)) throw new Error("Root category id is not a number");

    const subRes = await createSubcategoryForTest(subName, parentId, token);
    const subData = subRes.data as Record<string, unknown>;
    const subIdRaw = subData?.id;
    if (subIdRaw == null) throw new Error("Subcategory response missing id");
    const subCategoryId = Number(subIdRaw);
    if (!Number.isFinite(subCategoryId)) throw new Error("Subcategory id is not a number");

    this.createdParentCategoryId = String(parentId);
    this.createdCategoryId = String(subCategoryId);

    const plantRes = await createPlantForTest(token, subCategoryId);
    const plantResData = plantRes.data as Record<string, unknown>;
    const plantIdRaw = plantResData?.id;
    if (plantIdRaw == null) throw new Error("Plant response missing id");
    const plantId = Number(plantIdRaw);
    this.createdPlantId = String(plantId);
    existingPlantId = plantId;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
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
    const plantId = getPlantIdFromParam(this, String(data.id));
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
    expect(data.name).toBe("Golden Pothos");
    expect(data.price).toBe(60);
    expect(data.quantity).toBe(150);
  }
);

When(
  "I delete plant with ID {string}",
  async function (this: APIWorld, plantIdParam: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");
 
    const plantId = getPlantIdFromParam(this, plantIdParam);
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

When("I delete the plant", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  expect(this.createdPlantId).toBeTruthy();
  const token = this.authToken!;
  const id = Number(this.createdPlantId!);
  try {
    this.lastResponse = await deletePlant(token, id);
    this.deletedPlantId = id;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

Then(
  "plant is removed from database",
  async function (this: APIWorld) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");
    
    const plantId = this.deletedPlantId;
    if (!plantId) throw new Error("No plant ID to verify deletion");
    
    try {
      await getPlantsById(token, plantId);
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

When("I send GET request to view details for plant {string}", async function (this: APIWorld, plantIdParam: string) {
  const token = this.authToken!;
  const plantId = getPlantIdFromParam(this, plantIdParam);
  try {
    this.lastResponse = await getPlantsById(token, plantId);
  } catch (err: any) {
    this.lastResponse = err.response;
  }
});

Then("the response contains correct details for plant {string}", async function (this: APIWorld, plantIdParam: string) {
  const plantId = getPlantIdFromParam(this, plantIdParam);
  const data = this.lastResponse?.data;
  expect(data.id).toBe(plantId);
  expect(data).toHaveProperty("name");
  expect(data).toHaveProperty("categoryId");
  expect(data).toHaveProperty("price");
  expect(data).toHaveProperty("quantity");
});

Then("the response contains plants from category", function (this: APIWorld) {
  const data = this.lastResponse?.data;
  expect(data).toBeDefined();
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);
  
  data.forEach((plant: any) => {
    expect(plant).toHaveProperty("category");
    expect(plant.category).toHaveProperty("id");
    expect(plant.category).toHaveProperty("name");
  });
});

When("I send GET request to {string} without authentication", async function (this: APIWorld, endpoint: string) {
  try {
    this.lastResponse = await axios.get(`${ENV.API_BASE_URL}${endpoint}`);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});


import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import axios from "axios";
import { deleteSale, getAllSales, getSaleById, getSalesPage, sellPlant } from "../clients/sales.client.js";
import type { APIWorld } from "../support/world.js";
import { getPlantsById } from "../clients/plants.client.js";
import { readPretestIds } from "../../shared/utils/pretest-ids.js";

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

function requireToken(world: APIWorld): string {
  expect(world.authToken).toBeTruthy();
  const token = world.authToken;
  if (!token) throw new Error("Expected auth token");
  return token;
}

async function fetchPlantStockOrThrow(
  plantId: number,
  token: string
): Promise<number> {
  const plantResponse = await getPlantsById(token, plantId);
  const stock = extractStock(plantResponse.data);
  if (stock === null) {
    throw new TypeError(
      "Could not find a numeric stock/quantity field in GET plant response"
    );
  }
  return stock;
}

function recordSaleIdIfPresent(world: APIWorld, responseData: unknown) {
  if (!responseData || typeof responseData !== "object") return;
  const obj = responseData as Record<string, unknown>;
  const id = obj.id;
  if (typeof id === "string" || typeof id === "number") {
    world.createdSaleIds.push(String(id));
    world.createdSaleId = String(id);
  }
}

async function createSaleBestEffort(
  plantId: number,
  qty: number,
  token: string
): Promise<import("axios").AxiosResponse | null> {
  try {
    return await sellPlant(plantId, qty, token);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) return err.response;
    throw err;
  }
}

/** Get plant id from step param: use "pretest" for pretest-created plant, otherwise numeric id. */
function getPlantIdFromParam(world: APIWorld, plantIdParam: string): number {
  const normalized = plantIdParam.trim().toLowerCase();
  if (normalized === "pretest") {
    const id = world.createdPlantId ?? readPretestIds()?.plantId;
    if (id == null) {
      throw new Error(
        "Use @pretest on this scenario so the pretest creates a plant, or run pretest.feature first to populate pretest-ids.json"
      );
    }
    return Number(id);
  }
  return Number(plantIdParam);
}

//TC_API_002

Given(
  "plant with id {string} is in stock",
  async function (this: APIWorld, plantId: string) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");

    this.plantId = getPlantIdFromParam(this, plantId);
    this.lastResponse = await getPlantsById(token, this.plantId);
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

		this.plantId = getPlantIdFromParam(this, plantId);
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

    this.plantId = getPlantIdFromParam(this, plantId);
    if (this.initialPlantStock === null) {
      // Ensure we have a stock baseline even if the Given step was skipped/changed.
      const plantResponse = await getPlantsById(token, this.plantId);
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
    const plantResponse = await getPlantsById(token, this.plantId);
    const newStock = extractStock(plantResponse.data);
    if (newStock === null) {
      throw new Error(
        "Could not find a numeric stock/quantity field in GET plant response"
      );
    }
    expect(newStock).toBe(expected);
  }
);

//TC_API_003

When(
  "Admin requests the sales list",
  async function (this: APIWorld) {
    await requestSalesList.call(this);
  }
);

When(
  "User requests the sales list",
  async function (this: APIWorld) {
    await requestSalesList.call(this);
  }
);

// Reuse same implementation for both Admin/User
async function requestSalesList(this: APIWorld) {
  const token = requireToken(this);

  try {
    this.lastResponse = await getAllSales(token);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
}

Then("the sales list is returned", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const response = this.lastResponse;
  if (!response) throw new Error("Expected response");
  expect(response.status).toBe(200);

  const data = response.data as unknown;
  expect(Array.isArray(data)).toBe(true);
});

//TC_API_004

Given(
  "a sale exists for plant with id {string} and quantity {int}",
  async function (this: APIWorld, plantId: string, qty: number) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");

    this.plantId = getPlantIdFromParam(this, plantId);
    this.quantitySold = qty;

    // Best-effort: ensure plant exists and has some stock.
    try {
      const plantResponse = await getPlantsById(token, this.plantId);
      const stock = extractStock(plantResponse.data);
      if (stock !== null) this.initialPlantStock = stock;
    } catch {
      // Ignore; sellPlant will surface meaningful errors
    }

    try {
      this.lastResponse = await sellPlant(this.plantId, qty, token);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        this.lastResponse = err.response;
      } else {
        throw err;
      }
    }

    const response = this.lastResponse;
    if (!response) throw new Error("Expected response");
    expect(response.status).toBe(201);

    const data = response.data as Record<string, unknown>;
    const id = data.id;
    if (typeof id !== "string" && typeof id !== "number") {
      throw new TypeError("Expected created sale to include an id");
    }
    this.createdSaleId = String(id);
		this.createdSaleIds.push(this.createdSaleId);
  }
);

When("Admin deletes the sale", async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();
  const token = this.authToken;
  if (!token) throw new Error("Expected auth token");
  if (!this.createdSaleId) throw new Error("Expected createdSaleId");

  try {
    this.lastResponse = await deleteSale(this.createdSaleId, token);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      this.lastResponse = err.response;
    } else {
      throw err;
    }
  }
});

// TC_API_005

Given(
  "at least {int} sales exist for plant with id {string} and quantity {int}",
  async function (this: APIWorld, count: number, plantId: string, qty: number) {
    const token = requireToken(this);
    this.plantId = getPlantIdFromParam(this, plantId);
    this.quantitySold = qty;

    const stock = await fetchPlantStockOrThrow(this.plantId, token);
    this.initialPlantStock = stock;
    const required = count * qty;
    if (stock < required) {
      throw new RangeError(
        `Not enough stock for plant ${this.plantId}. Have ${stock}, need ${required}.`
      );
    }

    for (let i = 0; i < count; i++) {
      this.lastResponse = await createSaleBestEffort(this.plantId, qty, token);
      const response = this.lastResponse;
      if (!response) throw new Error("Expected response");
      if (response.status !== 201) break;
      recordSaleIdIfPresent(this, response.data);
    }
  }
);

When(
  "Admin requests sales page {int} with size {int} sorted by {string}",
  async function (this: APIWorld, page: number, size: number, sort: string) {
    const token = requireToken(this);

    const [field, dir] = sort.split(",").map(s => s.trim());
    const sortField = field || undefined;
    const sortDir = (dir === "asc" || dir === "desc") ? dir : undefined;

    try {
      this.lastResponse = await getSalesPage(page, size, token, sortField, sortDir);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) this.lastResponse = err.response;
      else throw err;
    }
  }
);

Then(
  "a paginated sales response is returned with max size {int}",
  async function (this: APIWorld, maxSize: number) {
    expect(this.lastResponse).not.toBeNull();
    const response = this.lastResponse;
    if (!response) throw new Error("Expected response");
    expect(response.status).toBe(200);

    const data = response.data as unknown;
    if (!data || typeof data !== "object") {
      throw new TypeError("Expected pagination response to be an object");
    }

    const obj = data as Record<string, unknown>;
    // Spring Page<T> uses `content`.
    expect(Array.isArray(obj.content)).toBe(true);
    const content = obj.content as unknown[];
    expect(content.length).toBeLessThanOrEqual(maxSize);

    // Optional sanity checks (only if present)
    if (obj.size !== undefined) expect(Number(obj.size)).toBe(maxSize);
    if (obj.number !== undefined) expect(Number(obj.number)).toBeGreaterThanOrEqual(0);
  }
);

// TC_API_007

When("User requests the sale by id", async function (this: APIWorld) {
  const token = requireToken(this);

  const idRaw = this.saleIdToFetch ?? this.createdSaleId;
  if (!idRaw) {
    throw new Error("Expected saleIdToFetch (run 'a valid sale id exists' first)");
  }

  try {
    this.lastResponse = await getSaleById(idRaw, token); 
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) this.lastResponse = err.response;
    else throw err;
  }
});

Then("the sale details are returned", async function (this: APIWorld) {
  const res = this.lastResponse;
  if (!res) throw new Error("No response found");
  const body = res.data as any;
  const id = body?.id ?? body?._id;
  if (!id) throw new Error("Sale details missing id");
});

// TC_API_008

When(
  "User requests sales page {int} with size {int}",
  async function (this: APIWorld, page: number, size: number) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");

    try {
      this.lastResponse = await getSalesPage(page, size, token);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        this.lastResponse = err.response;
      } else {
        throw err;
      }
    }
  }
);


// TC_API_009

When(
  "User requests the sale with invalid id {int}",
  async function (this: APIWorld, id: number) {
    expect(this.authToken).toBeTruthy();
    const token = this.authToken;
    if (!token) throw new Error("Expected auth token");

    try {
      this.lastResponse = await getSaleById(id, token);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        this.lastResponse = err.response; 
      } else {
        throw err;
      }
    }
  }
);

Then("an error response is returned", async function (this: APIWorld) {
  expect(this.lastResponse).not.toBeNull();
  const response = this.lastResponse;
  if (!response) throw new Error("Expected response");

  expect(hasAnyErrorField(response.data)).toBe(true);
});

function hasAnyErrorField(payload: unknown): boolean {
  if (payload == null) return false;

  // plain text errors
  if (typeof payload === "string") return payload.trim().length > 0;

  // JSON errors (common API/Spring shapes)
  if (typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    return (
      obj.message !== undefined ||
      obj.error !== undefined ||
      obj.errors !== undefined ||
      obj.path !== undefined ||
      obj.status !== undefined ||
      obj.timestamp !== undefined
    );
  }

  return false;
}

Given("a valid sale id exists", async function (this: APIWorld) {
  // Prefer pretest-created sale id (from world or pretest-ids.json)
  const fromPretest = this.createdSaleId ?? readPretestIds()?.saleId;
  if (fromPretest) {
    this.saleIdToFetch = fromPretest;
    return;
  }

  const token = requireToken(this);
  const res = await getAllSales(token);
  const data = res.data as unknown;

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Precondition failed: no sales exist to fetch a valid saleId");
  }

  const first = data[0] as any;
  const id = first?.id ?? first?._id;
  if (!id) throw new Error("Could not find sale id field in /api/sales response");

  this.saleIdToFetch = String(id);
});

Given("at least {int} sales exist", async function (this: APIWorld, count: number) {
  const token = requireToken(this);

  const res = await getAllSales(token);
  const data = res.data as unknown;

  if (!Array.isArray(data)) {
    throw new TypeError("Expected /api/sales to return an array");
  }

  if (data.length < count) {
    throw new Error(`Precondition failed: expected >= ${count} sales, but found ${data.length}`);
  }
});


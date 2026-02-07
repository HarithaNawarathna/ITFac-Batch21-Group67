import { Before } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import axios from "axios";
import fs from "fs";
import path from "path";
import { authenticateAdmin } from "../../api/clients/auth.client.js";
import { sellPlant } from "../../api/clients/sales.client.js";
import { ENV } from "../../config/env.js";
import { ROUTES } from "../../config/routes.js";
import type { APIWorld } from "../../api/support/world.js";
import { readPretestIds, writePretestIds } from "./pretest-ids.js";

const testdataDir = path.resolve("src/shared/testdata");

/** Run pretest only once (like BeforeAll). Use file as source of truth so it works even if the module is re-loaded. */
Before({ tags: "@pretest" }, async function (this: APIWorld) {
  const ids = readPretestIds();
  if (ids) {
    this.createdParentCategoryId = ids.parentCategoryId;
    this.createdCategoryId = ids.categoryId;
    this.createdPlantId = ids.plantId;
    this.createdSaleId = ids.saleId;
    this.createdSaleIds = [ids.saleId];
    await authenticateAdmin(this);
    return;
  }

  await authenticateAdmin(this);
  const token = this.authToken!;

  // 1. Create parent category – send category.json body as-is
  const categoryPayload = JSON.parse(
    fs.readFileSync(path.join(testdataDir, "category.json"), "utf-8")
  );
  let categoryResponse;
  try {
    categoryResponse = await axios.post(
      `${ENV.API_BASE_URL}${ROUTES.CATEGORIES}`,
      categoryPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.error("[pretest] Create parent category failed:", err.response.status, err.response.data);
    }
    throw err;
  }
  expect(categoryResponse.status).toBe(201);
  const parentCategoryData = categoryResponse.data as Record<string, unknown>;
  const parentCategoryId = parentCategoryData.id;
  this.createdParentCategoryId = String(parentCategoryId);

  // 2. Create subcategory with parent.id = parent category id (pretest-only format)
  const subcategoryPayload = {
    name: "Mango",
    parent: { id: parentCategoryId },
  };
  let subcategoryResponse;
  try {
    subcategoryResponse = await axios.post(
      `${ENV.API_BASE_URL}${ROUTES.CATEGORIES}`,
      subcategoryPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.error("[pretest] Create subcategory failed:", err.response.status, err.response.data);
    }
    throw err;
  }
  expect(subcategoryResponse.status).toBe(201);
  const subcategoryData = subcategoryResponse.data as Record<string, unknown>;
  const subcategoryId = String(subcategoryData.id);
  this.createdCategoryId = subcategoryId;

  // 3. Create plant under subcategory – use subcategory id from response
  const plantPayload = JSON.parse(
    fs.readFileSync(path.join(testdataDir, "plants.json"), "utf-8")
  ) as Record<string, unknown>;
  let plantResponse;
  try {
    plantResponse = await axios.post(
      `${ENV.API_BASE_URL}/api/plants/category/${subcategoryId}`,
      plantPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.error("[pretest] Create plant failed:", err.response.status, err.response.data);
    }
    throw err;
  }
  expect(plantResponse.status).toBe(201);
  const plantData = plantResponse.data as Record<string, unknown>;
  this.createdPlantId = String(plantData.id);

  // 4. Create sale (sell 1 of the plant) – POST /api/sales/plant/{plantId}?quantity=1
  const plantIdNum = Number(this.createdPlantId);
  const saleQty = 1;
  let saleResponse;
  try {
    saleResponse = await sellPlant(plantIdNum, saleQty, token);
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      console.error("[pretest] Create sale failed:", err.response.status, err.response.data);
    }
    throw err;
  }
  expect(saleResponse.status).toBe(201);
  const saleData = saleResponse.data as Record<string, unknown>;
  const saleId = saleData?.id ?? saleData?.saleId;
  if (saleId == null) {
    throw new Error("[pretest] Sale response missing id; got: " + JSON.stringify(saleData));
  }
  this.createdSaleId = String(saleId);
  this.createdSaleIds.push(this.createdSaleId);
  writePretestIds({
    parentCategoryId: this.createdParentCategoryId!,
    categoryId: this.createdCategoryId!,
    plantId: this.createdPlantId!,
    saleId: this.createdSaleId,
  });
  console.log(`[pretest] Created category ${subcategoryId} under parent ${parentCategoryId}, plant ${this.createdPlantId}, sale ${this.createdSaleId}`);
});
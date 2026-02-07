import { After, setDefaultTimeout } from "@cucumber/cucumber";
import * as dotenv from "dotenv";
import { deleteCategory } from "../clients/categories.client.js";
import { deletePlant } from "../clients/plants.client.js";
import { deleteSale } from "../clients/sales.client.js";
import type { APIWorld } from "./world.js";

dotenv.config();

setDefaultTimeout(10_000);

// After each scenario: call delete APIs in order 
After(async function (this: APIWorld, scenario) {
  const tags: string[] = scenario?.pickle?.tags?.map((t: { name: string }) => t.name) ?? [];
  if (tags.includes("@categoryCrud")) return;

  const token = this.authToken;
  if (!token) return;

  // 1. Delete sales (DELETE /api/sales/{id})
  if (this.createdSaleIds.length > 0) {
    for (const id of this.createdSaleIds) {
      try {
        await deleteSale(id, token);
      } catch {
        // Best-effort cleanup
      }
    }
  }

  // 2. Delete plant (DELETE /api/plants/{id})
  if (this.createdPlantId) {
    try {
      await deletePlant(token, Number(this.createdPlantId));
    } catch {
      // Best-effort cleanup
    }
  }

  // 3. Delete subcategory (DELETE /api/categories/{id})
  if (this.createdCategoryId) {
    try {
      await deleteCategory(this.createdCategoryId, token);
    } catch {
      // Best-effort cleanup
    }
  }

  // 4. Delete parent category (DELETE /api/categories/{id})
  if (this.createdParentCategoryId) {
    try {
      await deleteCategory(this.createdParentCategoryId, token);
    } catch {
      // Best-effort cleanup
    }
  }
});

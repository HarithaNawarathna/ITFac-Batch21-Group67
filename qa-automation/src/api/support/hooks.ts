import { After, setDefaultTimeout } from "@cucumber/cucumber";
import * as dotenv from "dotenv";
import { deleteCategory } from "../clients/categories.client.js";
import { deleteSale } from "../clients/sales.client.js";
import type { APIWorld } from "./world.js";

dotenv.config();

setDefaultTimeout(10_000);

// After each scenario: delete category if one was created (DELETE /api/categories/{id})
After(async function (this: APIWorld) {
  if (this.createdCategoryId && this.authToken) {
    try {
      await deleteCategory(this.createdCategoryId, this.authToken);
    } catch {
      // Best-effort cleanup; don't fail the test run
    }
  }

  if (this.createdSaleIds.length > 0 && this.authToken) {
    for (const id of this.createdSaleIds) {
      try {
        await deleteSale(id, this.authToken);
      } catch {
        // Best-effort cleanup; don't fail the test run
      }
    }
  }
});

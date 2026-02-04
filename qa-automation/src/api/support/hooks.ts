import { After, setDefaultTimeout } from "@cucumber/cucumber";
import * as dotenv from "dotenv";
import { deleteCategory } from "../clients/categories.client.js";
import type { APIWorld } from "./world.js";

dotenv.config();

setDefaultTimeout(10_000);

After(async function (this: APIWorld) {
  if (this.createdCategoryId && this.authToken) {
    try {
      await deleteCategory(this.createdCategoryId, this.authToken);
    } catch {
      // Best-effort cleanup; don't fail the test run
    }
  }
});

import { Given } from "@cucumber/cucumber";
import { readPretestIds } from "../../shared/utils/pretest-ids.js";
import type { UIWorld } from "../support/world.js";

/**
 * Load pretest-created IDs (category, plant, sale) into world state.
 * Use when UI scenarios need to reference data created by the API @pretest.
 *
 * Prerequisite: Run API tests with @pretest first so pretest-ids.json is written,
 * or run the same pretest setup before UI tests (e.g. a script that creates category/plant/sale and writes the file).
 *
 * After this step, use this.state.pretestIds in your steps, e.g.:
 *   - this.state.pretestIds?.plantId
 *   - this.state.pretestIds?.categoryId
 *   - this.state.pretestIds?.saleId
 */
Given("pretest data is available", async function (this: UIWorld) {
  const ids = readPretestIds();
  if (!ids) {
    throw new Error(
      "pretest-ids.json not found or invalid. Run API tests with @pretest first to create category, plant, and sale and write IDs to src/shared/testdata/pretest-ids.json"
    );
  }
  this.state.pretestIds = ids;
});

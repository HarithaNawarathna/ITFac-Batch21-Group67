import { Before } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { createCategory } from "../../api/clients/categories.client.js";
import type { APIWorld } from "../../api/support/world.js";

Before({ tags: "@categoryCrud" }, async function (this: APIWorld) {
  expect(this.authToken).toBeTruthy();

  const token = this.authToken!;

  const dataPath = path.resolve(
    "src/api/testdata/category.pretest.json"
  );

  const payload = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const response = await createCategory(payload.name, token);
  expect(response.status).toBe(201);
  const data = response.data as Record<string, unknown>;
  this.createdCategoryId = String(data.id);
});

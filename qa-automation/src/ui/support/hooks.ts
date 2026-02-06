import { After, Before, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";
import * as dotenv from "dotenv";
import type { UIWorld } from "./world.js";

dotenv.config();

// Allow time for browser launch and page loads (e.g. networkidle)
setDefaultTimeout(30_000);

Before(async function (this: UIWorld) {
  const headed =
    process.env.HEADED === "1" ||
    process.env.HEADED === "true" ||
    process.env.HEADED === "yes";
  this.browser = await chromium.launch({
    headless: !headed,
    slowMo: headed ? 100 : 0, // slight delay so you can see actions when headed
  });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: UIWorld) {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});

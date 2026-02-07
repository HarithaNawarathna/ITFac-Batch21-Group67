import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { UIWorld } from "../support/world.js";
import { DashboardPage } from "../pages/Dashboard/dashboard.page.js";

// ...existing code...

function getWorldPage(world: UIWorld) {
  const page = (world as unknown as { page?: any }).page;
  if (!page) throw new Error("UIWorld.page is not available. Check src/ui/support/world.ts");
  return page;
}

Then("the page title should contain {string}", async function (this: UIWorld, expected: string) {
  const page = getWorldPage(this);
  // give SPA a moment to update title if needed
  await expect
    .poll(async () => page.title(), { timeout: 10_000 })
    .toContain(expected);
});

When("I click on the categories navigation link", async function (this: UIWorld) {
  const page = getWorldPage(this);

  const navLink = page.getByRole("link", { name: /categories/i });
  await expect(navLink).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/categories/i, { timeout: 10_000 }).catch(() => {}),
    navLink.click(),
  ]);
});

When("I click on the plants navigation link", async function (this: UIWorld) {
  const page = getWorldPage(this);

  const navLink = page.getByRole("link", { name: /plants/i });
  await expect(navLink).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/plants/i, { timeout: 10_000 }).catch(() => {}),
    navLink.click(),
  ]);
});

Then("I should be on the plants page", async function (this: UIWorld) {
  const page = getWorldPage(this);
  await expect(page).toHaveURL(/\/plants/i);
});

When("I click on the sales navigation link", async function (this: UIWorld) {
  const page = getWorldPage(this);

  const navLink = page.getByRole("link", { name: /sales/i });
  await expect(navLink).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/sales/i, { timeout: 10_000 }).catch(() => {}),
    navLink.click(),
  ]);
});

Then("I should be on the sales page", async function (this: UIWorld) {
  const page = getWorldPage(this);
  await expect(page).toHaveURL(/\/sales/i);
});

When("I click the logout button", async function (this: UIWorld) {
  const page = getWorldPage(this);

  // Support either a button or link depending on UI implementation
  const logoutButton = page.getByRole("button", { name: /logout/i });
  const logoutLink = page.getByRole("link", { name: /logout/i });

  if (await logoutButton.isVisible().catch(() => false)) {
    await logoutButton.click();
  } else {
    await expect(logoutLink).toBeVisible();
    await logoutLink.click();
  }
});

Then("I should be redirected to the login page", async function (this: UIWorld) {
  const page = getWorldPage(this);
  await expect(page).toHaveURL(/\/login/i);
});

Given("I am not logged in", async function (this: UIWorld) {
  const page = getWorldPage(this);

  // Clear cookies + storage (best-effort)
  await page.context().clearCookies();
  await page.evaluate(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
  });
});

When("I try to access the dashboard directly", async function (this: UIWorld) {
  const page = getWorldPage(this);
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.navigateToDashboard();
});

Then("I should see the navigation menu", async function (this: UIWorld) {
  const page = getWorldPage(this);
  const nav = page.getByRole("navigation");
  await expect(nav).toBeVisible();
});

Then("the navigation menu should contain {string}", async function (this: UIWorld, item: string) {
  const page = getWorldPage(this);
  const nav = page.getByRole("navigation");
  await expect(nav).toBeVisible();
  await expect(nav.getByText(item, { exact: false })).toBeVisible();
});

When("I refresh the page", async function (this: UIWorld) {
  const page = getWorldPage(this);
  await page.reload();
});

Then("I should still be on the dashboard", async function (this: UIWorld) {
  const page = getWorldPage(this);
  await expect(page).toHaveURL(/\/dashboard/i);
});

Then("I should not be redirected to the login page", async function (this: UIWorld) {
  const page = getWorldPage(this);
  await expect(page).not.toHaveURL(/\/login/i);
});
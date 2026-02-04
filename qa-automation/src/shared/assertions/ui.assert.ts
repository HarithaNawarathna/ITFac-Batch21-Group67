import { Locator, expect } from "@playwright/test";

export async function expectBootstrapInvalidFeedback(locator: Locator) {
  await expect(locator).toBeVisible();

  const color = await locator.evaluate(el =>
    window.getComputedStyle(el).color
  );

  // Bootstrap danger color
  expect(
    ["rgb(220, 53, 69)", "rgb(255, 0, 0)"].includes(color),
    `Expected bootstrap red color, got ${color}`
  ).toBeTruthy();
}

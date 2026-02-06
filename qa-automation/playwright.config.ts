import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "http://localhost:8080/ui",
    headless: false,
    viewport: { width: 1280, height: 720 },
  },
});

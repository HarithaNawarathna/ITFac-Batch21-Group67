/** @type {import('@cucumber/cucumber').IConfiguration} */
export default {
  paths: ["src/api/features/**/*.feature"],
  tags: "not @skip",
  format: ["allure-cucumberjs/reporter"],
  formatOptions: { resultsDir: "reports/allure/api-results" },
  import: ["src/api/support/**/*.ts",
     "src/api/steps/**/*.ts",
     "src/shared/utils/pretests.ts",
     "src/shared/utils/posttests.ts"],
};

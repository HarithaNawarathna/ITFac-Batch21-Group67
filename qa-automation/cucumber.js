/** @type {import('@cucumber/cucumber').IConfiguration} */
export default {
  paths: ["src/ui/features/**/*.feature"],
  format: ["allure-cucumberjs/reporter"],
  formatOptions: { resultsDir: "reports/allure/ui-results" },
  import: ["src/ui/support/**/*.ts", "src/ui/steps/**/*.ts"],
};

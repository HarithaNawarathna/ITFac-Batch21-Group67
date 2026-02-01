/** @type {import('@cucumber/cucumber').IConfiguration} */
export default {
  paths: ["src/api/features/**/*.feature"],
  import: ["src/api/support/**/*.ts",
     "src/api/steps/**/*.ts"],
};

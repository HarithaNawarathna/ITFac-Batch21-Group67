/** @type {import('@cucumber/cucumber').IConfiguration} */
export default {
  paths: ["src/ui/features/**/*.feature"],
  import: ["src/ui/support/**/*.ts", "src/ui/steps/**/*.ts"],
};

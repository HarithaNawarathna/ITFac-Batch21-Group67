/** @type {import('@cucumber/cucumber').IConfiguration} */

export default {
  require: [
    'src/ui/steps/**/*.ts'
  ],
  paths: [
    'src/ui/features/**/*.feature'
  ],


  format: [
    'progress',
    'allure-cucumberjs/reporter'
  ],
  formatOptions: {
    resultsDir: 'reports/allure/ui-results'
  },

  publishQuiet: true
};

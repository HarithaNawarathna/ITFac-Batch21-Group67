/** @type {import('@cucumber/cucumber').IConfiguration} */

export default {
  require: [
    'src/api/steps/**/*.ts'
  ],
  paths: [
    'src/api/features/**/*.feature'
  ],

  format: [
    'progress',
    'allure-cucumberjs/reporter'
  ],
  formatOptions: {
    resultsDir: 'reports/allure/api-results'
  },

  publishQuiet: true
};

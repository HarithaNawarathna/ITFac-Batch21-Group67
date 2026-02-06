@ui @categories
Feature: Category CRUD

  Scenario: Navigate to category page
    Given I am logged in as admin
    When I navigate to the category page
    Then I should be on the category page

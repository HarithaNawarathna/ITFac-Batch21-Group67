@api @categories
Feature: Categories API

  Scenario: Create category with valid data
    Given Admin authenticated
    When I create a category with name "Plants"
    Then the response status is 201
    And the category is created successfully

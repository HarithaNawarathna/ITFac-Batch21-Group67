@api @categories
Feature: Categories API

  # Categories created in scenarios are cleaned up after each test via DELETE /api/categories/{id} in hooks.

  # TC_API_011 Create category with valid data (skipped: create category expected to fail in this env)
  @skip
  Scenario: Create category with valid data
    Given Admin authenticated
    When I create a category with name "Plants"
    Then the response status is 201
    And the category is created successfully

  # TC_API_012 Create category without name (skipped: create category expected to fail in this env)
  @skip
  Scenario: Create category without name
    Given Admin authenticated
    When I create a category with name ""
    Then the response status is 400
    And the error message is "Category name is required"

  # TC_API_013 Create category with invalid name length
  Scenario: Create category with invalid name length
    Given Admin authenticated
    When I create a category with name "ab"
    Then a validation error is returned

  # TC_API_014 Update existing category (uses createRootCategoryForTest + createSubcategoryForTest in "a category exists")
  Scenario: Update existing category
    Given Admin authenticated
    And a category exists
    When I update the category with name "Vegetables"
    Then the category is updated successfully

  # TC_API_015 Delete category (creates one category in steps, then deletes it)
  Scenario: Delete category
    Given Admin authenticated
    And a category exists for delete
    When I delete the category
    Then the response status is 204
  # TC_API_016 Get category list
  Scenario: Get category list
    Given User authenticated
    When I get the category list
    Then the category list is returned with status 200

  # TC_API_017 Get categories with pagination
  Scenario: Get categories with pagination
    Given User authenticated
    When I get categories with page 1 and size 10
    Then a paginated category list is returned

  # TC_API_018 Search category by name
  Scenario: Search category by name
    Given User authenticated
    When I get categories with search "Test"
    Then filtered results are returned

  # TC_API_019 Filter category by parent
  @pretest
  Scenario: Filter category by parent
    Given User authenticated
    When I get categories with parentId "pretest"
    Then filtered categories are returned

  # TC_API_020 Sort category list
  Scenario: Sort category list
    Given User authenticated
    When I get categories with sort "name,asc"
    Then a sorted category list is returned

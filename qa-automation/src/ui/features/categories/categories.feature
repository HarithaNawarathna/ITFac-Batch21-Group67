@ui @categories
Feature: Categories

  Scenario: Navigate to category page
    Given I am logged in as admin
    When I navigate to the category page
    Then I should be on the category page

  # TC_UI_11 View Add Category button
  Scenario: View Add Category button
    Given I am logged in as admin
    When I navigate to the category page
    Then the Add Category button is visible and enabled

  # TC_UI_12 Add category with valid data
  Scenario: Add category with valid data
    Given I am logged in as admin
    When I navigate to the category page
    And I click Add Category
    And I enter category name "Flowers"
    And I click Save on the category form
    Then a success message is displayed for the category
    And I delete the first category

  # TC_UI_13 Add category without name
  Scenario: Add category without name
    Given I am logged in as admin
    When I navigate to the category page
    And I click Add Category
    And I leave the category name empty
    And I click Save on the category form
    Then a validation message is displayed saying the name is required

  # TC_UI_14 Edit category
  Scenario: Edit category
    Given I am logged in as admin
    And at least one category exists
    When I navigate to the category page
    And I click Edit on the first category
    And I modify the category name to "Fruits"
    And I click Save on the category form
    Then a category updated successfully message is shown

  # TC_UI_16 Delete category
  Scenario: Delete category
    Given I am logged in as admin
    And at least one category exists
    When I navigate to the category page
    And I click Delete on the first category
    Then a category deleted successfully message is shown
    And the category list is displayed

  # TC_UI_17 View category list
  Scenario: View category list
    Given I am logged in as user
    When I navigate to the category page
    Then the category list is displayed

  # TC_UI_18 Reset search results
  Scenario: Reset search results
    Given I am logged in as user
    When I navigate to the category page
    And I apply search filter "test"
    And I click Reset
    Then the category list is displayed

  # TC_UI_19 Edit action disabled
  Scenario: Edit action disabled
    Given I am logged in as user
    When I navigate to the category page
    Then the Edit option is hidden

  # TC_UI_20 Delete action disabled
  Scenario: Delete action disabled
    Given I am logged in as user
    When I navigate to the category page
    Then the Delete option is hidden

  # TC_UI_21 Unauthorized Add Category access
  Scenario: Unauthorized Add Category access
    Given I am logged in as user
    When I access Add Category page directly
    Then I am shown 403 or Access Denied

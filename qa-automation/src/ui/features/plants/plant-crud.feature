@ui @plants
Feature: Plant List

  Scenario: Admin can view the plant list
    Given I am logged in as admin
    When I navigate to the plants page
    Then I should see the plant list displayed
    And the plant table should have correct headers
    And all existing plants should be visible with correct details

  Scenario: Navigate to Add Plant page
    Given I am logged in as admin
    When I navigate to the plants page
    And I click the Add Plant button
    Then I should be on the Add Plant page
    And all required input fields should be visible
    And the Save button should be visible

  Scenario: Add new plant with valid data
    Given I am logged in as admin
    When I navigate to the plants page
    And I click the Add Plant button
    And I enter valid plant details
      | name       | category | price  | quantity |
      | Vff Plant | AsusLap  | 25.99  | 50       |
    And I click Save
    Then I should see an add success message
    And the new plant should appear in the plant list

Scenario: Edit existing plant
    Given I am logged in as admin
    And I navigate to the plants page
    When I select an existing plant to edit and click edit button
    Then I should be on the Edit Plant page
    When I modify plant details
      | name          | category | price  | quantity |
      | Kll Plant | AsusLap  | 35.99  | 75       |
    And I click Save button
    Then I should see an edit success message
    And the updated plant details should be reflected in the plant list

  Scenario: Delete existing plant
    Given I am logged in as admin
    And I navigate to the plants page
    When I select an existing plant to delete and click delete button
    And I confirm the deletion
    Then I should see a delete success message
    And the deleted plant should no longer be displayed in the plant list
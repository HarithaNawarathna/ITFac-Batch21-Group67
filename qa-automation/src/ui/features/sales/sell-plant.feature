@ui @sales
Feature: Sell Plant Validation

Background:
  Given I am logged in as "admin"
  Then I should be logged in successfully

  @TC_UI_004
  Scenario: TC_UI_004 - Submit Sell Plant form with invalid inputs
    When I navigate to the sell plant page
    And I submit the sell plant form with quantity 0 and no plant
    Then I should see quantity validation alert
    When I submit the sell plant form with quantity > 0 and no plant
    Then I should see plant required validation error

  @TC_UI_006
  Scenario: TC_UI_006 - Successful plant sale reduces inventory
    Given I navigate to the sell plant page
    When I select a plant with stock greater than or equal to 1
    And I enter a valid quantity
    And I click the Sell button
    Then the sale should be saved successfully
    And I should be redirected to the sales list page
    And the plant stock should be reduced

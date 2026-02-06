@ui @sales @permissions
Feature: Sales permissions

  @TC_UI_003
  Scenario: TC_UI_003 - Sell Plant button visible for admin
    Given I am logged in as "admin"
    Then I should be logged in successfully
    When I navigate to the sales page
    Then I should see sell plant button

  @TC_UI_010
  Scenario: TC_UI_010 - Restricted actions visibility for user role
    Given I am logged in as "user"
    Then I should be logged in successfully
    When I navigate to the sales page
    Then I should not see sell plant button
    And I should not see delete action on sales rows

@ui @sales @permissions
Feature: Sales permissions

  @tc003
  Scenario: TC_UI_003 Sell Plant button visible for admin
    Given I am logged in as "admin"
    Then I should be logged in successfully
    When I navigate to the sales page
    Then I should see sell plant button

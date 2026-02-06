@ui @auth
Feature: Logout UI

  Background:
    Given I am logged in as user

  Scenario: Successful logout as user
    When I logout as "user"
    Then I should be redirect to login page

  Scenario: Successful logout shows success message
    When I logout as "user"
    Then I should see success Message as "You have been logged out successfully."

  Scenario: Logout button should be visible on left nav bar in any page
    Then the logout button should be visible

  Scenario: Logout button should be enabled on left nav bar in any page
    Then the logout button should be enabled

  Scenario: Logout button should have correct text
    Then the logout button should have text "Logout"

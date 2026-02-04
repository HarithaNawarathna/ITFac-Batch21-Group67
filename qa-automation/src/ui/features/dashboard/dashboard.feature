@ui @dashboard
Feature: Dashboard UI Tests

  # TC_UI_22: Dashboard Load After Admin Login
  @TC_UI_22
  Scenario: Admin dashboard loads successfully after login
    Given I am on the login page
    When I login as "admin"
    Then I should be on the dashboard
    And the page title should contain "Dashboard"
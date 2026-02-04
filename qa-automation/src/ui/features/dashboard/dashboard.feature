@ui @dashboard
Feature: Dashboard UI Tests

  # TC_UI_22: Dashboard Load After Admin Login
  @TC_UI_22
  Scenario: Admin dashboard loads successfully after login
    Given I am on the login page
    When I login as "admin"
    Then I should be on the dashboard
    And the page title should contain "Dashboard"

# TC_UI_23: Dashboard Load After User Login
  @TC_UI_23
  Scenario: User dashboard loads successfully after login
    Given I am on the login page
    When I login as "user"
    Then I should be on the dashboard
    And the page title should contain "Dashboard"

# TC_UI_24: Dashboard Navigation to Categories
  @TC_UI_24
  Scenario: Admin can navigate from dashboard to categories page
    Given I am logged in as admin
    When I click on the categories navigation link
    Then I should be on the category page

 # TC_UI_25: Dashboard Navigation to Plants
  @TC_UI_25
  Scenario: Admin can navigate from dashboard to plants page
    Given I am logged in as admin
    When I click on the plants navigation link
    Then I should be on the plants page
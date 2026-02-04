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

# TC_UI_26: Dashboard Navigation to Sales
  @TC_UI_26
  Scenario: Admin can navigate from dashboard to sales page
    Given I am logged in as admin
    When I click on the sales navigation link
    Then I should be on the sales page

# TC_UI_27: Dashboard Logout Functionality
  @TC_UI_27
  Scenario: User can logout from dashboard
    Given I am logged in as admin
    When I click the logout button
    Then I should be redirected to the login page

  # TC_UI_28: Dashboard URL Protection
  @TC_UI_28
  Scenario: Unauthenticated user cannot access dashboard directly
    Given I am not logged in
    When I try to access the dashboard directly
    Then I should be redirected to the login page

# TC_UI_29: Dashboard Displays Navigation Menu
  @TC_UI_29
  Scenario: Dashboard displays navigation menu with all sections
    Given I am logged in as admin
    Then I should see the navigation menu
    And the navigation menu should contain "Categories"
    And the navigation menu should contain "Plants"
    And the navigation menu should contain "Sales"

# TC_UI_30: Dashboard Session Persistence
  @TC_UI_30
  Scenario: Dashboard maintains session after page refresh
    Given I am logged in as admin
    When I refresh the page
    Then I should still be on the dashboard
    And I should not be redirected to the login page
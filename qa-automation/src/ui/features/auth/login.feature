@ui @auth
Feature: Login UI

  Background:
    Given I am on the login page

  Scenario: Username is required validation
    When I submit login with empty username
    Then I should see username validation message "Username is required"

  Scenario: Password is required validation
    When I submit login with empty password
    Then I should see password validation message "Password is required"

  Scenario: Invalid login displays a global error message
    When I login with invalid username or invalid password
    Then I should see a global error message "Invalid username or password."

  Scenario: Successful login as user
    When I login as "user"
    Then I should be on the dashboard

  Scenario: Login button should be visible on login page
    Then the login button should be visible

  Scenario: Login button should be enabled on login page
    Then the login button should be enabled

  Scenario: Login button should have correct text
    Then the login button should have text "Login"

  Scenario: API 400 bad request displays error alert
    When I login with invalid username or invalid password
    Then I should see an error alert with message "Invalid username or password."
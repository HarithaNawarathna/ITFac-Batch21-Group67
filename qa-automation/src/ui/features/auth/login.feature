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

  Scenario: Successful login as user
    When I login as "user"
    Then I should be on the dashboard

@api @auth
Feature: Login API

  Scenario: Verify that user can authenticate and receive a valid token using multiple credentials
    When I login via API with following credentials
      | username | password  |
      | admin    | admin123  |
      | testuser | test123   |
    Then each login response status should be 200
    And each response should contain a token

  Scenario: Verify that login with invalid credentials return 401 using multiple inputs
    When I login via API with following credentials
      | username    | password    |
      | invaliduser | invalidPass |
      | testuser    | wrongpass   |
    Then each login response status should be 401

  Scenario: Verify that login with empty credentials return 401 using multiple inputs
    When I login via API with following credentials
      | username | password |
      |          | test123  |
      | testuser |          |
      |          |          |
    Then each login response status should be 401

  Scenario: Verify login for multiple user roles and role-specific claims
  When I login via API with following credentials
    | username  | password   | expectedRole |
    | admin     | admin123   | admin        |
    | testuser  | test123    | user         |
  Then each login response status should be 200
  And each response token should contain the correct role
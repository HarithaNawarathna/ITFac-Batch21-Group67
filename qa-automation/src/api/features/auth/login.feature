@api @auth
Feature: Login API

  Scenario: Successful login returns token
    When I login via API as "user"
    Then the login response status is 200
    And the response contains a token

  Scenario: Invalid credentials return 401
    When I login via API with username "baduser" and password "badpass"
    Then the login response status is 401

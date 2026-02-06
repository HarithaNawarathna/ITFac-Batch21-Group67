@api @auth
Feature: Login API

  Scenario: Verify that user can authenticate and receive a valid token using multiple credentials
    When I login via API with following credentials
      | username | password  |
      | admin    | admin123  |
      | testuser | test123   |
    Then each login response status should be 200
    And each response should contain a token

  Scenario: Verify that invalid credentials return 401 Bad Request using multiple inputs
    When I login via API with invalid credentials
      | username     | password     |
      | invaliduser  | invalidPass  |
      |              | test123      |
      | testuser     |              |
      |              |              |
    Then each login response status should be 401
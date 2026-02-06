@api @health
Feature: Health API

  Scenario: TC_API_010 - Check application health status
    Given User authenticated
    When I request the application health endpoint
    Then the health response status is 200
    And the health response indicates the application is healthy
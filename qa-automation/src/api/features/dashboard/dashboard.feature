@api @dashboard
Feature: Dashboard API Tests

  # TC_API_32: Health Check Endpoint (Requires Auth)
  @TC_API_32
  Scenario: API health check returns 200 OK when authenticated
    Given Admin authenticated
    When I send a GET request to the health endpoint
    Then the API response status should be 200

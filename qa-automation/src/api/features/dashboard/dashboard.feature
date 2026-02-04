@api @dashboard
Feature: Dashboard API Tests

  # TC_API_32: Health Check Endpoint (Requires Auth)
  @TC_API_32
  Scenario: API health check returns 200 OK when authenticated
    Given Admin authenticated
    When I send a GET request to the health endpoint
    Then the API response status should be 200

     # TC_API_33: Plant Summary Endpoint for Admin
  @TC_API_33
  Scenario: Admin can fetch plant summary for dashboard
    Given Admin authenticated
    When I send a GET request to the plants summary endpoint
    Then the API response status should be 200
    And the response should contain "totalPlants"
    And the response should contain "lowStockPlants"

    # TC_API_34: Category Summary Endpoint for Admin
  @TC_API_34
  Scenario: Admin can fetch category summary for dashboard
    Given Admin authenticated
    When I send a GET request to the categories summary endpoint
    Then the API response status should be 200

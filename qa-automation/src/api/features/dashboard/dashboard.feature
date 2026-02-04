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

# TC_API_35: Get All Categories for Dashboard Display
  @TC_API_35
  Scenario: Admin can fetch all categories for dashboard
    Given Admin authenticated
    When I send a GET request to the categories endpoint
    Then the API response status should be 200
    And the response should be an array

# TC_API_36: Get All Plants for Dashboard Display
  @TC_API_36
  Scenario: Admin can fetch all plants for dashboard
    Given Admin authenticated
    When I send a GET request to the plants endpoint
    Then the API response status should be 200

# TC_API_37: Get All Sales for Dashboard Display
  @TC_API_37
  Scenario: Admin can fetch all sales for dashboard
    Given Admin authenticated
    When I send a GET request to the sales endpoint
    Then the API response status should be 200
    And the response should be an array

# TC_API_38: Unauthorized Access Returns 401
  @TC_API_38
  Scenario: Unauthenticated request to categories returns 401
    Given I am not authenticated
    When I send a GET request to the categories endpoint without auth
    Then the API response status should be 401

# TC_API_39: Read-Only User Can Fetch Categories
  @TC_API_39
  Scenario: Read-only user can fetch categories for dashboard
    Given User authenticated
    When I send a GET request to the categories endpoint
    Then the API response status should be 200
    And the response should be an array

# TC_API_40: Read-Only User Cannot Create Category
  @TC_API_40
  Scenario: Read-only user cannot create category (bad request)
    Given User authenticated
    When I try to create a category with name "TestForbidden"
    Then the API response status should be 400
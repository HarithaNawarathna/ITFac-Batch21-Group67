@api @auth @sales @pretest
Feature: Sales API

  # Uses pretest-created category, plant, and sale (see pretest.feature / @pretest Before hook).
  # Plant/sale IDs: use "pretest" in steps to use created IDs, or numeric id for ad-hoc data.

  Scenario: TC_API_001 - Admin can sell a plant via API
    Given Admin authenticated
    And plant with id "pretest" is in stock
    When Admin sells plant with id "pretest" and quantity 2
    Then the sales response status is 201
    And the sale is created successfully
    And the plant stock is reduced

  Scenario: TC_API_002 - Create sale exceeding stock
    Given Admin authenticated
    And plant with id "pretest" is in stock
    When Admin sells plant with id "pretest" with quantity exceeding stock
    Then the sales response status is 400

  Scenario: TC_API_003 - Get sales list
    Given Admin authenticated
    When Admin requests the sales list
    Then the sales response status is 200
    And the sales list is returned

  Scenario: TC_API_004 - Delete sale
    Given Admin authenticated
    And a sale exists for plant with id "pretest" and quantity 1
    When Admin deletes the sale
    Then the sales response status is 204

  Scenario: TC_API_005 - Pagination API
    Given Admin authenticated
    And at least 6 sales exist for plant with id "pretest" and quantity 1
    When Admin requests sales page 0 with size 5 sorted by "soldAt,desc"
    Then the sales response status is 200
    And a paginated sales response is returned with max size 5

  Scenario: TC_API_006 - User can retrieve sales list via API
    Given User authenticated
    When User requests the sales list
    Then the sales response status is 200
    And the sales list is returned

  Scenario: TC_API_007 - Get sale by valid ID
    Given User authenticated
    And a valid sale id exists
    When User requests the sale by id
    Then the sales response status is 200
    And the sale details are returned

  Scenario: TC_API_008 - Get sales with pagination
    Given User authenticated
    And at least 6 sales exist
    When User requests sales page 0 with size 5
    Then the sales response status is 200
    And a paginated sales response is returned with max size 5

  Scenario: TC_API_009 - Get sale by Invalid ID
    Given User authenticated
    When User requests the sale with invalid id 99999999
    Then the sales response status is 404
    And an error response is returned

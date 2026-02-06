@api @plants
Feature: Plants API

  Scenario: TC_API_31 - View plant list
    Given Admin authenticated
    When I send GET request to "/api/plants"
    Then the response status is 200
    And the plant list is returned in response body

 Scenario: TC_API_32 - Create plant with valid data
    Given Admin authenticated
    When I create a plant with valid details
        | name    | categoryId | price | quantity |
        | Fern    | 4          | 5000    | 10      |
    Then the response status is 201
    And the plant is created successfully

 Scenario: TC_API_33 - Create plant with empty fields
    Given Admin authenticated
    When I create a plant with empty name
        | name | categoryId | price | quantity |
        |      | 4          | 50    | 100      |
    Then the response status is 400
    And validation error message is displayed

 Scenario: TC_API_34 - Update plant details
    Given Admin authenticated
    And a plant exists with ID 31
    When I update plant details
        | id | name       | price | quantity |
        | 31  | Golden Pothos | 60    | 150      |
    Then the response status is 200
    And the updated plant details are returned

 Scenario: TC_API_35 - Delete plant
    Given Admin authenticated
    And a plant exists with ID 48
    When I delete plant with ID 48
    Then the response status is 204
    And plant is removed from database
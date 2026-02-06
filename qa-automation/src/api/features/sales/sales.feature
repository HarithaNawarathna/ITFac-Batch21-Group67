@api @auth @sales
Feature: Sales API

  Scenario: TC_API_001 - Admin can sell a plant via API
    Given Admin authenticated
    And plant with id "4" is in stock
    When Admin sells plant with id "4" and quantity 2
    Then the sales response status is 201
    And the sale is created successfully
    And the plant stock is reduced

  Scenario: TC_API_002 - Create sale exceeding stock
    Given Admin authenticated
    And plant with id "4" is in stock
    When Admin sells plant with id "4" with quantity exceeding stock
    Then the sales response status is 400

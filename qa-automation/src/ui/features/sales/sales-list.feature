@ui @sales
Feature: Sales List

  @TC_UI_001
  Scenario: TC_UI_001 - View sales list (Admin)
    Given I am logged in as "admin"
    Then I should be logged in successfully
    When I navigate to the sales page
    Then I should see the sales list
    And I should see pagination controls

  @TC_UI_002
  Scenario: TC_UI_002 - Default sorting by sold date DESC (Admin)
    Given I am logged in as "admin"
    Then I should be logged in successfully
    When I navigate to the sales page
    Then sales should be sorted by sold date descending

  @TC_UI_005
  Scenario: TC_UI_005 - Delete sale with confirmation (Admin)
    Given I am logged in as "admin"
    Then I should be logged in successfully
    When I navigate to the sales page
    Then I should see the sales list
    When I delete the first sale and confirm
    Then the sale should be removed from the list

  @TC_UI_007
  Scenario: TC_UI_007 - View sales list (User)
    Given I am logged in as "user"
    Then I should be logged in successfully
    When I navigate to the sales page
    Then I should see the sales list
    And I should see pagination controls if there are multiple pages

  @TC_UI_008
  Scenario: TC_UI_008 - Default sorting by sold date DESC (User)
    Given I am logged in as "user"
    Then I should be logged in successfully
    When I navigate to the sales page
    Then sales should be sorted by sold date descending

  @TC_UI_009
  Scenario: TC_UI_009 - Verify sorting options (User)
    Given I am logged in as "user"
    Then I should be logged in successfully
    When I navigate to the sales page
    Then I should see the sales list
    When I click the Plant column header
    Then the sales should be sorted by plant name
    When I click the Quantity column header
    Then the sales should be sorted by quantity
    When I click the Total Price column header
    Then the sales should be sorted by total price

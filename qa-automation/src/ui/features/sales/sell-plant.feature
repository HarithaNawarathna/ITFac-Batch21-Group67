Feature: Sell Plant Validation

Background:
  Given I am logged in as "admin"
  Then I should be logged in successfully

@tc004
Scenario: TC_UI_004 - Submit Sell Plant form with invalid inputs
  When I navigate to the sell plant page

  And I submit the sell plant form with quantity 0 and no plant
  Then I should see quantity validation alert

  When I submit the sell plant form with quantity > 0 and no plant
  Then I should see plant required validation error

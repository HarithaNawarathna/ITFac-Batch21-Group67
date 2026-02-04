@ui @sales @tc001
Feature: Sales List

  Scenario: TC_UI_001 Admin can view sales list
  
    Given I am logged in as "admin"
    When I navigate to the sales page
    Then I should see the sales list
    And I should see pagination controls

@ui @sales @tc002
Scenario: TC_UI_002 Default sorting by sold date DESC
  Given I am logged in as "admin"
  When I navigate to the sales page
  Then sales should be sorted by sold date descending



@ui @plants @user
Feature: User Plant Access

  Scenario: TC_UI_38 - Normal user can view the plant list in read-only mode
    Given I am logged in as user
    When I navigate to the plants page
    Then I should see the plant list displayed

  Scenario: TC_UI_39 - Normal user cannot see Add Plant button
    Given I am logged in as user
    When I navigate to the plants page
    Then the Add Plant button should not be visible

  Scenario: TC_UI_40 - Normal user cannot see Edit Plant option
    Given I am logged in as user
    When I navigate to the plants page
    Then the Edit buttons should not be visible

  Scenario: TC_UI_41 - Normal user cannot see Delete Plant option
    Given I am logged in as user
    When I navigate to the plants page
    Then the Delete buttons should not be visible

  Scenario: TC_UI_42 - Normal user cannot access Add Plant page using direct URL
    Given I am logged in as user
    When I manually navigate to "/ui/plants/add"
    Then I should be redirected to Access Denied page

  Scenario: TC_UI_43 - Normal user cannot access Edit Plant page using direct URL
    Given I am logged in as user
    When I manually navigate to "/ui/plants/edit/1"
    Then I should be redirected to Access Denied page
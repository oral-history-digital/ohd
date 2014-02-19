Feature: category search - by name

  In order to conveniently find interviews even if only part of the interviewee name is known
  historians want to find interviews by interviewee name through an autocomplete search field.


  @wip
  Scenario: interviewee name search with autocomplete

    Given I have a ZWAR user account
    And I am logged in
    And I am on the start page

    When I click on the interviewee name facet in the search sidebar
    And there I do enter part of an interviewee name into the name search box
    And I select the full name of the interviewee from the list and press the enter key

    Then I should see the selected interview on the search results page in the results list

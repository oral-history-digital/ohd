Feature: create account

  In order to protect their privacy interviewees want their data to be protected
  behind a secure login.


  Scenario: register a new user

    Given I am on the login page

    When I follow the "registration" link
    And I do fill in all required fields on the registration page
    And I press the "send registration" button

    Then I should be on the registration confirmation page
    And there I should see a success message

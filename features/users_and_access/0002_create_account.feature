Feature: create account

  In order to protect their privacy interviewees want their data to be protected
  behind a secure login.

  Background:

    Given I am on the start page

  Scenario: register a new user

    When I follow "Anmelden"
    And I follow "Zur Registrierung"
    And I fill in the required fields while on the registration page
    And I press "Registrierung senden"

    Then I should be on the registration confirmation page
    And I should see a success message on the registration confirmation page

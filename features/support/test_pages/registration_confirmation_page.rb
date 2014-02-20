class TestPages::RegistrationConfirmationPage < TestPages::ApplicationPage
  def path
    '/anmeldung/user_registrations'
  end

  def a_success_message_element
    'h1:contains("Ihre Registrierung ist eingegangen")'
  end
end

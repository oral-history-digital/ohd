class TestPages::RegistrationConfirmationPage < TestPages::ApplicationPage
  def path
    '/anmeldung/user_registrations'
  end

  def a_success_message
    'Ihre Registrierung ist eingegangen'
  end
end

module TestPages
  class RegistrationConfirmationPage < Page
    def path
      '/anmeldung/user_registrations'
    end

    def a_success_message
      'Ihre Registrierung ist eingegangen'
    end
  end
end

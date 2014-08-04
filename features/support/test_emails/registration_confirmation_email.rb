module TestEmails
  class RegistrationConfirmationEmail < Email
    attr_accessor :recipient

    def subject
      /whatever/
    end

    def body
      /whatever/
    end
  end
end

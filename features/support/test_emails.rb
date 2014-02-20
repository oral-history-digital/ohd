module TestEmails
  def get_email_by_name(email_name)
    email_parts = email_name.split(/\s+/) << 'email'
    "::TestEmails::#{email_parts.join('_').camelize}".constantize.new
  end

  class Email
  end
end

World(TestEmails)

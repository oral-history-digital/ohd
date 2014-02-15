module TestEmails
  def get_email_by_name(email_name)
    email_parts = email_name.split(/\s+/) << 'email'
    "::TestEmails::#{email_parts.join('_').camelize}".constantize.instance
  end
  module_function :get_email_by_name

  require 'singleton'
  class Email
    include ::Singleton
  end
end

World(TestEmails)

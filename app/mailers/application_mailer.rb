class ApplicationMailer < ActionMailer::Base
  default from: Project.contact_email
  layout 'mailer'
end


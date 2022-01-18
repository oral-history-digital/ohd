class CustomDeviseMailer < Devise::Mailer
  helper :application # gives access to all helpers defined within `application_helper`.
  include Devise::Controllers::UrlHelpers # Optional. eg. `confirmation_url`
  default template_path: 'devise/mailer' # to make sure that your mailer uses the devise views
  # If there is an object in your application that returns a contact email, you can use it as follows
  # Note that Devise passes a Devise::Mailer object to your proc, hence the parameter throwaway (*).
  #default from: ->(*) { Class.instance.email_address }

  def project_access_granted(record, opts={})
    @project = opts[:project]
    opts[:from] = @project.contact_email
    opts[:reply_to] = @project.contact_email
    devise_mail(record, :project_access_granted, opts)
  end

  def project_access_rejected(record, opts={})
    @project = opts[:project]
    opts[:from] = @project.contact_email
    opts[:reply_to] = @project.contact_email
    devise_mail(record, :project_access_rejected, opts)
  end

  def account_deactivated(record, opts={})
    @project = opts[:project]
    opts[:from] = @project.contact_email
    opts[:reply_to] = @project.contact_email
    devise_mail(record, :account_deactivated, opts)
  end

  def confirmation_instructions(record, token, opts={})
    @token = token
    @project = record.projects.first
    contact_email = @project ? @project.contact_email : 'mail@oral-history.digital'
    opts[:from] = contact_email
    opts[:reply_to] = contact_email
    devise_mail(record, :confirmation_instructions, opts)
  end

  def reset_password_instructions(record, token, opts={})
    @token = token
    @project = opts[:project]
    opts[:from] = @project.contact_email
    opts[:reply_to] = @project.contact_email
    devise_mail(record, :reset_password_instructions, opts)
  end
end

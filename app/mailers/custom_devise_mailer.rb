class CustomDeviseMailer < Devise::Mailer
  helper :application # gives access to all helpers defined within `application_helper`.
  include Devise::Controllers::UrlHelpers # Optional. eg. `confirmation_url`
  default template_path: 'devise/mailer' # to make sure that your mailer uses the devise views
  # If there is an object in your application that returns a contact email, you can use it as follows
  # Note that Devise passes a Devise::Mailer object to your proc, hence the parameter throwaway (*).
  #default from: ->(*) { Class.instance.email_address }

  def access_mail(record, opts={})
    @project = opts[:project]
    @user_project = opts[:user_project]
    opts[:from] = @project.contact_email
    opts[:reply_to] = @project.contact_email
    devise_mail(record, :access_mail, opts)
  end

  def confirmation_instructions(record, token, opts={})
    @token = token

    domain = OHD_DOMAIN
    contact_email = 'mail@oral-history.digital'
    locale = 'de'
    @project_name = 'Oral-History.Digital'
    @application_type = :interview_portal 

    if record.unconfirmed_email
      @url = "#{domain}/#{locale}/users/#{record.id}/confirm_new_email?confirmation_token=#{record.confirmation_token}"
    else
      @url = "#{domain}/#{locale}/users/confirmation?confirmation_token=#{record.confirmation_token}"
    end

    opts[:from] = contact_email
    opts[:reply_to] = contact_email
    devise_mail(record, :confirmation_instructions, opts)
  end

  def reset_password_instructions(record, token, opts={})
    token = token
    project = opts[:project]

    domain = OHD_DOMAIN
    contact_email = 'mail@oral-history.digital'
    locale = 'de'
    @project_name = 'Oral-History.Digital'

    @url = "#{domain}/#{locale}/users/password/edit?reset_password_token=#{token}"

    opts[:from] = contact_email
    opts[:reply_to] = contact_email
    devise_mail(record, :reset_password_instructions, opts)
  end

  def email_changed(record, opts={})
    devise_mail(record, :email_changed, opts)
  end

end

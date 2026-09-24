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

    devise_opts = {}
    devise_opts[:from] = @project.contact_email
    devise_opts[:reply_to] = @project.contact_email
    devise_opts[:subject] = opts[:subject] if opts[:subject]

    devise_mail(record, :access_mail, devise_opts)
  end

  def confirmation_instructions(record, token, opts={})
    return if ['removed', 'blocked'].include?(record.workflow_state)
    @token = token

    umbrella = Project.umbrella
    domain = OHD_DOMAIN
    contact_email = umbrella.contact_email
    locale = record.default_locale || 'de'
    @project_name = InstanceSetting.current.umbrella_project_brand_name(locale)
    @application_type = :interview_portal 

    if record.unconfirmed_email
      @url = "#{domain}/#{locale}/users/#{record.id}/confirm_new_email?confirmation_token=#{record.confirmation_token}"
      opts[:subject] = TranslationValue.for('devise.mailer.new_email_confirmation_instructions.subject', locale, umbrella_project_name: @project_name)
    else
      @url = "#{domain}/#{locale}/users/confirmation?confirmation_token=#{record.confirmation_token}"
      opts[:subject] = TranslationValue.for('devise.mailer.confirmation_instructions.subject', locale, umbrella_project_name: @project_name)
    end

    opts[:from] = contact_email
    opts[:reply_to] = contact_email
    devise_mail(record, :confirmation_instructions, opts)
  end

  def reset_password_instructions(record, token, opts={})
    umbrella = Project.umbrella
    domain = OHD_DOMAIN
    contact_email = umbrella.contact_email
    locale = record.default_locale || 'de'
    @project_name = InstanceSetting.current.umbrella_project_brand_name(locale)

    @url = "#{domain}/#{locale}/users/password/edit?reset_password_token=#{token}"

    devise_opts = {}
    devise_opts[:from] = contact_email
    devise_opts[:reply_to] = contact_email
    devise_opts[:subject] = TranslationValue.for('devise.mailer.reset_password_instructions.subject', locale, umbrella_project_name: @project_name)
    devise_mail(record, :reset_password_instructions, devise_opts)
  end

  def email_changed(record, opts={})
    devise_mail(record, :email_changed, opts)
  end

  def two_factor_authentication_code(user, code, locale = nil)
    @code = code
    @valid_for = User::EMAIL_OTP_VALID_FOR / 60
    locale = locale || user.default_locale || 'de'
    contact_email = Project.umbrella.contact_email

    devise_opts = {
      scope: :user,
      from: contact_email,
      reply_to: contact_email,
      subject: TranslationValue.for('devise.mailer.two_factor_authentication_code.subject', locale)
    }

    devise_mail(user, :two_factor_authentication_code, devise_opts)
  end
end

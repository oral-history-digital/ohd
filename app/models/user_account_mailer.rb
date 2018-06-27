class UserAccountMailer < ActionMailer::Base

  def account_activation_instructions(account)
    mail_headers_and_info account
  end

  def new_registration_info(registration)
    @user_name = registration.full_name
    @url = edit_admin_user_registration_url(id: registration.id, locale: 'de')

    mail(
      subject: "new registration for #{Project.project_shortname}",
      from: "no-reply@cedis.fu-berlin.de",
      recipients: "#{Project.contact_email}",
      date:         Time.now
    )
  end


  private

  def mail_headers_and_info(account)
    registration = account.user_registration

    @mail_locale = ((registration.nil? || registration.default_locale.nil?) ? I18n.default_locale : registration.default_locale).to_sym
    @mail_locale = I18n.default_locale unless I18n.available_locales.include? @mail_locale

    # for correct route generation we have to pass an :id param. We can not name it :confirmation_token
    @url = activate_user_registration_url(id: account.confirmation_token, protocol: 'https', locale: @mail_locale)
    # why is this necessary? trailing slash leads to problems with localization. remove?
    @url = @url + '/'unless @url.last == '/'

    @user_name = registration.nil? ? account.display_name : registration.full_name
    @login = account.login

    mail(
      subject:      I18n.t('user_account_mailer.subject', locale: @mail_locale, project_name: Project.project_name[@mail_locale.to_s]),
      from:         "#{Project.contact_email}",
      recipients:   account.email,
      bcc:          "#{Project.contact_email}",
      date:         Time.now
    )
  end

end

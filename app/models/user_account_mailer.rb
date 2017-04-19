class UserAccountMailer < ActionMailer::Base

  def account_activation_instructions(account)
    mail_headers_and_info account
  end

  private

  def mail_headers_and_info(account)
    registration = account.user_registration

    @mail_locale = ((registration.nil? || registration.default_locale.nil?) ? I18n.default_locale : registration.default_locale).to_sym
    @mail_locale = I18n.default_locale unless I18n.available_locales.include? @mail_locale

    @url = confirm_account_url(:confirmation_token => account.confirmation_token, :protocol => 'https', :locale => @mail_locale)
    @url = @url + '/'unless @url.last == '/'

    @user_name = registration.nil? ? account.display_name : registration.full_name
    @login = account.login

    subject      I18n.t 'user_account_mailer.subject', :locale => @mail_locale, :project_name => Project.project_name[@mail_locale.to_s]
    from         "#{Project.contact_email}"
    recipients   account.email
    bcc          "#{Project.contact_email}"
    date      Time.now
  end

end

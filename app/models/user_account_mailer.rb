class UserAccountMailer < ActionMailer::Base

  def reactivate_fudis_account_instructions(account)
    mail_headers_and_info account
    @url = confirm_account_url(:confirmation_token => account.confirmation_token, :protocol => 'https')
    @url = @url + '/'unless @url.last == '/'
    body :url => @url, :user_name => @user_name, :email => account.email
  end

  def account_activation_instructions(registration, account)
    @mail_locale = ((registration.nil? || registration.default_locale.nil?) ? I18n.default_locale : registration.default_locale).to_sym
    @mail_locale = I18n.default_locale unless I18n.available_locales.include? @mail_locale
    @login = account.login
    mail_headers_and_info account, registration
    @url = confirm_account_url(:confirmation_token => account.confirmation_token, :protocol => 'https')
    @url = @url + '/' unless @url.last == '/'
  end

  private

  def mail_headers_and_info(account, registration=nil)
    if defined?(@mail_locale) && @mail_locale == :en
      subject       "Your account for the archive 'Forced Labor 1939-1945'"
    else
      subject      "Ihr Zugang zum Archiv 'Zwangsarbeit 1939-1945'"
    end
    from         'mail@zwangsarbeit-archiv.de'
    recipients   account.email
    bcc          "mail@zwangsarbeit-archiv.de"
    sent_on      Time.now
    @user_name = registration.nil? ? account.display_name : registration.full_name
  end

end

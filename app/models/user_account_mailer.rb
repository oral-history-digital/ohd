class UserAccountMailer < ActionMailer::Base

  def reactivate_fudis_account_instructions(account)
    mail_headers_and_info account
    @url = confirm_account_url(:confirmation_token => account.confirmation_token, :protocol => 'https')
    body :url => @url, :user_name => @user_name, :email => account.email
  end

  def account_activation_instructions(registration, account)
    @mail_locale = (registration.nil? ? nil : registration.default_locale).to_s.upcase
    @login = account.login
    mail_headers_and_info account
    @url = confirm_account_url(:confirmation_token => account.confirmation_token, :protocol => 'https')
  end

  private

  def mail_headers_and_info(account, registration=nil)
    if defined?(@mail_locale) && @mail_locale == 'EN'
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
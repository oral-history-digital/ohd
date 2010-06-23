class UserAccountMailer < ActionMailer::Base

  def reactivate_fudis_account_instructions(account)
    mail_headers_and_info account
    @url = confirm_account_url(:confirmation_token => account.confirmation_token, :protocol => 'https')
    body :url => @url, :user_name => @user_name, :email => account.email
  end

  private

  def mail_headers_and_info(account)
    subject      'Zugang zur neuen Version des Archiv Zwangsarbeit 1939-1945'
    from         'mail@zwangsarbeit-archiv.de'
    recipients   account.email
    sent_on      Time.now
    @user_name = account.user_registration.nil? ? account.login : (account.user_registration.appellation + ' ' + account.user_registration.full_name)
  end

end
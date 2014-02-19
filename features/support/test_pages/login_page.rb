class TestPages::LoginPage < TestPages::ApplicationPage
  def initialize
    @password = 'password'
    @registration = create :user_registration
    @registration.register!
    @registration.user_account.confirm!(@password, @password)
    @registration.activate!
  end

  def path
    '/login'
  end

  def registration_link
    'Zur Registrierung'
  end

  def login_as_a_test_user
    within('.signup') do
      fill_in 'user_account_login', :with => @registration.user_account.login
      fill_in 'user_account_password', :with => @password
      click_button 'Anmelden'
    end
  end
end

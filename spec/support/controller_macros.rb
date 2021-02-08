module ControllerMacros
  def login_user_account
    before(:each) do
      @request.env["devise.mapping"] = Devise.mappings[:user_account]
      user_account = FactoryBot.create(:user_account)
      #user_account.confirm! # or set a confirmed_at inside the factory. Only necessary if you are using the "confirmable" module
      sign_in user_account
    end
  end
end


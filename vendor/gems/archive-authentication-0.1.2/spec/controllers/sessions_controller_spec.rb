require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe SessionsController do
  integrate_views

  before :each do
    @warden = mock(Warden)
    request.env['warden'] = @warden
    @user = mock_model UserAccount,
                       :login => 'aneumann',
                       :email => 'a.neumann@mad.de'
  end

  it "should render a login form on a NEW action" do
    @warden.should_receive(:authenticate).with({:scope => :user_account}).and_return(@user)
    @warden.should_receive(:authenticated?).with(:user_account).and_return(false)
    get 'new'
    response.should have_tag("input#user_account_login")
    response.should have_tag("input#user_account_password")
  end

  it "should allow a user to sign in with his password and login" do
    @warden.should_receive(:authenticate).twice.with({:scope => :user_account}).and_return(@user)
    @warden.should_receive(:authenticated?).with(:user_account).and_return(false)
    #@warden.should_receive(:result).and_return(:success)
    #@warden.should_receive(:message).and_return(nil)
    post 'create', :user_account => { :login => 'aneumann', :password => 'pass'}
    controller.current_user_account.should == @user
    response.should be_redirect
  end

  it "should redirect back to the login form if the authentication failed" do
    @warden.should_receive(:authenticate).any_number_of_times.with({:scope => :user_account}).and_return(nil)
    @warden.should_receive(:authenticated?).with(:user_account).and_return(false)
    @warden.should_receive(:result).and_return(:failure)
    @warden.should_receive(:message).and_return('Failed to login')
    post 'create', :user_account => { :login => 'aneumann', :password => 'pass'}
    controller.current_user_account.should be_nil
    response.should have_tag("input#user_account_login")
    response.should have_tag("input#user_account_password")
  end

  it "should cancel the active session on a destroy action" do
    @warden.should_receive(:authenticate?).and_return(true)
    @warden.should_receive(:user).with(:user_account).and_return(@user)
    @warden.should_receive(:raw_session).and_return(controller.session)
    @warden.should_receive(:logout).and_return(controller.session)
    @warden.should_receive(:authenticate).with({:scope => :user_account}).and_return(nil)
    post 'destroy', :_method => :destroy
    controller.current_user_account.should be_nil
  end

end
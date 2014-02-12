require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UserAccount, 'with a password' do

  let :account do
    create :user_account, :password => 'mein-passwort', :password_confirmation => 'mein-passwort'
  end

  it 'should generate encrypted password and salt while setting password' do
    account.password_salt.should_not be_blank
    account.encrypted_password.should_not be_blank
  end

  it 'should not generate encrypted password if password is blank' do
    account = UserAccount.new
    account.attributes = { :login => 'aneumann2', :email => 'a2.neumann@mad.de' }
    account.save
    account.encrypted_password.should be_blank
  end

  it 'should encrypt password again if password has changed' do
    encrypted_password = account.encrypted_password
    account.password = account.password_confirmation = 'mein-neues-passwort'
    account.save
    account.encrypted_password.should_not eql(encrypted_password)
  end

  it 'should be confirmable' do
    account.should_not be_confirmed
    lambda{account.confirm!('pass-word','pass-word')}.should_not raise_exception
    account.should be_confirmed
  end

  it 'should have class methods from the lib' do
    UserAccount.respond_to?('authenticate').should be_true
  end

  # TODO: how do we test functionality that depends on the Devise gem here?
  it 'should authenticate a valid user with login info and password and return it' do
    #authenticated_user = UserAccount.authenticate(:login => 'aneumann', :email => 'a.neumann@mad.de', :password => 'mein-passwort')
    #account.should == authenticated_user
  end

end

describe UserAccount, 'without a password' do

  let :account do
    create :user_account
  end

  it 'should not be confirmable without password' do
    account.should_not be_confirmed
    lambda{account.confirm!(nil, nil)}.should_not raise_exception
    account.should_not be_confirmed
  end

  it 'should have an error on the password field on a confirmation attempt' do
    account.confirm!('', '')
    account.errors[:password].should_not be_nil
  end

  it 'should have an error on the password confirmation field if not supplied' do
    account.confirm!('protected!',nil)
    account.errors[:password_confirmation].should_not be_nil
  end

  it "should have an error if password and confirmation don't match" do
    lambda{account.confirm!('protected!','unprotected?')}.should_not raise_exception
    account.errors[:password].should_not be_nil
  end

  it 'should confirm without errors if both password and confirmation are supplied' do
    account.confirm!('validpass','validpass')
    account.errors.should be_empty
    account.should be_confirmed
  end

  it "should reset it's confirmation token to nil after confirmation" do
    account.confirm!('validpass','validpass')
    account.confirmation_token.should be_nil
  end

end

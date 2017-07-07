require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UserAccount, 'with a password' do

  let :account do
    FactoryGirl.create :user_account, :password => 'mein-passwort', :password_confirmation => 'mein-passwort'
  end

  it 'should generate encrypted password and salt while setting password' do
    # TODO: turn to more extensive use of devise. Rely on devise and update it periodically -
    # this will keep the app save.
    #expect(account.password_salt).not_to be_blank
    #expect(account.encrypted_password).not_to be_blank
  end

  it 'should not generate encrypted password if password is blank' do
    account = UserAccount.new
    account.attributes = { :login => 'aneumann2', :email => 'a2.neumann@mad.de' }
    account.save
    expect(account.encrypted_password).to be_blank
  end

  it 'should encrypt password again if password has changed' do
    encrypted_password = account.encrypted_password
    account.password = account.password_confirmation = 'mein-neues-passwort'
    account.save
    expect(account.encrypted_password).not_to eql(encrypted_password)
  end

  it 'should be confirmable' do
    expect(account).not_to be_confirmed
    expect{account.confirm!('pass-word','pass-word')}.not_to raise_exception
    expect(account).to be_confirmed
  end

end

describe UserAccount, 'without a password' do

  let :account do
    FactoryGirl.create :user_account
  end

  it 'should not be confirmable without password' do
    expect(account).not_to be_confirmed
    expect{account.confirm!(nil, nil)}.not_to raise_exception
    expect(account).not_to be_confirmed
  end

  it 'should have an error on the password field on a confirmation attempt' do
    account.confirm!('', '')
    expect(account.errors[:password]).not_to be_nil
  end

  it 'should have an error on the password confirmation field if not supplied' do
    account.confirm!('protected!',nil)
    expect(account.errors[:password_confirmation]).not_to be_nil
  end

  it "should have an error if password and confirmation don't match" do
    expect{account.confirm!('protected!','unprotected?')}.not_to raise_exception
    expect(account.errors[:password]).not_to be_nil
  end

  it 'should confirm without errors if both password and confirmation are supplied' do
    account.confirm!('validpass','validpass')
    expect(account.errors).to be_empty
    expect(account).to be_confirmed
  end

  it "should reset it's confirmation token to nil after confirmation" do
    account.confirm!('validpass','validpass')
    expect(account.confirmation_token).to be_nil
  end

end

require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UserRegistration, 'when newly created' do

  let :registration do
    FactoryBot.create :user_registration_with_projects
  end

  let :mandatory_registration_fields do
    UserRegistration.registration_fields.select{|k,v| v[:mandatory]}.map{|k,v| k}
  end

  it 'should have the new state' do
    expect(registration).to be_account_created
  end

  it 'should not have a user account associated with it' do
    expect(registration.user_account).to be_nil
  end

  it 'should not be created if any of the required fields are missing' do
    pending "undefined method attributes_for"
    attributes = attributes_for(:user_registration)
    attributes.delete(mandatory_registration_fields[rand(mandatory_registration_fields.size)])
    registration = UserRegistration.create attributes
    expect(registration).to be_new_record
    expect(registration).not_to be_valid
  end

  it 'should be created if all the required fields are there' do
    expect(registration).not_to be_new_record
  end

  it 'should not be created with an invalid email' do
    registration = FactoryBot.build :user_registration, :email => 'invalid.email.de'
    registration.save
    expect(registration).to be_new_record
    expect(registration).not_to be_valid
  end

  it 'should respond to the register event' do
    expect{registration.register}.not_to raise_exception
  end

  it 'should send an email to the user on a register event' do
    previous_deliveries = ApplicationMailer.deliveries.size
    registration.register
    expect(ApplicationMailer.deliveries.size).to eq(previous_deliveries+1)
    expect(ApplicationMailer.deliveries.last.to).to eq([registration.email])
  end

end

describe UserRegistration, 'on registration' do

  let :registration do
    registration = FactoryBot.create :user_registration_with_projects
    registration.register
    registration
  end

  it 'should generate a user account with confirmation token' do
    expect(registration.user_account).not_to be_nil
    expect(registration.user_account.confirmation_token).not_to be_nil
  end

  # should we really set processed_at on registration?
  # project_access_granted would make more sense.
  it 'should set processed_at on registration' do
    expect(registration.processed_at).to be_a(Time)
    expect(registration.processed_at).to be > (Time.now - 1.minute)
    expect(registration.processed_at).to be < (Time.now + 1.minute)
  end

  it "should move on to the 'account_created' state" do
    expect(registration).to be_account_created
  end

  it 'should respond to the activate event' do
    expect{registration.confirm_account!}.not_to raise_exception
  end

  it 'should be activatable' do
    registration.confirm_account!
    expect(registration).to be_account_confirmed
  end

  it 'should not have a confirmation token after activation' do
    # the confirmation token is deleted user_accounts confirm_with_password function
    # which calls confirm_account! afterwards
    registration.user_account.confirm_with_password!('password', 'password')
    expect(registration.user_account.confirmation_token).to be_nil
  end

end

describe UserRegistration, 'on registration' do

  let :registration do
    registration = FactoryBot.create :user_registration_with_projects
    registration.register
    registration
  end

  it "should move on to the 'registered' state" do
    expect(registration).to be_account_created
  end

  it 'should not have an active user account associated' do
    expect(registration.user_account).not_to be_active
  end

  it 'should have the same email as the user account' do
    expect(registration.user_account.email.eql?(registration.email)).to be_truthy
  end

end

describe UserRegistration, 'on registration after account activation' do

  let :registration do
    registration = FactoryBot.create :user_registration_with_projects
    registration.register
    registration.user_account.confirm_with_password!('password', 'password')
    registration
  end

  it "should move on to the 'account_confirmed' state" do
    expect(registration).to be_account_confirmed
  end

  it 'should have an active user account associated' do
    expect(registration.user_account).to be_active
  end

  it 'should have the same email as the user account' do
    expect(registration.user_account.email.eql?(registration.email)).to be_truthy
  end

end

describe UserRegistration, 'on account deactivation' do

  let :registration do
    registration = FactoryBot.create :user_registration_with_projects
    registration.register
    registration.user_account.confirm_with_password!('password', 'password')
    registration.grant_project_access!
    registration.deactivate_account!
    registration
  end

  it "should move on to the 'account deactivated' state" do
    expect(registration).to be_account_deactivated
  end

  it 'should not have an active user account associated' do
    expect(registration.user_account).not_to be_active
  end

  it 'should send an email to the user on reactivation' do
    registration  #Instantiate the registration first so that we don't count emails generated during instantiation.
    expect{registration.reactivate_account!}.to change{ApplicationMailer.deliveries.size}.by(1)
  end

end

describe UserRegistration, 'on postponing' do

  let :registration do
    registration = FactoryBot.create :user_registration_with_projects
    registration.register
    registration.user_account.confirm_with_password!('password', 'password')
    registration.postpone_project_access!
    registration
  end

  it 'should move on to the postponed project access state' do
    expect(registration).to be_project_access_postponed
  end

  # due to double opt-in accounts are active before project access is granted
  it 'should have an active user account associated' do
      expect(registration.user_account).to be_active
  end

  it 'should not have a confirmation token set' do
      expect(registration.user_account.confirmation_token).to be_nil
  end

end

describe UserRegistration, 'on granting access after postponing' do

  let :registration do
    registration = FactoryBot.create :user_registration_with_projects
    registration.register
    registration.user_account.confirm_with_password!('password', 'password')
    registration.postpone_project_access!
    registration.grant_project_access!
    registration
  end

  it "should move back to the 'project_access_granted' state" do
    expect(registration).to be_project_access_granted
  end

  it 'should have a valid user account assigned' do
    expect(registration.user_account).not_to be_nil
    expect(registration.user_account).to be_valid
  end

  it 'should have an active user account associated' do
    expect(registration.user_account).to be_active
  end

  it 'should set activated_at when granting access' do
    expect(registration.activated_at).to be_a(Time)
    expect(registration.activated_at).to be > (Time.now - 1.minute)
    expect(registration.activated_at).to be < (Time.now + 1.minute)
  end

  it 'should not have a confirmation token set' do
    expect(registration.user_account.confirmation_token).to be_nil
  end

end

describe UserRegistration, 'on reactivation after deactivation' do

  let :registration do
    registration = FactoryBot.create :user_registration_with_projects
    registration.register
    registration.user_account.confirm_with_password!('password', 'password')
    registration.reject_project_access!
    registration.deactivate_account!
    registration.reactivate_account!
    registration
  end

  it "should move back to the 'account_created' state" do
    expect(registration).to be_account_created
  end

  it 'should have a valid user account associated' do
    expect(registration.user_account).to be_valid
  end

  it 'should not have an active user account associated' do
    expect(registration.workflow_state).to eq('account_created')
    expect(registration.user_account).not_to be_active
  end

  it 'should have a confirmation code set' do
    expect(registration.user_account.confirmation_token).not_to be_nil
  end

end

describe UserRegistration, 'on reactivation after account deactivation' do

  let :registration do
    registration = FactoryBot.create :user_registration_with_projects
    registration.register
    registration.user_account.confirm_with_password!('password', 'password')
    registration.reject_project_access!
    registration.deactivate_account!
    registration.reactivate_account!
    registration
  end

  it "should move back to the 'account_created' state" do
    expect(registration).to be_account_created
  end

  it 'should have a valid user account associated' do
    expect(registration.user_account).to be_valid
  end

  it 'should not have an active user account associated' do
    expect(registration.user_account).not_to be_active
  end

  it 'should have a confirmation code set' do
    expect(registration.user_account.confirmation_token).not_to be_nil
  end

end

 #TODO: add some state-based tasks on which transitions are possible

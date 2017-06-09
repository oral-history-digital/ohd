require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UserRegistration, 'when newly created' do

  let :registration do
    create :user_registration
  end

  let :mandatory_registration_fields do
    UserRegistration.registration_fields.select{|k,v| v[:mandatory]}.map{|k,v| k}
  end

  it 'should have the unchecked state' do
    expect(registration).to be_unchecked
  end

  it 'should not have a user account associated with it' do
    expect(registration.user_account).to be_nil
  end

  it 'should not have a user associated with it' do
    expect(registration.user).to be_nil
  end

  it 'should not be created if any of the required fields are missing' do
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
    registration = build :user_registration, :email => 'invalid.email.de'
    registration.save
    expect(registration).to be_new_record
    expect(registration).not_to be_valid
  end

  it 'should respond to the register event' do
    expect{registration.register!}.not_to raise_exception
  end

  it 'should respond to the postpone event' do
    expect{registration.postpone!}.not_to raise_exception
  end

  it 'should respond to the reject event' do
    expect{registration.reject!}.not_to raise_exception
  end

  it 'should send an email to the user on a register event' do
    previous_deliveries = UserAccountMailer.deliveries.size
    registration.register!
    expect(UserAccountMailer.deliveries.size).to eq(previous_deliveries+1)
    expect(UserAccountMailer.deliveries.last.destinations.first).to eq(registration.email)
  end

end

describe UserRegistration, 'on registration' do

  let :registration do
    registration = create :user_registration
    registration.register!
    registration
  end

  it 'should generate a user account with confirmation token' do
    expect(registration.user_account).not_to be_nil
    expect(registration.user_account.confirmation_token).not_to be_nil
  end

  it 'should set processed_at on registration' do
    expect(registration.processed_at).to be_a(Time)
    expect(registration.processed_at).to be > (Time.now - 1.minute)
    expect(registration.processed_at).to be < (Time.now + 1.minute)
  end

  it 'should generate a user object' do
    # or should this happen on confirmation?
    expect(registration.user).not_to be_nil
  end

  it "should move on to the 'checked' state" do
    expect(registration).to be_checked
  end

  it 'should respond to the activate event' do
    expect{registration.activate!}.not_to raise_exception
  end

  it 'should not be activatable without confirming the user account' do
    registration.activate!
    expect(registration).not_to be_registered
    expect(registration).to be_checked
  end

  it 'should be activatable once the user account is confirmed' do
    # mock the account confirmation here and test it in the account spec
    registration.user_account = mock_model(UserAccount)
    expect(registration.user_account).to receive(:encrypted_password).and_return('dhfjdshjfhsjd')
    expect(registration.user_account).to receive(:password_salt).and_return('jdhjfhsdfjg')
    registration.activate!
    expect(registration).to be_registered
  end

  it 'should set activated_at on activation' do
    activation_time = Time.now
    registration.user_account = mock_model(UserAccount)
    expect(registration.user_account).to receive(:encrypted_password).and_return('dhfjdshjfhsjd')
    expect(registration.user_account).to receive(:password_salt).and_return('jdhjfhsdfjg')
    registration.activate!
    expect(registration.activated_at).to be_a(Time)
    expect(registration.activated_at).to be > (activation_time - 1.minute)
    expect(registration.activated_at).to be < (activation_time + 1.minute)
  end

end

describe UserRegistration, 'on rejection' do

  let :initial_delivery_count do
    initial_delivery_count = UserAccountMailer.deliveries.size
  end

  let :registration do
    registration = create :user_registration
    registration.reject!
    registration
  end

  it "should move on to the 'rejected' state" do
    expect(registration).to be_rejected
  end

  it 'should not generate a user account' do
    expect(registration.user_account).to be_nil
  end

  it 'should not send an email to the registered address' do
    expect(UserAccountMailer.deliveries.size).to eq(initial_delivery_count)
  end

end

describe UserRegistration, 'on activation after account activation' do

  let :registration do
    registration = create :user_registration
    registration.register!
    registration.user_account.confirm!('password', 'password')
    registration.activate!
    registration
  end

  it "should not move on to the 'registered' state" do
    expect(registration).to be_registered
  end

  it 'should have an active user account associated' do
    expect(registration.user_account).to be_active
  end

  it 'should have a valid user object associated' do
    expect(registration.user).to be_valid
  end

  it 'should have the same email as the user account' do
    expect(registration.user_account.email.eql?(registration.email)).to be_truthy
  end

  it 'should have passed the registration info to the user object' do
    # TODO
  end

end

describe UserRegistration, 'on removal' do

  let :registration do
    registration = create :user_registration
    registration.register!
    registration.user_account.confirm!('password', 'password')
    registration.activate!
    registration.remove!
    registration
  end

  it "should move on to the 'rejected' state" do
    expect(registration).to be_rejected
  end

  it 'should not have an active user account associated' do
    expect(registration.user_account).not_to be_active
  end

  it 'should send an email to the user on reactivation' do
    registration # Instantiate the registration first so that we don't count emails generated during instantiation.
    expect{registration.reactivate!}.to change{UserAccountMailer.deliveries.size}.by(1)
  end

end

describe UserRegistration, 'on postponing' do

  let :registration do
    registration = create :user_registration
    registration.postpone!
    registration
  end

  it 'should move on to the postponed state' do
    expect(registration).to be_postponed
  end

  it 'should not have an active user account associated' do
    if registration.user_account.nil?
      expect(registration.user_account).to be_nil
    else
      expect(registration.user_account).not_to be_active
    end
  end

  it 'should not have a confirmation token set' do
    if registration.user_account.nil?
      expect(registration.user_account).to be_nil
    else
      expect(registration.user_account.confirmation_token).to be_nil
    end
  end

end

describe UserRegistration, 'on reactivation after postponing' do

  let :registration do
    registration = create :user_registration
    registration.postpone!
    registration.reactivate!
    registration
  end

  it "should move back to the 'checked' state" do
    expect(registration).to be_checked
  end

  it 'should have a valid user account assigned' do
    expect(registration.user_account).not_to be_nil
    expect(registration.user_account).to be_valid
  end

  it 'should not have an active user account associated' do
    expect(registration.user_account).not_to be_active
  end

  it 'should have a confirmation token set' do
    expect(registration.user_account.confirmation_token).not_to be_nil
  end

end

describe UserRegistration, 'on reactivation after rejecting' do

  let :registration do
    registration = create :user_registration
    registration.reject!
    registration.reactivate!
    registration
  end

  it "should move back to the 'checked' state" do
    expect(registration).to be_checked
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

  it 'should have a valid user associated' do
    expect(registration.user).to be_valid
  end

end

describe UserRegistration, 'on reactivation after removing' do

  let :registration do
    registration = create :user_registration
    registration.register!
    registration.user_account.confirm!('password', 'password')
    registration.activate!
    registration.remove!
    registration.reactivate!
    registration
  end

  it "should move back to the 'checked' state" do
    expect(registration).to be_checked
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

  it 'should have a valid user associated' do
    expect(registration.user).to be_valid
  end

end

# TODO: add some state-based tasks on which transitions are possible

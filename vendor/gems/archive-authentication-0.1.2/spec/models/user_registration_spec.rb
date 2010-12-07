require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

# Generate randomly populated registration fields
$rand_chars = [('a'..'z'),('A'..'Z')].map{|i| i.to_a}.flatten
$registration_fields = {}
UserRegistration.registration_field_names.select{|f| UserRegistration.registration_fields[f.to_sym][:mandatory] }.each do |f|
  field = UserRegistration.registration_fields[f.to_sym]
  case f
    when 'email', :email
      $registration_fields[f] = (0..8).map{ $rand_chars[rand($rand_chars.length)]  }.join.downcase + '@' + (0..10).map{ $rand_chars[rand($rand_chars.length)]  }.join.downcase + '.de'
    else
      $registration_fields[f] = field[:values].empty? ? (0..12).map{ $rand_chars[rand($rand_chars.length)]  }.join : field[:values][rand(field[:values].size)]
  end
end

describe UserRegistration, 'when newly created' do

  before :each do
    @registration = generate_registration
  end

  it "should have the unchecked state" do
    @registration.should be_unchecked
  end

  it "should not have a user account associated with it" do
    @registration.user_account.should be_nil
  end

  it "should not have a user associated with it" do
    @registration.user.should be_nil
  end

  it "should not be created if any of the required fields are missing" do
    registration2 = UserRegistration.create $registration_fields.delete($registration_fields[$registration_fields.keys[rand($registration_fields.keys.size)]])
    registration2.should be_new_record
    registration2.should_not be_valid
  end

  it "should be created if all the required fields are there" do
    puts "\nRegistration: #{@registration.inspect}\nvalid: #{@registration.valid?}\nErrors: #{@registration.errors.full_messages}"
    @registration.should_not be_new_record
  end

  it "should not be created with an invalid email" do
    registration3 = UserRegistration.create $registration_fields.merge({ :email => 'invalid.email.de' })
    registration3.should be_new_record
    registration3.should_not be_valid
  end

  it "should respond to the register event" do
    lambda{@registration.register!}.should_not raise_exception
  end

  it "should respond to the postpone event" do
    lambda{@registration.postpone!}.should_not raise_exception
  end

  it "should respond to the reject event" do
    lambda{@registration.reject!}.should_not raise_exception
  end

  it "should send an email to the user on a register event" do
    previous_deliveries = UserAccountMailer.deliveries.size
    @registration.register!
    UserAccountMailer.deliveries.size.should == previous_deliveries+1
    UserAccountMailer.deliveries.last.destinations.first.should == @registration.email
  end

end

describe UserRegistration, 'on registration' do

  before :each do
    UserRegistration.delete_all
    UserAccount.delete_all
    @registration = generate_registration#
    @time_of_registration = Time.now
    @registration.register!
  end

  it "should generate a user account with confirmation token" do
    @registration.user_account.should_not be_nil
    @registration.user_account.confirmation_token.should_not be_nil
  end

  it "should set processed_at on registration" do
    @registration.processed_at.should be_a(Time)
    @registration.processed_at.should > (@time_of_registration - 1.minute)
    @registration.processed_at.should < (@time_of_registration + 1.minute)
  end

  it "should generate a user object" do
    # or should this happen on confirmation?
    @registration.user.should_not be_nil
  end

  it "should move on to the 'checked' state" do
    @registration.should be_checked
  end

  it "should respond to the activate event" do
    lambda{@registration.activate!}.should_not raise_exception
  end

  it "should not be activatable without confirming the user account" do
    @registration.activate!
    @registration.should_not be_registered
    @registration.should be_checked
  end

  it "should set activated_at on activation" do
    activation_time = Time.now
    @registration.activate!
    @registration.activated_at.should be_a(Time)
    @registration.activated_at.should > (activation_time - 1.minute)
    @registration.activated_at.should < (activation_time + 1.minute)
  end

  it "should be activatable once the user account is confirmed" do
    # mock the account confirmation here and test it in the account spec
    @registration.user_account = mock_model(UserAccount)
    @registration.user_account.should_receive(:confirmed_at).and_return(Time.now - 5.minutes)
    @registration.user_account.should_receive(:encrypted_password).and_return('dhfjdshjfhsjd')
    @registration.user_account.should_receive(:password_salt).and_return('jdhjfhsdfjg')
    @registration.activate!
    @registration.should be_registered
  end

end

describe UserRegistration, 'on rejection' do

  before :all do
    @initial_delivery_count = UserAccountMailer.deliveries.size
    @registration = generate_registration
    @registration.reject!
  end

  it "should move on to the 'rejected' state" do
    @registration.should be_rejected
  end

  it "should not generate a user account" do
    @registration.user_account.should be_nil
  end

  it "should not send an email to the registered address" do
    UserAccountMailer.deliveries.size.should == @initial_delivery_count
  end

end

describe UserRegistration, 'on activation after account activation' do
  
  before :all do
    UserRegistration.delete_all
    UserAccount.delete_all
    @registration = generate_registration
    @registration.register!
    @registration.user_account.confirm!('password','password')
    @registration.activate!
  end

  it "should not move on to the 'registered' state" do
    @registration.should be_registered
  end

  it "should have an active user account associated" do
    @registration.user_account.should be_active
  end

  it "should have a valid user object associated" do
    @registration.user.should be_valid
  end

  it "should have the same email as the user account" do
    @registration.user_account.email.eql?(@registration.email).should be_true
  end

  it "should have passed the registration info to the user object" do
    # TODO
  end

end

describe UserRegistration, 'on removal' do

  before :all do
    UserRegistration.delete_all
    UserAccount.delete_all
    @registration = generate_registration
    @registration.register!
    @registration.user_account.confirm!('password','password')
    @registration.activate!
    @registration.remove!
  end

  it "should move on to the 'rejected' state" do
    @registration.should be_rejected
  end

  it "should not have an active user account associated" do
    @registration.user_account.should_not be_active
  end

  it "should send an email to the user on reactivation" do
    @mails_sent = UserAccountMailer.deliveries.size
    @registration.reactivate!
    UserAccountMailer.deliveries.size.should == @mails_sent+1
  end

end

describe UserRegistration, 'on postponing' do

  before :all do
    UserRegistration.delete_all
    UserAccount.delete_all
    @registration = generate_registration
    @registration.postpone!
  end

  it "should move on to the postponed state" do
    @registration.should be_postponed
  end

  it "should not have an active user account associated" do
    if @registration.user_account.nil?
      @registration.user_account.should be_nil
    else
      @registration.user_account.should_not be_active
    end  
  end

  it "should not have a confirmation token set" do
    unless @registration.user_account.nil?
      @registration.user_account.confirmation_token.should be_nil
    else
      @registration.user_account.should be_nil
    end
  end

end

describe UserRegistration, 'on reactivation after postponing' do

  before :all do
    UserRegistration.delete_all
    UserAccount.delete_all
    @registration = generate_registration
    @registration.postpone!
    @registration.reactivate!
  end

  it "should move back to the 'checked' state" do
    @registration.should be_checked
  end

  it "should have a valid user account assigned" do
    @registration.user_account.should_not be_nil
    @registration.user_account.should be_valid
  end

  it "should not have an active user account associated" do
    @registration.user_account.should_not be_active
  end

  it "should have a confirmation token set" do
    @registration.user_account.confirmation_token.should_not be_nil
  end

end

describe UserRegistration, 'on reactivation after rejecting' do

  before :all do
    UserRegistration.delete_all
    UserAccount.delete_all
    @registration = generate_registration
    @registration.reject!
    @registration.reactivate!
  end

  it "should move back to the 'checked' state" do
    @registration.should be_checked
  end

  it "should have a valid user account associated" do
    @registration.user_account.should be_valid
  end

  it "should not have an active user account associated" do
    @registration.user_account.should_not be_active
  end

  it "should have a confirmation code set" do
    @registration.user_account.confirmation_token.should_not be_nil
  end

  it "should have a valid user associated" do
    @registration.user.should be_valid
  end

end

describe UserRegistration, 'on reactivation after removing' do

  before :all do
    UserRegistration.delete_all
    UserAccount.delete_all
    @registration = generate_registration
    @registration.register!
    @registration.user_account.confirm!('password','password')
    @registration.activate!
    @registration.remove!
    @registration.reactivate!
  end

  it "should move back to the 'checked' state" do
    @registration.should be_checked
  end

  it "should have a valid user account associated" do
    @registration.user_account.should be_valid
  end

  it "should not have an active user account associated" do
    @registration.user_account.should_not be_active
  end

  it "should have a confirmation code set" do
    @registration.user_account.confirmation_token.should_not be_nil
  end

  it "should have a valid user associated" do
    @registration.user.should be_valid
  end

end

# TODO: add some state-based tasks on which transitions are possible

# Generates a new registration with mandatory fields and makes sure the
# email address is generated randomly each time
def generate_registration
  UserRegistration.create $registration_fields.merge({ :email => (0..8).map{ $rand_chars[rand($rand_chars.length)]  }.join.downcase + '@' + (0..10).map{ $rand_chars[rand($rand_chars.length)]  }.join.downcase + '.de'})
end
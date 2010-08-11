require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UserRegistration, 'when newly created' do

  it "should have the unchecked state" do

  end

  it "should not have a user account associated with it" do

  end

  it "should not have a user associated with it" do

  end

  it "should not be created if required fields are missing" do

  end

  it "should be created if all the required fields are there" do

  end

  it "should not be created with an invalid email" do

  end

end

describe UserRegistration, 'on activation' do

  it "should generate a confirmation code" do

  end

  it "should send an email to the registered address" do

  end

  it "should generate a user object" do
    # or should this happen on confirmation?
  end

  it "should move on to the 'checked' state" do

  end

end

describe UserRegistration, 'on rejection' do

  it "should move on to the 'rejected' state" do

  end

  it "should not generate a confirmation code" do

  end

  it "should not send an email to the registered address" do

  end

end

describe UserRegistration, 'on confirmation' do

  it "should not be confirmed without a password" do

  end

  it "should be confirmed with a password" do

  end

  it "should move on to the 'registered' state" do

  end

  it "should have an active user account associated" do
    
  end

  it "should have a valid user object associated" do

  end

  it "should have the same email as the user account" do

  end

  it "should have passed the registration info to the user object" do
    
  end

  it "should reset it's confirmation code to nil" do

  end

end

describe UserRegistration, 'on removal' do

  it "should move on to the 'rejected' state" do

  end

  it "should not have an active user account associated" do
    
  end

end

describe UserRegistration, 'on postponing' do

  it "should move on to the postponed state" do

  end

  it "should not have an active user account associated" do

  end

  it "should not have a confirmation code set" do

  end

end

describe UserRegistration, 'on resuming' do

  it "should move back to the 'checked' state" do

  end

  it "should not have an active user account associated" do

  end

  it "should have a confirmation code set" do
    
  end

end

describe UserRegistration, 'on reactivation' do

  it "should move back to the 'registered' state" do

  end

  it "should have an active user account associated" do

  end

  it "should not have a confirmation code set" do
    
  end

end

# TODO: add some state-based tasks on which transitions are possible
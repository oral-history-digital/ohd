require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UserAccountMailer do

  let :german_account do
    registration = create :user_registration, :default_locale => 'de'
    registration.register!
    registration.user_account
  end

  let :english_account do
    registration = create :user_registration, :default_locale => 'en'
    registration.register!
    registration.user_account
  end

  it 'translates the activation email depending on the registration locale' do
    mail = UserAccountMailer.deliver_account_activation_instructions(german_account)
    mail.subject.should match /Ihr Zugang/
    mail.body.should match /Sehr geehrte\/r Florian Grandel.*Sehr geehrte/m # multipart message!
    mail.body.should_not match /Dear/
    mail = UserAccountMailer.deliver_account_activation_instructions(english_account)
    mail.subject.should match /Your account/
    mail.body.should match /Dear.*Dear/m
  end

  it 'translates the activation email independently of the current locale' do
    I18n.with_locale(:de) do
      mail = UserAccountMailer.deliver_account_activation_instructions(german_account)
      mail.subject.should match /Ihr Zugang/
    end
    I18n.with_locale(:en) do
      mail = UserAccountMailer.deliver_account_activation_instructions(german_account)
      mail.subject.should match /Ihr Zugang/
    end
  end

  it 'generates a multipart/alternative mail' do
    mail = UserAccountMailer.deliver_account_activation_instructions(german_account)
    mail.content_type.should eql 'multipart/alternative'
    mail.parts.size.should eql 2
    mail.parts.first.content_type.should eql 'text/plain'
    mail.parts.second.content_type.should eql 'text/html'
  end

end

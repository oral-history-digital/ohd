require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UserAccountMailer do

  let :german_account do
    registration = FactoryGirl.create :user_registration, :default_locale => 'de'
    registration.register!
    registration.user_account
  end

  let :english_account do
    registration = FactoryGirl.create :user_registration, :default_locale => 'en'
    registration.register!
    registration.user_account
  end

  it 'translates the activation email depending on the registration locale' do
    mail = UserAccountMailer.account_activation_instructions(german_account)
    expect(mail.subject).to match /Ihr Zugang/
    expect(mail.parts.first.body.raw_source).to match /Sehr geehrte\/r Florian Grandel/m 
    expect(mail.body).not_to match /Dear/
    mail = UserAccountMailer.account_activation_instructions(english_account)
    expect(mail.subject).to match /Your account/
    expect(mail.parts.first.body.raw_source).to match /Dear/m
  end

  it 'translates the activation email independently of the current locale' do
    I18n.with_locale(:de) do
      mail = UserAccountMailer.account_activation_instructions(german_account)
      expect(mail.subject).to match /Ihr Zugang/
    end
    I18n.with_locale(:en) do
      mail = UserAccountMailer.account_activation_instructions(german_account)
      expect(mail.subject).to match /Ihr Zugang/
    end
  end

  it 'generates a multipart/alternative mail' do
    mail = UserAccountMailer.account_activation_instructions(german_account)
    expect(mail.content_type).to match /multipart\/alternative/
    expect(mail.parts.size).to eql 2
    expect(mail.parts.first.content_type).to match /text\/plain/
    expect(mail.parts.second.content_type).to match /text\/html/
  end

end

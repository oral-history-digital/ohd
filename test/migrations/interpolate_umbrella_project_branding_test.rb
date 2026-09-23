require 'test_helper'
require Rails.root.join('db/migrate/20260918120100_interpolate_umbrella_project_branding')

class InterpolateUmbrellaProjectBrandingTest < ActiveSupport::TestCase
  ACCOUNT_MAIL_TEXT_KEYS = %w[
    devise.mailer.block.text
    devise.mailer.revoke_block.text
    devise.mailer.remove.text
  ].freeze

  test 'interpolates the project name in account workflow mail texts' do
    ACCOUNT_MAIL_TEXT_KEYS.each do |key|
      translation = TranslationValue.find_by!(key: key).translations.find_by!(locale: 'en')
      translation.update!(value: 'Welcome to Oral-History.Digital')
    end

    migration = InterpolateUmbrellaProjectBranding.new
    migration.up

    ACCOUNT_MAIL_TEXT_KEYS.each do |key|
      value = TranslationValue.for(key, 'en', project_name: 'Test-Portal.Digital')

      assert_equal 'Welcome to Test-Portal.Digital', value
    end

    migration.down

    ACCOUNT_MAIL_TEXT_KEYS.each do |key|
      assert_equal 'Welcome to Oral-History.Digital', TranslationValue.for(key, 'en')
    end
  end
end

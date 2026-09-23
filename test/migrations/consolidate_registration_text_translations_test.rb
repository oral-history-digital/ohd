require 'test_helper'
require Rails.root.join('db/migrate/20260923110000_consolidate_registration_text_translations')

class ConsolidateRegistrationTextTranslationsTest < ActiveSupport::TestCase
  TEXTS = {
    'user.registration_text_one' => 'Project registration.',
    'user.registration_text_one_ohd' => 'Umbrella registration.',
    'user.registration_text_two' => 'Terms explain %{umbrella_project_name}.',
    'user.registration_text_three' => 'Privacy information.',
    'user.registration_text_four' => 'Request archive access.'
  }.freeze

  test 'creates complete registration texts for umbrella and project registrations' do
    TEXTS.each do |key, value|
      TranslationValue.find_by!(key: key).translations.find_by!(locale: 'en').update!(value: value)
    end

    migration = ConsolidateRegistrationTextTranslations.new
    migration.up

    assert_equal(
      'Umbrella registration. %{conditions_link} Terms explain %{umbrella_project_name}. %{privacy_link} Privacy information. Request archive access.',
      TranslationValue.for('user.registration_text_umbrella', 'en')
    )
    assert_equal(
      'Project registration. %{conditions_link} Terms explain %{umbrella_project_name}. %{privacy_link} Privacy information.',
      TranslationValue.for('user.registration_text_project', 'en')
    )
    TEXTS.each_key do |key|
      assert_nil TranslationValue.find_by(key: key)
    end

    migration.down

    assert_nil TranslationValue.find_by(key: 'user.registration_text_umbrella')
    assert_nil TranslationValue.find_by(key: 'user.registration_text_project')
    assert_equal(
      ConsolidateRegistrationTextTranslations::LEGACY_TRANSLATIONS['user.registration_text_one']['en'],
      TranslationValue.for('user.registration_text_one', 'en')
    )
  end
end

require 'test_helper'

class Admin::HomepageSettingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'

    setting = InstanceSetting.current
    %w(hero panel_interview panel_register).each_with_index do |code, position|
      block = setting.homepage_blocks.find_or_initialize_by(code: code)
      block.assign_attributes(
        position: position,
        button_primary_target: '/explorer',
        button_secondary_target: code == 'hero' ? '/catalog' : nil,
        show_secondary_button: code == 'hero'
      )
      block.save!

      upsert_translation(block, 'de', "#{code} de")
      upsert_translation(block, 'en', "#{code} en")
    end
  end

  test 'should return full locale payload for admin' do
    login_as User.find_by!(email: 'alice@example.com')

    get admin_instance_setting_path(locale: 'de', format: :json)

    assert_response :success

    body = JSON.parse(response.body)
    hero = body.dig('data', 'blocks', 'hero')

    assert hero.key?('translations_attributes')
    locales = hero['translations_attributes'].map { |entry| entry['locale'] }
    assert_includes locales, 'de'
    assert_includes locales, 'en'

    de_translation = hero['translations_attributes'].find { |entry| entry['locale'] == 'de' }
    assert_equal 'Primary description de', de_translation['button_primary_description']
    assert_equal 'Secondary description de', de_translation['button_secondary_description']
  end

  test 'should reject non admin' do
    login_as User.find_by!(email: 'john@example.com')

    get admin_instance_setting_path(locale: 'de', format: :json)

    assert_response :redirect
    assert_match '/users/sign_in', response.location
  end

  private

  def upsert_translation(block, locale, heading)
    translation = block.translations.find_or_initialize_by(locale: locale)
    translation.update!(
      heading: heading,
      text: "#{heading} text",
      button_primary_label: 'Primary',
      button_secondary_label: 'Secondary',
      button_primary_description: "Primary description #{locale}",
      button_secondary_description: "Secondary description #{locale}",
      image_alt: "#{heading} image"
    )
  end
end

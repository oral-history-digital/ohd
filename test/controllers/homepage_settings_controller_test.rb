require 'test_helper'

class HomepageSettingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
  end

  test 'should show homepage settings for anonymous user' do
    get homepage_settings_path(locale: 'de', format: :json)

    assert_response :success

    body = JSON.parse(response.body)
    assert_equal 'homepage_settings', body['data_type']
    assert body['data'].key?('blocks')
  end

  test 'should update homepage settings for admin user' do
    login_as User.find_by!(email: 'alice@example.com')

    patch homepage_settings_path(locale: 'de', format: :json), params: {
      homepage_setting: {
        blocks: [
          {
            code: 'hero',
            position: 0,
            button_primary_target: '/de/explorer',
            button_secondary_target: '/de/catalog',
            show_secondary_button: true,
            translations_attributes: [
              {
                locale: 'de',
                heading: 'Neue Startseite',
                text: 'Startseitentext',
                button_primary_label: 'Archive',
                button_secondary_label: 'Institutionen',
                button_primary_description: 'Beschreibung Primar',
                button_secondary_description: 'Beschreibung Sekundar',
                image_alt: 'Startseite Bild'
              },
              {
                locale: 'en',
                heading: 'New Homepage',
                text: 'Homepage text',
                button_primary_label: 'Archives',
                button_secondary_label: 'Institutions',
                button_primary_description: 'Primary description',
                button_secondary_description: 'Secondary description',
                image_alt: 'Homepage image'
              }
            ]
          }
        ]
      }
    }

    assert_response :success

    body = JSON.parse(response.body)
    assert_equal 'Neue Startseite', body.dig('data', 'blocks', 'hero', 'heading')
    assert_equal 'Beschreibung Primar', body.dig('data', 'blocks', 'hero', 'button_primary_description')
    assert_equal 'Beschreibung Sekundar', body.dig('data', 'blocks', 'hero', 'button_secondary_description')
  end

  test 'should reject non-admin updates' do
    login_as User.find_by!(email: 'john@example.com')

    patch homepage_settings_path(locale: 'de', format: :json), params: {
      homepage_setting: {
        blocks: [
          {
            code: 'hero',
            position: 0,
            button_primary_target: '/de/explorer',
            translations_attributes: [
              {
                locale: 'de',
                heading: 'Nicht erlaubt',
                text: 'Text',
                button_primary_label: 'Label',
                image_alt: 'Bild'
              }
            ]
          }
        ]
      }
    }

    assert_response :forbidden
  end
end

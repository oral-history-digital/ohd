require "application_system_test_case"

class EditProjectInfoFormTest < ApplicationSystemTestCase

  test 'edit Archive configuration form' do
    visit '/'
    login_as 'alice@example.com'

    # Navigate to the form
    click_on 'Editing interface'
    click_on 'Archive configuration'
    click_on 'Edit archive information'

    # Verify read-only mode initially
    assert_text 'Archive name'
    assert_text 'Introduction start page'
    assert_text 'Landing page text'

    # Test the form with generic helper
    fill_and_verify_form(
      form_id: 'project',
      fields: {
        'project_name_en' => { value: 'Updated Test Archive Name' },
        'project_media_missing_text_en' => { value: 'Media is currently unavailable' },
        'project-introduction-en-richtextarea' => {
          value: 'Introduction on the start page in English',
          type: :rich_text,
        },
        'project-more_text-en-richtextarea' => {
          value: 'Further text on the start page in English',
          type: :rich_text,
        },
        'project-landing_page_text-en-richtextarea' => {
          value: 'Welcome to our archive! Register to access full content.',
          type: :rich_text,
        },
        'project-restricted_landing_page_text-en-richtextarea' => {
          value: 'This interview has restricted access.',
          type: :rich_text,
        }
      },
      ui_assertions: [
        'Updated Test Archive Name',
        'Media is currently unavailable'
      ],
      db_translation_assertions: {
        en: {
          'name' => 'Updated Test Archive Name',
          'media_missing_text' => 'Media is currently unavailable',
          'introduction' => '<p>Introduction on the start page in English</p>',
          'more_text' => '<p>Further text on the start page in English</p>',
          'landing_page_text' => '<p>Welcome to our archive! Register to access full content.</p>',
          'restricted_landing_page_text' => '<p>This interview has restricted access.</p>'
        }
      }
    )
  end

  test 'cancel editing Archive configuration' do
    visit '/'
    login_as 'alice@example.com'

    # Navigate to the form
    click_on 'Editing interface'
    click_on 'Archive configuration'
    click_on 'Edit archive information'

    # Verify read-only mode initially
    assert_text 'Archive name'

    # Test cancel with generic helper
    verify_form_cancel(
      form_id: 'project',
      field_to_modify: 'project_name_en',
      new_value: 'Updated Test Archive Name',
      db_field_to_check: 'name'
    )
  end
end

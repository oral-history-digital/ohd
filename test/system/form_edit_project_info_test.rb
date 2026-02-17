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
        'name' => { value: 'Updated Test Archive Name' },
        'cooperation_partner' => { value: 'Test University' },
        'leader' => { value: 'Dr. Jane Smith' },
        'manager' => { value: 'John Doe' },
        'pseudo_funder_names' => { value: 'Test Foundation, Research Fund' },
        'media_missing_text' => { value: 'Media is currently unavailable' },
        'introduction' => { value: 'Introduction on the start page in English', type: :rich_text, index: 0 },
        'more_text' => { value: 'Further text on the start page in English', type: :rich_text, index: 1 },
        'landing_page_text' => { value: 'Welcome to our archive! Register to access full content.', type: :rich_text, index: 2 },
        'restricted_landing_page_text' => { value: 'This interview has restricted access.', type: :rich_text, index: 3 }
      },
      ui_assertions: [
        'Test University',
        'Dr. Jane Smith',
        'John Doe',
        'Test Foundation,Research Fund',
        'Updated Test Archive Name',
        'Media is currently unavailable'
      ],
      db_assertions: {
        'cooperation_partner' => 'Test University',
        'leader' => 'Dr. Jane Smith',
        'manager' => 'John Doe',
        'pseudo_funder_names' => ['Test Foundation', 'Research Fund'],
        'name' => 'Updated Test Archive Name',
        'media_missing_text' => 'Media is currently unavailable',
        'introduction' => '<p>Introduction on the start page in English</p>',
        'more_text' => '<p>Further text on the start page in English</p>',
        'landing_page_text' => '<p>Welcome to our archive! Register to access full content.</p>',
        'restricted_landing_page_text' => '<p>This interview has restricted access.</p>'
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
      field_to_modify: 'name',
      new_value: 'Updated Test Archive Name',
      db_field_to_check: 'name'
    )
  end
end

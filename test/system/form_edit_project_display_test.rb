require "application_system_test_case"

class FormEditProjectDisplayTest < ApplicationSystemTestCase
  test 'edit Project display form' do
    visit '/'
    login_as 'alice@example.com'

    # Navigate to the form
    click_on 'Editing interface'
    click_on 'Archive configuration'
    click_on 'Edit display options'

    # Verify read-only mode initially
    assert_text 'Primary color'
    assert_text 'Secondary color'

    fill_and_verify_form(
      form_id: 'project',
      fields: {
        'aspect_x' => { value: '16', type: :text },
        'aspect_y' => { value: '9', type: :text },
      },
      ui_assertions: [
        '16',
        '9'
      ],
      db_assertions: {
        'aspect_x' => 16,
        'aspect_y' => 9,
      }
    )
  end

  test 'cancel editing Project display' do
    visit '/'
    login_as 'alice@example.com'

    # Navigate to the form
    click_on 'Editing interface'
    click_on 'Archive configuration'
    click_on 'Edit display options'

    # Verify read-only mode initially
    assert_text 'Primary color'
    assert_text 'Secondary color'

    # Test cancel with generic helper
    verify_form_cancel(
      form_id: 'project',
      field_to_modify: 'aspect_x',
      new_value: '16',
      db_field_to_check: 'aspect_x'
    )
  end
end

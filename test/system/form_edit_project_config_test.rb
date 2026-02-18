require "application_system_test_case"

class FormEditProjectConfigTest < ApplicationSystemTestCase
  test 'edit Project configuration form' do
    visit '/'
    login_as 'alice@example.com'

    # Navigate to the form
    click_on 'Editing interface'
    click_on 'Archive configuration'
    click_on 'Configure archive'

    # Verify read-only mode initially
    assert_text 'Shortname'
    assert_text 'Email contact address'

    # Use the discovery helper output directly
    fill_and_verify_form(
      form_id: 'project',
      fields: {
        'publication_date' => { value: '2026' },
        'contact_email' => { value: 'newemail@testdomain.com' },
        'archive_id_number_length' => { value: '4' },
        'default_locale' => { value: 'es' }
      },
      ui_assertions: [
        'newemail@testdomain.com'
      ],
      db_assertions: {
        'publication_date' => '2026',
        'contact_email' => 'newemail@testdomain.com',
        'archive_id_number_length' => 4,
        'default_locale' => 'es'
      }
    )
  end

  test 'cancel editing Project configuration' do
    visit '/'
    login_as 'alice@example.com'

    # Navigate to the form
    click_on 'Editing interface'
    click_on 'Archive configuration'
    click_on 'Configure archive'

    # Verify read-only mode initially
    assert_text 'Shortname'

    # Test cancel with generic helper
    verify_form_cancel(
      form_id: 'project',
      field_to_modify: 'contact_email',
      new_value: 'temporary@example.com',
      db_field_to_check: 'contact_email'
    )
  end
end

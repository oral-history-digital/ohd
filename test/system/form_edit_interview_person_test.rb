require "application_system_test_case"

class FormEditInterviewPersonTest < ApplicationSystemTestCase

  test 'edit interview person data' do
    Interview.reindex
    DataHelper.test_media

    visit '/'
    login_as 'alice@example.com'

    # Navigate to editing interface at top level
    assert_text 'Editing interface'
    click_on 'Editing interface'
    
    assert_text 'Archive configuration'
    click_on 'Search the archive'
    
    assert_text 'Rossi, Mario'
    link = find('a', text: 'Rossi, Mario', match: :first)
    link.click
    
    within '.SidebarTabs' do
      # Now we're on the person page in editing mode
      assert_text 'ABOUT THE PERSON'
      click_on 'About the Person'
      
      # Click Edit button to enter form edit mode
      find('button.Modal-trigger', text: 'Edit', match: :first).click
    end

    fill_and_verify_form(
      form_id: 'person',
      click_edit_button: false,
      in_modal: true,
      fields: {
        'first_name' => { value: 'Giovanni', type: :text },
        'last_name' => { value: 'Rossi', type: :text },
        'birth_name' => { value: 'Russo', type: :text },
        'alias_names' => { value: 'Giovanni R., G. Rossi', type: :text },
        'other_first_names' => { value: 'Gianni', type: :text },
        'pseudonym_first_name' => { value: 'John', type: :text },
        'pseudonym_last_name' => { value: 'Rose', type: :text },
        'date_of_birth' => { value: '1930-05-15', type: :text },
        'description' => { value: 'Italian filmmaker and documentarian', type: :textarea },
        'gender' => { value: 'male', type: :select },
        'title' => { value: 'Dr.', type: :select },
      },
      ui_assertions: [
        'Giovanni',
        'Rossi',
        'Dr.'
      ],
      db_model: Person,
      db_lookup_field: :first_name,
      db_lookup_value: 'Giovanni',
      db_assertions: {
        'first_name' => 'Giovanni',
        'last_name' => 'Rossi',
        'birth_name' => 'Russo',
        'alias_names' => 'Giovanni R., G. Rossi',
        'other_first_names' => 'Gianni',
        'pseudonym_first_name' => 'John',
        'pseudonym_last_name' => 'Rose',
        'date_of_birth' => '1930-05-15',
        'description' => 'Italian filmmaker and documentarian',
        'gender' => 'male',
        'title' => 'doctor',
      }
    )
  end
end

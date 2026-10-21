require "application_system_test_case"

class FormEditContributionTypesTest < ApplicationSystemTestCase

  test 'add a new contribution type' do
    visit '/'
    login_as 'alice@example.com'

    click_test_id('toggle-edit-view-button')
    
    visit '/en/contribution_types'
    
    within '.wrapper-content' do
      # Click Edit button to enter form edit mode
      find('button.Modal-trigger', text: 'Add', match: :first).click
    end

    # print_form_fields('form#contribution_type', include_all_details: true, model_class: Project)
    # assert_selector 'form#contribution_type'
    
    fill_and_verify_form(
      form_id: 'contribution_type',
      in_modal: true,
      click_edit_button: false,
      fields: {
        'label' => { value: 'New Contribution Type Label', type: :text },
        'code' => { value: 'new_value', type: :text },
        'order' => { value: '1', type: :text },
      },
      db_model: ContributionType,
      db_lookup_field: :code,
      db_lookup_value: 'new_value',
      db_assertions: {
        'code' => 'new_value',
        'order' => 1
      }
    )
    
  end

  test 'edit existing contribution type' do

    # Create a contribution type to edit
    project = Project.find_by!(shortname: "test")
    label = "Speaker #{SecureRandom.hex(4)}"
    contribution_type = DataHelper.test_contribution_type(
      project,
      code: "speaker_#{SecureRandom.hex(4)}",
      label: label,
      order: 1,
      use_in_export: true,
      use_in_details_view: true,
      display_on_landing_page: false
    )

    visit '/'
    login_as 'alice@example.com'

    click_test_id('toggle-edit-view-button')
    
    visit '/en/contribution_types'

    # Open actions menu for this specific record and choose Edit
    click_test_id("contribution_type-#{contribution_type.id}-actions-button")
    click_test_id("contribution_type-#{contribution_type.id}-action-edit")
    
    fill_and_verify_form(
      form_id: 'contribution_type',
      in_modal: true,
      click_edit_button: false,
      fields: {
        'code' => { value: 'edited_value', type: :text },
        'order' => { value: '2', type: :text },
      },
      db_model: ContributionType,
      db_lookup_field: :id,
      db_lookup_value: contribution_type.id,
      db_assertions: {
        'code' => 'edited_value',
        'order' => 2
      }
    )
    
  end
end

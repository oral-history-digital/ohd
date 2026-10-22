require 'application_system_test_case'

# Checks project summaries and on-demand admin dialogs across a saved change.
class ProjectAdminListLoadingTest < ApplicationSystemTestCase
  setup do
    umbrella = Project.find_by!(shortname: 'test')
    InstanceSetting.current.update!(umbrella_project: umbrella)
    @umbrella_id = umbrella.id
    Globalize.with_locale(:en) do
      @project = DataHelper.test_project(shortname: "admin#{SecureRandom.hex(3)}a", archive_domain: nil,
        name: 'Admin list project', publication_date: '2000', workflow_state: 'unshared', doi_status: 'created')
      institution = Institution.create!(name: 'Admin list institute', shortname: "inst#{SecureRandom.hex(3)}")
      InstitutionProject.create!(project: @project, institution: institution)
    end
  end

  test 'admin list excludes the umbrella and refreshes project summaries after editing and deletion' do
    visit '/en?checked_ohd_session=true'
    login_as 'alice@example.com'
    click_on 'Editing interface'
    click_on 'Archives', exact: true

    row = find('.dataBox--project', text: 'Admin list project')
    within row do
      assert_text 'Admin list institute'
      assert_selector "a[href*='/#{@project.shortname}/en']"
    end
    assert_no_selector "[data-testid='project-#{@umbrella_id}-actions-button']"

    click_test_id "project-#{@project.id}-actions-button"
    click_test_id "project-#{@project.id}-action-show"
    within '[role="dialog"]' do
      assert_text @project.shortname
      assert_text 'created'
      click_on 'Close'
    end

    click_test_id "project-#{@project.id}-actions-button"
    click_test_id "project-#{@project.id}-action-edit"
    within '[role="dialog"]' do
      assert_field 'project_contact_email', with: 'info@example.com'
      fill_in 'project_name_en', with: 'Updated admin project'
      click_test_id 'submit-button'
    end
    assert_no_selector '[role="dialog"]'
    assert_selector '.dataBox--project', text: 'Updated admin project'
    assert_equal 'Updated admin project', @project.reload.name(:en)

    click_test_id "project-#{@project.id}-actions-button"
    click_test_id "project-#{@project.id}-action-delete"
    click_test_id 'delete-item-confirm-button'
    # Removing the cached row can happen before the server finishes deleting it.
    assert_selector('.project-index') { !Project.exists?(@project.id) }
    assert_no_selector '.dataBox--project', text: 'Updated admin project'
    assert_not Project.exists?(@project.id)
  end
end

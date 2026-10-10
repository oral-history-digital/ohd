require 'application_system_test_case'
require_relative 'helpers/project_loading_helper'

# Behavior preservation: this file is run unchanged on baseline and migration.
class ProjectLoadingTest < ApplicationSystemTestCase
  include ProjectLoadingHelper

  setup { setup_project_loading_records }

  test 'portal and shared archive direct entry use their own branding and locale fields' do
    visit '/en'
    assert_selector 'footer', text: 'OHD', wait: 15
    mark_project_document
    within('.LocaleButtons', match: :first) { click_on 'ger' }
    assert_current_path '/de', ignore_query: true
    assert_selector 'footer', text: 'OHD'
    assert_same_project_document
    visit '/alpha/en'
    assert_project_presentation(@alpha)
    login_as @admin.email
    open_project_loading_configuration('Edit archive information')
    find('button', text: 'Edit', exact_text: true, match: :first).click
    assert_selector '#project_name_en'
    assert_selector '#project_name_de'
    assert_no_selector '#project_name_ru'
  end

  test 'footer and locale navigation keep shared archive context without a document reload' do
    visit '/alpha/en'
    assert_project_presentation(@alpha)
    mark_project_document
    within('footer') { click_on 'Contact' }
    assert_current_path '/alpha/en/contact', ignore_query: true
    assert_project_presentation(@alpha)
    within('.LocaleButtons', match: :first) { click_on 'ger' }
    assert_current_path '/alpha/de/contact', ignore_query: true
    assert_project_presentation(@alpha, locale: 'de')
    assert_same_project_document
  end

  test 'dedicated domain direct entry and locale navigation preserve domain and project' do
    visit "#{@dedicated.archive_domain}/en"
    assert_project_presentation(@dedicated, prefix: '/en')
    mark_project_document
    within('footer') { click_on 'Contact' }
    within('.LocaleButtons', match: :first) { click_on 'ger' }
    assert_current_path '/de/contact', ignore_query: true
    assert_equal 'coverage.localhost', URI.parse(current_url).host
    assert_project_presentation(@dedicated, locale: 'de', prefix: '/de')
    assert_same_project_document
  end

  test 'account memberships put the current archive first and keep roles and permission links in their project' do
    alpha_interview = project_loading_interview(@alpha, 1)
    beta_interview = project_loading_interview(@beta, 1)
    [@alpha, @beta].each do |project|
      role = Role.create!(project: project, name: "#{project.shortname} reader role")
      UserRole.create!(user: @admin, role: role)
    end
    InterviewPermission.create!(user: @admin, interview: alpha_interview)
    InterviewPermission.create!(user: @admin, interview: beta_interview)
    login_as @admin.email
    visit '/alpha/en/users/current'
    assert_selector '.account-page a', text: 'Alpha Archive', wait: 15
    assert_selector '.account-page a', text: 'Beta Archive', wait: 15
    membership_links = all('.account-page a').select { |link| %w[Alpha\ Archive Beta\ Archive].include?(link.text) }
    assert_equal ['Alpha Archive', 'Beta Archive'], membership_links.map(&:text)
    assert_match %r{/alpha/en$}, membership_links.first[:href]
    assert_match %r{/beta/en$}, membership_links.last[:href]
    assert_text 'activated'
    expand_memberships = all('.account-page button.Button--icon')
    expand_memberships.first.click
    find('.account-page .roles button').click
    find('.account-page .interview_permissions button').click
    assert_text 'alpha reader role'
    assert_no_text 'beta reader role'
    assert_no_selector "a[href$='/beta/en/interviews/#{beta_interview.archive_id}']"
    expand_memberships.last.click
    all('.account-page .roles button').last.click
    all('.account-page .interview_permissions button').last.click
    assert_text 'beta reader role'
    assert_selector "a[href$='/alpha/en/interviews/#{alpha_interview.archive_id}']"
    assert_selector "a[href$='/beta/en/interviews/#{beta_interview.archive_id}']"
    assert_no_selector '.account-page button[title="Delete"]'
    mark_project_document
    find('.account-page a', text: 'Beta Archive', exact_text: true).click
    assert_project_presentation(@beta)
    assert_no_selector '.LocaleButtons a', text: 'ger'
    assert_same_project_document
  end

  test 'workbook uses each saved interview project and filters archive entries' do
    [@alpha, @beta, @dedicated].each_with_index do |project, index|
      interview = project_loading_interview(project, 1)
      InterviewReference.create!(user: @admin, project: project, reference: interview,
        title: "#{project.shortname} saved interview", media_id: interview.archive_id,
        created_at: index.days.ago)
    end
    login_as @admin.email
    visit '/en/users/current'
    click_on 'Workbook'
    all('.userContents button.accordion', minimum: 3)[1].click
    assert_selector '.WorkbookEntry', text: 'alpha saved interview', wait: 15
    assert_selector ".WorkbookEntry a[href$='/alpha/en/interviews/alpha001']"
    assert_selector ".WorkbookEntry a[href$='/beta/en/interviews/beta001']"
    assert_selector ".WorkbookEntry a[href^='#{@dedicated.archive_domain}/en/interviews/dedicated001']"
    assert_equal ['alpha saved interview', 'beta saved interview', 'dedicated saved interview'],
      all('.WorkbookEntry-title').map(&:text)
    visit '/alpha/en/users/current'
    click_on 'Workbook'
    all('.userContents button.accordion', minimum: 3)[1].click
    assert_selector '.WorkbookEntry', text: 'alpha saved interview'
    assert_no_selector '.WorkbookEntry', text: 'beta saved interview'
    assert_no_selector '.WorkbookEntry', text: 'dedicated saved interview'
  end

  test 'portal users table filters real users and exposes portal columns in its pencil dialog' do
    login_as @admin.email
    open_project_loading_users(@portal)
    assert_selector 'thead', text: 'MFA', wait: 15
    assert_selector 'select[name="project"]'
    assert_no_selector 'select[name="role"]'
    find('.UserTable input[type="text"]').set(@reader.email)
    project_loading_user_row
    assert_no_selector 'tbody tr', text: @admin.email
    open_project_loading_user_dialog
    within('[data-reach-dialog-content]') do
      assert_text 'Alpha Archive'
      assert_no_selector 'form#user_project'
      assert_selector 'form#user'
    end
  end

  test 'archive users table saves access sends notification and refreshes the affected row' do
    membership = @reader.user_projects.find_by!(project: @alpha)
    membership.update_column(:workflow_state, 'project_access_requested')
    login_as @admin.email
    open_project_loading_users
    project_loading_user_row
    assert_selector 'select[name="role"]'
    assert_no_selector 'select[name="project"]'
    assert_selector 'thead', text: 'Role'
    mark_project_document
    open_project_loading_user_dialog
    within('[data-reach-dialog-content]') do
      select_project_loading_value('select[name="workflow_state"]', 'grant_project_access')
      assert_selector 'textarea', text: /Alpha Archive/
      click_on 'Submit'
    end
    assert_no_selector '[data-reach-dialog-content]'
    assert_selector 'tbody tr', text: /john@example.com.*activated/m
    perform_enqueued_jobs
    assert_equal 'project_access_granted', membership.reload.workflow_state
    assert_match /Alpha Archive/, membership.mail_text
    mail = ActionMailer::Base.deliveries.find { |delivery| delivery.to.include?(@reader.email) }
    assert mail, 'access change must deliver notification mail'
    assert_match /Alpha Archive/, mail.all_parts.map { |part| part.body.decoded }.join
    assert_same_project_document
    select_project_loading_value('select[name="workflow_state"]', 'project_access_granted')
    project_loading_user_row
    select_project_loading_value('select[name="default_locale"]', 'de')
    assert_no_selector 'tbody tr', text: @reader.email
  end

  test 'authorized archive role assignment and deletion persist and refresh the same user row' do
    role = Role.create!(project: @alpha, name: 'Alpha curator')
    Role.create!(project: @beta, name: 'Beta curator')
    login_as @admin.email
    open_project_loading_users
    select_project_loading_value('select[name="workflow_state"]', 'all')
    project_loading_user_row.find("td:nth-child(7) button.Modal-trigger").click
    within('[data-reach-dialog-content]') do
      assert_selector 'option', text: 'Alpha curator'
      assert_no_selector 'option', text: 'Beta curator'
      select_project_loading_value('select[name="role_id"]', role.id)
      click_on 'Submit'
    end
    assert_no_selector '[data-reach-dialog-content]'
    assert_selector 'tbody tr', text: /john@example.com.*Alpha curator/m
    assignment = UserRole.find_by!(user: @reader, role: role)
    # Keep independent writes distinct in Rails' second-precision serializer cache.
    travel 2.seconds
    project_loading_user_row.find('button[title="Delete"]').click
    within('[data-reach-dialog-content]') { click_on 'Delete' }
    assert_no_selector 'tbody tr', text: /john@example.com.*Alpha curator/m
    assert_not UserRole.exists?(assignment.id)
  end

  test 'reader cannot see user administration or role assignment controls' do
    login_as @reader.email
    visit '/alpha/en/users'
    assert_selector 'footer', text: 'Alpha Archive', wait: 15
    assert_no_selector '.UserTable'
    assert_no_selector 'button[title="Assign role"]'
    assert_no_selector 'button[title="Delete"]'
    assert_equal 0, @reader.user_roles.count
  end

  test 'user administrator without role permissions sees the table but cannot assign or delete roles' do
    manager_role = Role.create!(project: @alpha, name: 'Alpha user administrator')
    [['General', 'edit'], ['User', 'update']].each do |klass, action|
      manager_role.permissions << Permission.create!(klass: klass, action_name: action)
    end
    assignment = UserRole.create!(user: @reader, role: manager_role)
    login_as @reader.email
    open_project_loading_users
    select_project_loading_value('select[name="workflow_state"]', 'all')
    within(project_loading_user_row) do
      assert_text 'Alpha user administrator'
      assert_no_selector 'td:nth-child(7) button.Modal-trigger'
      assert_selector 'td:nth-child(8) button.Modal-trigger'
    end
    status = page.evaluate_async_script(<<~JS, assignment.id)
      const id = arguments[0], done = arguments[arguments.length - 1];
      fetch('/alpha/en/user_roles/' + id, {method: 'DELETE', headers: {Accept: 'application/json'}})
        .then(response => done(response.status));
    JS
    assert_equal 403, status
    assert UserRole.exists?(assignment.id)
    status = page.evaluate_async_script(<<~JS, @reader.id, manager_role.id)
      const userId = arguments[0], roleId = arguments[1], done = arguments[arguments.length - 1];
      fetch('/alpha/en/user_roles', {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({user_role: {user_id: userId, role_id: roleId}})})
        .then(response => done(response.status));
    JS
    assert_equal 403, status
    assert_equal 1, @reader.user_roles.count
  end


  test 'explorer shared and dedicated archive links use their own route shapes' do
    visit "/en/catalog/archives/#{@alpha.id}"
    assert_selector '.ProjectDetails-title', text: 'Alpha Archive', wait: 15
    assert_selector '.ProjectDetails-actions button'
    mark_project_document
    find('.ProjectDetails-actions button').click
    assert_project_presentation(@alpha)
    assert_same_project_document
    visit "/en/catalog/archives/#{@dedicated.id}"
    assert_selector '.ProjectDetails-title', text: 'Dedicated Archive', wait: 15
    assert_selector ".ProjectDetails-actions a[href='#{@dedicated.archive_domain}'][target='_blank']"
  end



  test 'portal filters select real project memberships MFA managers and superusers' do
    @reader.update!(otp_required_for_login: true, changed_to_otp_at: Time.current)
    manager = Role.create!(project: @alpha, name: 'Archivmanagement')
    manager.permissions << Permission.create!(klass: 'General', action_name: 'edit')
    UserRole.create!(user: @reader, role: manager)
    login_as @admin.email
    open_project_loading_users(@portal)
    project_loading_user_row
    select_project_loading_value('select[name="mfa"]', 'enabled')
    project_loading_user_row
    assert_no_selector 'tbody tr', text: @admin.email
    select_project_loading_value('select[name="mfa"]', '')
    select_project_loading_value('select[name="superuser"]', 'yes')
    assert_selector 'tbody tr', text: @admin.email
    assert_no_selector 'tbody tr', text: @reader.email
    select_project_loading_value('select[name="superuser"]', '')
    select_project_loading_value('select[name="project"]', @beta.id)
    assert_selector 'tbody tr', text: @admin.email
    assert_no_selector 'tbody tr', text: @reader.email
    select_project_loading_value('select[name="project"]', @alpha.id)
    select_project_loading_value('select[name="project_manager"]', 'yes')
    project_loading_user_row
    assert_no_selector 'tbody tr', text: @admin.email
    assert_selector 'thead', text: TranslationValue.for('modules.project_access.granted_in', :en)
    assert_selector 'thead', text: TranslationValue.for('modules.project_access.archive_management_in', :en)
  end
  test 'logout removes authorized configuration and its contact email before reopening the archive' do
    @alpha.update!(contact_email: 'private-alpha@example.org')
    login_as @admin.email
    open_project_loading_configuration('Configure archive')
    assert_text 'private-alpha@example.org', wait: 15
    mark_project_document
    within('.SessionButtons') { click_on 'Logout' }
    assert_no_text 'private-alpha@example.org', wait: 15
    assert_selector '.SessionButtons', text: 'Login', wait: 15
    assert_no_selector 'form#project'
    assert_same_project_document
    within('footer') { click_on 'Contact' }
    assert_no_text 'private-alpha@example.org'
  end

  test 'invalid direct routes return Rails 404 responses and no archive branding' do
    ['/missing/en', '/alpha/zz', "#{@dedicated.archive_domain}/zz"].each do |route|
      visit route
      status = page.evaluate_async_script(<<~JS)
        const done = arguments[arguments.length - 1];
        fetch(location.href, {headers: {Accept: 'text/html'}}).then(response => done(response.status));
      JS
      assert_equal 404, status, "Expected an invalid route to return 404: #{route}"
      assert_no_selector 'footer', text: 'Alpha Archive'
      assert_no_selector 'footer', text: 'Beta Archive'
    end
  end

  test 'assigned account tasks stay grouped under their own project membership' do
    tasks = [@alpha, @beta].map do |project|
      interview = project_loading_interview(project, 1)
      project.interviews.reload
      type = TaskType.create!(project: project, key: "#{project.shortname}_assigned",
        label: "#{project.shortname.capitalize} assigned review", use: true)
      task = interview.tasks.reload.find_by!(task_type: type)
      task.update_columns(user_id: @admin.id, assigned_to_user_at: Time.current)
      task
    end
    login_as @admin.email
    visit '/alpha/en/users/current'
    assert_selector '.account-page a', text: 'Alpha Archive', wait: 15
    assert_selector '.account-page a', text: 'Beta Archive', wait: 15
    enable_project_loading_editing
    expand_memberships = all('.account-page button.Button--icon', minimum: 2)
    expand_memberships.first.click
    find('.account-page .tasks button').click
    assert_text 'Alpha assigned review'
    assert_no_text 'Beta assigned review'
    assert_selector "a[href$='/alpha/en/interviews/#{tasks.first.interview.archive_id}']"
    expand_memberships.last.click
    all('.account-page .tasks button').last.click
    assert_text 'Beta assigned review'
    assert_no_selector '.account-page button[title="Delete"]'
  end
end

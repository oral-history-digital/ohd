require 'test_helper'
require 'minitest/mock'

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
    @access_token = Doorkeeper::AccessToken.create!(
      resource_owner_id: User.find_by!(email: 'alice@example.com').id
    ).token
  end

  test 'ignores invalid default locale filter values' do
    users_json(page: 1, workflow_state: 'afirmed')
    assert_response :success
    unfiltered_total = JSON.parse(response.body).fetch('total')

    users_json(
      page: 1,
      workflow_state: 'afirmed',
      default_locale: 'all'
    )
    assert_response :success
    assert_equal unfiltered_total, JSON.parse(response.body).fetch('total')

    users_json(
      page: 1,
      workflow_state: 'afirmed',
      default_locale: 'not-a-locale'
    )
    assert_response :success
    assert_equal unfiltered_total, JSON.parse(response.body).fetch('total')
  end

  test 'allows global user locales not available on umbrella project' do
    assert_not_includes Project.find_by!(shortname: 'ohd').available_locales, 'ru'

    user = User.new(
      login: 'russian-user@example.com',
      email: 'russian-user@example.com',
      password: 'Password123!',
      password_confirmation: 'Password123!',
      first_name: 'Russian',
      last_name: 'User',
      tos_agreement: true,
      tos_agreed_at: DateTime.now,
      priv_agreement: true,
      country: 'Germany',
      street: 'Test Street 1',
      city: 'Berlin',
      default_locale: 'ru'
    )
    user.skip_confirmation_notification!
    user.save!
    user.confirm
    user.afirm!

    users_json(
      page: 1,
      workflow_state: 'afirmed',
      default_locale: 'ru'
    )
    assert_response :success

    user_ids = JSON.parse(response.body).
      fetch('data').
      map { |payload| payload.fetch('id') }
    assert_includes user_ids, user.id
  end

  test 'configured umbrella lists global users while former ohd uses project access' do
    umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a")
    InstanceSetting.current.update!(umbrella_project: umbrella)
    archive = Project.find_by!(shortname: 'ohd')
    member = User.find_by!(email: 'john@example.com')
    admin = User.find_by!(email: 'alice@example.com')
    access = UserProject.create!(user: member, project: archive)
    access.update_columns(workflow_state: 'project_access_granted', activated_at: Time.current)

    # Configured umbrella should list all users with afirmed workflow state
    get "/#{umbrella.shortname}/en/users.json",
      params: { access_token: @access_token, workflow_state: 'afirmed' }
    assert_response :success
    user_ids = JSON.parse(response.body).fetch('data').map { |user| user.fetch('id') }
    assert_includes user_ids, member.id
    assert_includes user_ids, admin.id

    # Former ohd project (not umbrella) should only list users with project access granted
    get '/ohd/en/users.json',
      params: { access_token: @access_token, workflow_state: 'project_access_granted' }
    assert_response :success
    user_ids = JSON.parse(response.body).fetch('data').map { |user| user.fetch('id') }
    assert_includes user_ids, member.id
    assert_not_includes user_ids, admin.id
  end

  test 'registration messages use localized umbrella fallback but preserve archive context' do
    umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a", name: 'Shared platform')
    Globalize.with_locale(:de) { umbrella.update!(name: 'Gemeinsame Plattform') }
    InstanceSetting.current.update!(umbrella_project: umbrella)
    
    # Make the portal request genuinely global, with no matching project domain.
    Project.where(archive_domain: OHD_DOMAIN).update_all(archive_domain: '')
    original_translation = TranslationValue.method(:for)
    translation = ->(key, locale, **values) do
      if key.start_with?('modules.registration.messages.')
        values.fetch(:project)
      else
        original_translation.call(key, locale, **values)
      end
    end

    TranslationValue.stub(:for, translation) do
      get '/de/users/check_email.json', params: { email: 'not-registered@example.com' }
      assert_response :success
      assert_equal umbrella.name('de'), JSON.parse(response.body).fetch('msg')

      archive = Project.find_by!(shortname: 'ohd')
      get '/ohd/de/users/check_email.json', params: { email: 'not-registered@example.com' }
      assert_response :success
      assert_equal archive.name('de'), JSON.parse(response.body).fetch('msg')
    end
  end

  private

  def users_json(params)
    get '/ohd/en/users.json', params: params.merge(access_token: @access_token)
  end
end

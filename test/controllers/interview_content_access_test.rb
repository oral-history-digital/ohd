require 'test_helper'
require 'minitest/mock'

# Exercises content authorization independently of export rendering.
class InterviewContentAccessTest < ActionController::TestCase
  tests InterviewsController
  include Devise::Test::ControllerHelpers

  setup do
    @project = Project.find_by!(shortname: 'test')
    @interview = @project.interviews.first
    @interview.update!(workflow_state: 'restricted', observations: 'Protected observations', locale: :en)
    @reader = User.find_by!(email: 'john@example.com')
    @access = UserProject.find_or_create_by!(user: @reader, project: @project)
    @access.update_columns(workflow_state: 'project_access_granted')
  end

  test 'observations require an interview grant and owning-project access' do
    sign_in @reader
    @controller.stub(:current_project, @project) do
      get :observations, params: { id: @interview.archive_id, locale: 'en', format: :json }
      assert_response :forbidden
      assert_equal({ 'msg' => 'not_authorized' }, JSON.parse(response.body))

      grant = InterviewPermission.create!(user: @reader, interview: @interview)
      get :observations, params: { id: @interview.archive_id, locale: 'en', format: :json }
      assert_response :success
      assert_equal 'Protected observations', JSON.parse(response.body).dig('data', 'en')

      grant.destroy!
      get :observations, params: { id: @interview.archive_id, locale: 'en', format: :json }
      assert_response :forbidden
    end
  end

  test 'PDF exports check grants and project context before generation' do
    assert_pdf_access(@reader, @project, :forbidden)
    grant = InterviewPermission.create!(user: @reader, interview: @interview)
    assert_pdf_access(@reader, @project, :success)

    @access.update_columns(workflow_state: 'project_access_requested')
    assert_pdf_access(@reader, @project, :forbidden)
    umbrella = Project.find_by!(shortname: 'ohd')
    InstanceSetting.current.update!(umbrella_project: umbrella)
    assert_pdf_access(@reader, umbrella, :forbidden)
    @access.update_columns(workflow_state: 'project_access_granted')
    assert_pdf_access(@reader, umbrella, :success)
    assert_pdf_access(@reader, DataHelper.test_project(shortname: 'outside'), :forbidden)
    assert_pdf_access(User.find_by!(email: 'alice@example.com'), @project, :success)

    grant.destroy!
    permission = Permission.find_or_create_by!(klass: 'General', action_name: 'edit')
    role = Role.create!(project: @project, name: 'Content editor')
    RolePermission.create!(role: role, permission: permission)
    UserRole.create!(user: @reader, role: role)
    assert_pdf_access(@reader, umbrella, :success)
  end

  test 'unknown content archive IDs return not found' do
    sign_in @reader
    @controller.stub(:current_project, @project) do
      [:transcript, :observations].each do |action|
        assert_raises(ActiveRecord::RecordNotFound) do
          get action, params: { id: 'unknown', locale: 'en', format: :pdf }
        end
      end
    end
  end

  test 'VTT and CSV recheck interview grants even with a warm export cache' do
    sign_in @reader
    cache = ActiveSupport::Cache::MemoryStore.new
    grant = InterviewPermission.create!(user: @reader, interview: @interview)
    Rails.stub(:cache, cache) do
      @controller.stub(:current_project, @project) do
        [:vtt, :csv].each do |format|
          get :show, params: { id: @interview.archive_id, locale: 'en', lang: 'eng', tape_number: 1, format: format }
          assert_response :success
          assert_includes response.body, 'My name is Mario Rossi'
        end
        grant.destroy!
        [:vtt, :csv].each do |format|
          get :show, params: { id: @interview.archive_id, locale: 'en', lang: 'eng', tape_number: 1, format: format }
          assert_response :forbidden
          refute_includes response.body, 'My name is Mario Rossi'
        end
      end
    end
  end

  test 'VTT and CSV honor owning-project grants through umbrella context' do
    sign_in @reader
    umbrella = Project.find_by!(shortname: 'ohd')
    InstanceSetting.current.update!(umbrella_project: umbrella)
    InterviewPermission.create!(user: @reader, interview: @interview)
    @controller.stub(:current_project, umbrella) do
      [:vtt, :csv].each do |format|
        get :show, params: { id: @interview.archive_id, locale: 'en', lang: 'eng', tape_number: 1, format: format }
        assert_response :success
      end
      @access.update_columns(workflow_state: 'project_access_requested')
      [:vtt, :csv].each do |format|
        get :show, params: { id: @interview.archive_id, locale: 'en', lang: 'eng', tape_number: 1, format: format }
        assert_response :forbidden
      end
    end
  end

  private

  # Stubs PDF rendering, ensuring unauthorized requests never reach generation.
  #
  # @param user [User] Requesting user
  # @param project [Project] Request project context
  # @param status [Symbol] Expected response status
  # @return [void]
  def assert_pdf_access(user, project, status)
    sign_out :user
    sign_in user
    @controller.send(:pundit_reset!)
    generate = lambda do |*|
      flunk 'Unauthorized PDF generation' unless status == :success
      'Protected PDF'
    end

    @controller.stub(:current_project, project) do
      Interview.stub(:find_by!, @interview) do
        @interview.stub(:to_pdf, generate) do
          @interview.stub(:observations_pdf, generate) do
            [:transcript, :observations].each do |action|
              get action, params: { id: @interview.archive_id, locale: 'en', lang: 'eng', format: :pdf }
              assert_response status
              assert_equal 'Protected PDF', response.body if status == :success
              refute_includes response.body, 'Protected PDF' unless status == :success
            end
          end
        end
      end
    end
  end
end

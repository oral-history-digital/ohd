require 'test_helper'
require 'minitest/mock'

# Checks parent-interview authorization before segment serialization and caching.
class SegmentsControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  setup do
    @project = Project.find_by!(shortname: 'test')
    @interview = @project.interviews.first
    @interview.update!(workflow_state: 'restricted')
    @segment = @interview.segments.first
    @reader = User.find_by!(email: 'john@example.com')
    @access = UserProject.find_or_create_by!(user: @reader, project: @project)
    sign_in @reader
  end

  test 'pending registration and project access do not grant restricted segments' do
    request_segments
    assert_response :forbidden
    assert_equal({ 'msg' => 'not_authorized' }, JSON.parse(response.body))
    @access.update_columns(workflow_state: 'project_access_granted')
    request_segments
    assert_response :forbidden
  end

  test 'segment caches cannot bypass a revoked interview grant' do
    @access.update_columns(workflow_state: 'project_access_granted')
    grant = InterviewPermission.create!(user: @reader, interview: @interview)
    Rails.stub(:cache, ActiveSupport::Cache::MemoryStore.new) do
      request_segments
      assert_response :success
      text = JSON.parse(response.body).dig('data', @segment.tape.number.to_s, @segment.id.to_s, 'text')
      assert_equal 'My name is Mario Rossi', text['eng-public']
      refute text.key?('eng')

      grant.destroy!
      request_segments
      assert_response :forbidden
      assert_equal({ 'msg' => 'not_authorized' }, JSON.parse(response.body))
    end
  end

  test 'segment lists enforce owning-project access and ordinary and umbrella context' do
    @access.update_columns(workflow_state: 'project_access_granted')
    InterviewPermission.create!(user: @reader, interview: @interview)
    umbrella = Project.find_by!(shortname: 'ohd')
    InstanceSetting.current.update!(umbrella_project: umbrella)
    request_segments(umbrella)
    assert_response :success
    @access.update_columns(workflow_state: 'project_access_requested')
    request_segments(umbrella)
    assert_response :forbidden

    other = DataHelper.test_project(shortname: 'elsewhere')
    registration = UserProject.create!(user: @reader, project: other)
    registration.update_columns(workflow_state: 'project_access_granted')
    request_segments(other)
    assert_response :forbidden
  end

  test 'owning-project editors and admins retain access to original segment translations' do
    role = Role.create!(project: @project, name: 'Segment editor')
    [['General', 'edit'], ['Segment', 'update']].each do |klass, action|
      RolePermission.create!(role: role, permission: Permission.find_or_create_by!(klass: klass, action_name: action))
    end
    UserRole.create!(user: @reader, role: role)
    umbrella = Project.find_by!(shortname: 'ohd')
    InstanceSetting.current.update!(umbrella_project: umbrella)
    request_segments(umbrella)
    assert_response :success
    assert JSON.parse(response.body).dig('data', @segment.tape.number.to_s, @segment.id.to_s, 'text').key?('eng')

    sign_out :user
    sign_in User.find_by!(email: 'alice@example.com')
    request_segments
    assert_response :success
  end

  test 'unknown interview archive IDs return not found' do
    @controller.stub(:current_project, @project) do
      assert_raises(ActiveRecord::RecordNotFound) do
        get :index, params: { interview_id: 'unknown', locale: 'en', format: :json }
      end
    end
  end

  test 'single segment reads ignore forged interview IDs and recheck grants before cached data' do
    @access.update_columns(workflow_state: 'project_access_granted')
    other = Interview.create!(project: @project, archive_id: "#{@project.shortname}999",
      workflow_state: 'public', media_type: 'audio')
    Rails.stub(:cache, ActiveSupport::Cache::MemoryStore.new) do
      request_segment(@project, other.archive_id)
      assert_response :forbidden
      assert_equal({ 'msg' => 'not_authorized' }, JSON.parse(response.body))

      grant = InterviewPermission.create!(user: @reader, interview: @interview)
      request_segment
      assert_response :success
      assert_equal @segment.id, JSON.parse(response.body).dig('data', 'id')
      assert_equal 'My name is Mario Rossi', JSON.parse(response.body).dig('data', 'text', 'eng-public')

      grant.destroy!
      request_segment
      assert_response :forbidden
      assert_equal({ 'msg' => 'not_authorized' }, JSON.parse(response.body))
    end
  end

  test 'single segments enforce owning-project access and context while retaining admin access' do
    @access.update_columns(workflow_state: 'project_access_granted')
    InterviewPermission.create!(user: @reader, interview: @interview)
    umbrella = Project.find_by!(shortname: 'ohd')
    InstanceSetting.current.update!(umbrella_project: umbrella)
    request_segment(umbrella)
    assert_response :success
    @access.update_columns(workflow_state: 'project_access_requested')
    request_segment(umbrella)
    assert_response :forbidden

    other = DataHelper.test_project(shortname: 'outside')
    UserProject.create!(user: @reader, project: other).update_columns(workflow_state: 'project_access_granted')
    request_segment(other)
    assert_response :forbidden

    sign_out :user
    request_segment
    assert_response :unauthorized
    sign_in User.find_by!(email: 'alice@example.com')
    request_segment
    assert_response :success
  end

  private

  # Requests the interview's segment list using the supplied project context.
  #
  # @param project [Project] Request project context
  # @return [void]
  def request_segments(project = @project)
    @controller.send(:pundit_reset!)
    @controller.stub(:current_project, project) do
      get :index, params: { interview_id: @interview.archive_id, locale: 'en', format: :json }
    end
  end

  # Requests a segment by its real ID; the claimed interview must not grant access.
  #
  # @param project [Project] Request project context
  # @param interview_id [String] Untrusted parent interview parameter
  # @return [void]
  def request_segment(project = @project, interview_id = @interview.archive_id)
    @controller.send(:pundit_reset!)
    @controller.stub(:current_project, project) do
      get :show, params: { id: @segment.id, interview_id: interview_id, locale: 'en', format: :json }
    end
  end
end

require 'test_helper'
require 'minitest/mock'

class EditTablesControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  test 'queues the original filename and defers contribution updates' do
    project = Project.find_by!(shortname: 'test')
    interview = project.interviews.first
    contribution = interview.contributions.first
    original = contribution.speaker_designation
    sign_in User.find_by!(email: 'alice@example.com')
    queued = nil
    @controller.stub(:current_project, project) do
      ReadEditTableJob.stub(:perform_later, ->(options) { queued = options }) do
        post :create, params: {
          format: :json, locale: 'en',
          edit_table: {
            archive_id: interview.archive_id,
            data: fixture_file_upload(Rails.root.join('test/files/transcript_de.csv'), 'text/csv'),
            contributions_attributes: { '0' => { id: contribution.id, speaker_designation: 'CHANGED' } }
          }
        }
      end
    end
    assert_response :ok
    assert_equal original, contribution.reload.speaker_designation
    assert_equal 'transcript_de.csv', queued.fetch(:filename)
  ensure
    FileUtils.rm_f(queued[:file_path]) if queued
  end

  test 'rejects an interview from another project before queuing' do
    project = Project.find_by!(shortname: 'test')
    other = Project.find_by!(shortname: 'ohd')
    sign_in User.find_by!(email: 'alice@example.com')
    @controller.stub(:current_project, other) do
      assert_raises(ActiveRecord::RecordNotFound) do
        post :create, params: {
          format: :json, locale: 'en', edit_table: { archive_id: project.interviews.first.archive_id }
        }
      end
    end
  end
  test 'pre-check validates rows without writes and cleans up its copy' do
    with_validation_table('00:00:01.000') do |parameters, project|
      assert_read_only_validation(parameters, project)
    end
    assert_response :ok
    assert_equal({ 'valid' => true, 'issues' => [] }, JSON.parse(response.body))
  end

  test 'pre-check returns timestamp issues with row locations' do
    with_validation_table('00:61:00.000') do |parameters, project|
      assert_read_only_validation(parameters, project)
    end
    assert_response :unprocessable_entity
    result = JSON.parse(response.body)
    assert_equal false, result['valid']
    assert_equal 'timecode.minutes_out_of_range', result['issues'].first['code']
    assert_equal 2, result['issues'].first['location']['row']
    assert_equal '00:61:00.000', result['issues'].first['params']['value']
  end

  test 'speaker discovery uses the edit table headers without validating timestamps or writing' do
    with_validation_table('invalid') do |parameters, project|
      assert_read_only_validation(parameters, project, action: :speakers)
    end
    assert_response :ok
    assert_equal({ 'speakers' => ['INT'] }, JSON.parse(response.body))
  end

  test 'speaker discovery enforces authorization and project membership' do
    with_validation_table('invalid') do |parameters, project|
      sign_in User.find_by!(email: 'john@example.com')
      assert_read_only_validation(parameters, project, action: :speakers)
      assert_response :forbidden

      sign_in User.find_by!(email: 'alice@example.com')
      @controller.stub(:current_project, Project.find_by!(shortname: 'ohd')) do
        assert_raises(ActiveRecord::RecordNotFound) { post :speakers, params: parameters }
      end
    end
  end

  test 'references-only pre-check checks existing segment targets' do
    with_validation_table('99:00:00.000') do |parameters, project|
      parameters[:edit_table][:only_references] = 'true'
      assert_read_only_validation(parameters, project)
    end
    assert_response :unprocessable_entity
    assert_equal 'segment.not_unique', JSON.parse(response.body)['issues'].first['code']
  end

  test 'pre-check rejects unauthorized and cross-project requests' do
    with_validation_table('00:00:01.000') do |parameters, project|
      sign_in User.find_by!(email: 'john@example.com')
      assert_read_only_validation(parameters, project)
      assert_response :forbidden
      sign_in User.find_by!(email: 'alice@example.com')
      @controller.stub(:current_project, Project.find_by!(shortname: 'ohd')) do
        assert_raises(ActiveRecord::RecordNotFound) { post :validate, params: parameters }
      end
    end
  end

  test 'pre-check requires authentication and reports malformed table headings' do
    with_validation_table('00:00:01.000') do |parameters, project|
      sign_out User.find_by!(email: 'alice@example.com')
      assert_read_only_validation(parameters, project)
      assert_response :unauthorized
    end
    with_validation_table('00:00:01.000') do |parameters, project|
      parameters[:edit_table][:data] = fixture_file_upload(Rails.root.join('test/files/transcript_de.csv'), 'text/csv')
      assert_read_only_validation(parameters, project)
      assert_response :unprocessable_entity
      assert_equal 'file.invalid_structure', JSON.parse(response.body)['issues'].first['code']
    end
  end

  test 'pre-check rejects foreign contributions and cleans up after exceptions' do
    with_validation_table('00:00:01.000') do |parameters, project|
      interview = project.interviews.first
      other = Interview.create!(project: project, archive_id: "#{project.shortname}999", media_type: 'audio')
      source = interview.contributions.first
      contribution = other.contributions.create!(person: source.person, contribution_type: source.contribution_type)
      parameters[:edit_table][:contributions_attributes] = {
        '0' => { id: contribution.id, speaker_designation: 'FOREIGN' }
      }
      files = Dir.glob(Rails.root.join('tmp/edit-table-*'))
      @controller.stub(:current_project, project) do
        assert_raises(ActiveRecord::RecordNotFound) { post :validate, params: parameters }
      end
      assert_equal files, Dir.glob(Rails.root.join('tmp/edit-table-*'))
    end
  end

  private

  # Builds a CSV from the interview's actual export headers.
  # @param timecode [String] Timecode to validate
  # @yieldparam parameters [Hash] Upload request
  # @yieldparam project [Project] Destination project
  # @return [void]
  def with_validation_table(timecode)
    project = Project.find_by!(shortname: 'test')
    interview = project.interviews.first
    sign_in User.find_by!(email: 'alice@example.com')
    Tempfile.create(['edit-precheck-test', '.csv']) do |file|
      header = CSV.parse(EditTableImportTemplate.new(interview, :en).csv, **CSV_OPTIONS).first
      csv = CSV.new(file, **CSV_OPTIONS)
      csv << header
      csv << [1, timecode, 'INT']
      csv.flush
      yield({
        format: :json, locale: 'en', edit_table: {
          archive_id: interview.archive_id,
          data: Rack::Test::UploadedFile.new(file.path, 'text/csv'), only_references: 'false'
        }
      }, project)
    end
  end

  # Verifies that a pre-check makes no database writes or deliveries and removes its copy.
  # @param parameters [Hash] Upload request
  # @param project [Project] Current project
  # @param action [Symbol] Read-only import action
  # @return [void]
  def assert_read_only_validation(parameters, project, action: :validate)
    files = Dir.glob(Rails.root.join('tmp/edit-table-*'))
    writes = []
    subscriber = ->(*event) { writes << event.last[:sql] if event.last[:sql].match?(/\A\s*(INSERT|UPDATE|DELETE)\b/i) }
    assert_no_difference 'ActionMailer::Base.deliveries.count' do
      ActiveSupport::Notifications.subscribed(subscriber, 'sql.active_record') do
        @controller.stub(:current_project, project) { post action, params: parameters }
      end
    end
    assert_empty writes
    assert_equal files, Dir.glob(Rails.root.join('tmp/edit-table-*'))
  end

end

require 'test_helper'
require 'minitest/mock'

class TranscriptsControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  setup do
    @project = Project.find_by!(shortname: 'test')
    @interview = @project.interviews.first
    @tape = @interview.tapes.first
    @locale = Language.find_by!(code: 'eng')
  end

  test 'queues spreadsheet settings and defers replacement' do
    sign_in User.find_by!(email: 'alice@example.com')
    original_ids = @tape.segments.pluck(:id)
    options = nil

    @controller.stub(:current_project, @project) do
      ReadTranscriptFileJob.stub(:perform_later, ->(args) { options = args }) do
        post :create, params: upload_params
      end
    end

    assert_response :ok
    assert_equal 'processing', JSON.parse(response.body).fetch('msg')
    assert_equal original_ids, @tape.segments.pluck(:id)
    assert_equal @tape.id, options.fetch(:tape_id)
    assert_equal '25', options.fetch(:frame_rate)
    assert_equal 'true', options.fetch(:trim_timecodes)
    assert_equal 'true', options.fetch(:delete_existing)
    assert_equal 'transcript_de.csv', options.fetch(:filename)
    assert File.exist?(options.fetch(:file_path))
  ensure
    FileUtils.rm_f(options[:file_path]) if options
  end

  test 'unauthorized users cannot queue a transcript replacement' do
    sign_in User.find_by!(email: 'john@example.com')
    original_ids = @tape.segments.pluck(:id)

    @controller.stub(:current_project, @project) do
      ReadTranscriptFileJob.stub(:perform_later, ->(*) { flunk 'Queued an unauthorized upload' }) do
        post :create, params: upload_params
      end
    end

    assert_response :forbidden
    assert_equal original_ids, @tape.segments.pluck(:id)
  end

  test 'queues subtitle replacement without deleting existing segments' do
    sign_in User.find_by!(email: 'alice@example.com')
    original_ids = @tape.segments.pluck(:id)
    options = nil
    params = upload_params
    params[:transcript][:data] = fixture_file_upload(Rails.root.join('test/files/transcript_de.vtt'), 'text/vtt')

    @controller.stub(:current_project, @project) do
      ReadTranscriptFileJob.stub(:perform_later, ->(args) { options = args }) do
        post :create, params: params
      end
    end

    assert_response :ok
    assert_equal original_ids, @tape.segments.pluck(:id)
    assert_equal 'true', options.fetch(:delete_existing)
    assert_equal 'transcript_de.vtt', options.fetch(:filename)
  ensure
    FileUtils.rm_f(options[:file_path]) if options
  end

  test 'ODT upload defers tape timing and replacement to the job' do
    sign_in User.find_by!(email: 'alice@example.com')
    original_ids = @tape.segments.pluck(:id)
    original_duration = @tape.duration
    options = nil
    parameters = upload_params
    parameters[:transcript][:data] = Rack::Test::UploadedFile.new(
      Rails.root.join('test/files/transcript_de.vtt'), 'application/vnd.oasis.opendocument.text',
      original_filename: 'transcript.odt'
    )
    parameters[:transcript][:tape_durations] = '00:61:00'
    parameters[:transcript][:time_shifts] = '00:00:60'
    @controller.stub(:current_project, @project) do
      ReadTranscriptFileJob.stub(:perform_later, ->(args) { options = args }) do
        post :create, params: parameters
      end
    end
    assert_response :ok
    assert_equal original_ids, @tape.segments.pluck(:id)
    assert_equal original_duration, @tape.reload.duration
    assert_equal '00:61:00', options.fetch(:tape_durations)
    assert_equal '00:00:60', options.fetch(:time_shifts)
  ensure
    FileUtils.rm_f(options[:file_path]) if options
  end

  test 'rejects an unassigned language before queuing or replacing segments' do
    sign_in User.find_by!(email: 'alice@example.com')
    language = Language.create!(code: 'zzz', name: 'Unassigned language')
    original = @tape.segments.pluck(:id, :timecode)
    parameters = upload_params
    parameters[:transcript][:transcript_language_id] = language.id

    @controller.stub(:current_project, @project) do
      ReadTranscriptFileJob.stub(:perform_later, ->(*) { flunk 'Queued an unassigned language' }) do
        post :create, params: parameters
      end
    end

    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body).fetch('errors').fetch('transcript_language_id'),
                    'Choose a language assigned to this interview.'
    assert_equal original, @tape.segments.pluck(:id, :timecode)
  end

  test 'pre-check accepts spreadsheets frames subtitles and ODT timing without writes' do
    sign_in User.find_by!(email: 'alice@example.com')
    cases = [
      ['.csv', "TIMECODE\tSPEAKER\tTRANSCRIPT\n00:00:01.000\t\tText\n", {}],
      ['.csv', "TIMECODE\tSPEAKER\tTRANSCRIPT\n00:00:01:24\t\tText\n", { timecode_frame_rate: '25' }],
      ['.vtt', "WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nText\n", {}],
      ['.srt', "1\n00:00:01,000 --> 00:00:02,000\nText\n", {}],
      ['.odt', 'Timing pre-check does not read ODT text', { tape_durations: '00:10:00' }]
    ]
    cases.each do |extension, content, settings|
      with_validation_upload(content, extension) do |parameters|
        parameters[:transcript].merge!(settings)
        assert_read_only_validation(parameters)
        assert_response :ok
        assert_equal({ 'valid' => true, 'issues' => [] }, JSON.parse(response.body))
      end
    end
  end

  test 'pre-check returns every timestamp issue with original values and locations' do
    sign_in User.find_by!(email: 'alice@example.com')
    with_validation_upload("TIMECODE\tSPEAKER\tTRANSCRIPT\n00:61:00.000\t\tBad minutes\n00:00:01.00\t\tBad precision\n", '.csv') do |parameters|
      assert_read_only_validation(parameters)
    end
    assert_response :unprocessable_entity
    result = JSON.parse(response.body)
    assert_equal false, result['valid']
    assert_equal %w[timecode.minutes_out_of_range timecode.milliseconds_format], result['issues'].map { |issue| issue['code'] }
    assert_equal [2, 3], result['issues'].map { |issue| issue['location']['row'] }
    assert_equal %w[00:61:00.000 00:00:01.00], result['issues'].map { |issue| issue['params']['value'] }
  end

  test 'pre-check reports invalid language and unsupported extension with codes' do
    sign_in User.find_by!(email: 'alice@example.com')
    parameters = upload_params
    parameters[:transcript][:transcript_language_id] = Language.create!(code: 'zzz', name: 'Unassigned').id
    assert_read_only_validation(parameters)
    assert_response :unprocessable_entity
    assert_equal 'language.not_assigned', JSON.parse(response.body)['issues'].first['code']

    with_validation_upload('unsupported', '.txt') { |request| assert_read_only_validation(request) }
    assert_response :unprocessable_entity
    assert_equal 'file.unsupported_format', JSON.parse(response.body)['issues'].first['code']
  end

  test 'pre-check reports missing table headings as structured issues' do
    sign_in User.find_by!(email: 'alice@example.com')
    with_validation_upload("wrong\theadings\n00:00:01.000\tText\n", '.csv') do |parameters|
      assert_read_only_validation(parameters)
    end
    assert_response :unprocessable_entity
    assert_equal 'file.invalid_structure', JSON.parse(response.body)['issues'].first['code']
  end

  test 'pre-check requires authentication' do
    assert_read_only_validation(upload_params)
    assert_response :unauthorized
  end

  test 'pre-check routes support portal and dedicated archive domains' do
    @project.update!(archive_domain: 'http://precheck.example.org')
    %w[transcripts edit_tables].each do |controller|
      portal = Rails.application.routes.recognize_path("#{OHD_DOMAIN}/test/en/#{controller}/validate", method: :post)
      archive = Rails.application.routes.recognize_path("http://precheck.example.org/en/#{controller}/validate", method: :post)
      assert_equal({ controller: controller, action: 'validate', locale: 'en', project_id: 'test' }, portal)
      assert_equal({ controller: controller, action: 'validate', locale: 'en' }, archive)
    end
  end

  test 'pre-check rejects unauthorized users and interviews outside the project' do
    sign_in User.find_by!(email: 'john@example.com')
    assert_read_only_validation(upload_params)
    assert_response :forbidden

    sign_in User.find_by!(email: 'alice@example.com')
    @controller.stub(:current_project, Project.find_by!(shortname: 'ohd')) do
      assert_raises(ActiveRecord::RecordNotFound) { post :validate, params: upload_params }
    end
  end

  test 'pre-check rejects a tape or proposed contribution from another interview' do
    sign_in User.find_by!(email: 'alice@example.com')
    parameters = upload_params
    parameters[:transcript][:tape_number] = @interview.tapes.maximum(:number) + 1
    @controller.stub(:current_project, @project) do
      assert_raises(ActiveRecord::RecordNotFound) { post :validate, params: parameters }
    end
    other = Interview.create!(project: @project, archive_id: "#{@project.shortname}999", media_type: 'audio')
    source = @interview.contributions.first
    contribution = other.contributions.create!(person: source.person, contribution_type: source.contribution_type)
    parameters = upload_params
    parameters[:transcript][:timecode_frame_rate] = nil
    parameters[:transcript][:contributions_attributes] = { '0' => { id: contribution.id, speaker_designation: 'FOREIGN' } }
    files = Dir.glob(Rails.root.join('tmp/transcript-*'))
    @controller.stub(:current_project, @project) do
      assert_raises(ActiveRecord::RecordNotFound) { post :validate, params: parameters }
    end
    assert_equal files, Dir.glob(Rails.root.join('tmp/transcript-*'))
  end

  test 'pre-check removes its temporary copy when validation raises unexpectedly' do
    sign_in User.find_by!(email: 'alice@example.com')
    validator = Minitest::Mock.new
    validator.expect(:validate!, nil) { raise 'reader failed' }
    files = Dir.glob(Rails.root.join('tmp/transcript-*'))
    @controller.stub(:current_project, @project) do
      TranscriptImportValidation.stub(:new, validator) do
        assert_raises(RuntimeError) { post :validate, params: upload_params }
      end
    end
    assert_equal files, Dir.glob(Rails.root.join('tmp/transcript-*'))
  end

  private

  # Posts a pre-check and verifies it neither writes records nor leaves an upload copy.
  # @param parameters [Hash] Upload request
  # @return [void]
  def assert_read_only_validation(parameters)
    files = Dir.glob(Rails.root.join('tmp/transcript-*'))
    writes = []
    subscriber = ->(*event) { writes << event.last[:sql] if event.last[:sql].match?(/\A\s*(INSERT|UPDATE|DELETE)\b/i) }
    assert_no_difference 'ActionMailer::Base.deliveries.count' do
      ActiveSupport::Notifications.subscribed(subscriber, 'sql.active_record') do
        @controller.stub(:current_project, @project) { post :validate, params: parameters }
      end
    end
    assert_empty writes
    assert_equal files, Dir.glob(Rails.root.join('tmp/transcript-*'))
  end

  # Supplies a temporary source file with the same request fields as an import.
  # @param content [String] File contents
  # @param extension [String] Source extension
  # @yieldparam parameters [Hash] Upload request
  # @return [void]
  def with_validation_upload(content, extension)
    Tempfile.create(['precheck-test', extension]) do |file|
      file.write(content)
      file.flush
      parameters = upload_params
      parameters[:transcript][:timecode_frame_rate] = nil
      parameters[:transcript][:data] = Rack::Test::UploadedFile.new(file.path, 'application/octet-stream')
      yield parameters
    end
  end

  # Builds an upload request with explicit frame conversion and replacement.
  #
  # @return [Hash] Controller request parameters
  def upload_params
    {
      format: :json,
      locale: 'en',
      transcript: {
        data: fixture_file_upload(Rails.root.join('test/files/transcript_de.csv'), 'text/csv'),
        archive_id: @interview.archive_id,
        tape_number: @tape.number,
        transcript_language_id: @locale.id,
        timecode_frame_rate: '25',
        trim_timecodes: 'true',
        delete_existing: 'true'
      }
    }
  end
end

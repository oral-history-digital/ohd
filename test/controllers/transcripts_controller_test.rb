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

  private

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

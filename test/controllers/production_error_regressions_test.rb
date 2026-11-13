require 'test_helper'

class ProductionErrorRegressionsTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper

  setup do
    host! 'test.portal.oral-history.localhost:47001'
    @project = Project.find_by!(shortname: 'test')
  end

  test 'role JSON requires a signed-in user' do
    get '/test/en/roles.json'
    assert_response :unauthorized
  end

  test 'transcript uploads reject unauthorized users and unknown or foreign tapes' do
    path = '/test/en/transcripts.json'
    interview = @project.interviews.first
    attributes = { archive_id: interview.archive_id, tape_number: 999 }

    login_as User.find_by!(email: 'john@example.com')
    post path, params: { transcript: attributes }
    assert_response :forbidden

    login_as User.find_by!(email: 'alice@example.com')
    post path, params: { transcript: attributes }
    assert_response :not_found

    other_project = DataHelper.test_project(shortname: 'otherupload')
    post "/#{other_project.shortname}/en/transcripts.json", params: { transcript: attributes }
    assert_response :not_found
  end

  test 'sponsor logo creation requires an attachment and the owning project' do
    path = '/test/en/sponsor_logos.json'
    attributes = { ref_id: @project.id, ref_type: 'Project', type: 'SponsorLogo' }

    login_as User.find_by!(email: 'john@example.com')
    post path, params: { sponsor_logo: attributes }
    assert_response :forbidden

    login_as User.find_by!(email: 'alice@example.com')
    assert_no_difference 'SponsorLogo.count' do
      post path, params: { sponsor_logo: attributes }
      assert_response :unprocessable_entity

      other_project = DataHelper.test_project(shortname: 'otherlogo')
      post path, params: { sponsor_logo: attributes.merge(ref_id: other_project.id) }
      assert_response :not_found
    end
  end

  test 'valid transcript upload queues the import for the requested tape' do
    login_as User.find_by!(email: 'alice@example.com')
    interview = @project.interviews.first
    tape = interview.tapes.first
    language = interview.language
    filename = "transcript-#{SecureRandom.hex(8)}.vtt"
    file = Rack::Test::UploadedFile.new(
      Rails.root.join('test/files/transcript_de.vtt'), 'text/vtt', original_filename: filename
    )

    assert_enqueued_with(job: ReadTranscriptFileJob, args: ->(args) { args.first[:tape_id] == tape.id }) do
      post '/test/en/transcripts.json', params: {
        transcript: {
          archive_id: interview.archive_id, tape_number: tape.number,
          transcript_language_id: language.id, data: file
        }
      }
      assert_response :success
    end
  ensure
    FileUtils.rm_f(Rails.root.join('tmp', 'files', filename)) if filename
  end

  test 'valid sponsor logo attaches to the current project' do
    login_as User.find_by!(email: 'alice@example.com')
    FileUtils.mkdir_p(Rails.root.join('tmp', 'files'))
    file = Rack::Test::UploadedFile.new(Rails.root.join('test/files/cd001_33.jpg'), 'image/jpeg')

    assert_difference -> { @project.sponsor_logos.count } do
      post '/test/en/sponsor_logos.json', params: {
        sponsor_logo: { ref_id: @project.id, ref_type: 'Project', type: 'SponsorLogo', file: file }
      }
      assert_response :success
    end
    logo = @project.sponsor_logos.find(JSON.parse(response.body).fetch('nested_id'))
    assert logo.file.attached?
  end
end

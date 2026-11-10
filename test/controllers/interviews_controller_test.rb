require 'test_helper'
require 'minitest/mock'

class InterviewsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @project = nil
    @interview = nil
  end

  def project
    @project ||= Project.first
  end

  def interview
    @interview ||= project.interviews.first
  end

  test "should get show" do
    get "#{root_url}/en/interviews/#{interview.archive_id}.json"
    assert_response :success
    data = JSON.parse(response.body)

    assert 'test123', data['archive_id']
  end

  test 'should use auth for observations' do
    url = "#{root_url}/en/interviews/#{interview.archive_id}/observations.json"
    get url
    assert_response :unauthorized

    #login_as 'alice@example.com'
    #get url
    #assert_response :success
  end

  [false, true].each do |logged_in|
    %w[restricted unshared].each do |state|
      test "cached homepage examples exclude interviews changed to #{state} with logged_in=#{logged_in}" do
        project.interviews.update_all(startpage_position: nil)
        interview.update!(workflow_state: 'public', media_type: 'audio')
        sign_in User.find_by!(email: 'john@example.com') if logged_in
        cache = ActiveSupport::Cache::MemoryStore.new
        portal_uri = URI.parse(OHD_DOMAIN)
        host! "#{portal_uri.host}:#{portal_uri.port}"
        path = "/#{project.shortname}/en/random_featured_interviews.json"

        Rails.stub(:cache, cache) do
          get path
          assert_response :success
          assert_includes JSON.parse(response.body).fetch('data').keys, interview.archive_id

          interview.update!(workflow_state: state)
          replacement = Interview.create!(project: project, archive_id: "#{project.shortname}999",
            workflow_state: 'public', media_type: 'audio',
            interview_languages: [InterviewLanguage.new(language: Language.find_by!(code: 'eng'), spec: 'primary')])

          get path
          assert_response :success
          payload = JSON.parse(response.body)
          assert_equal 'random_featured_interviews', payload.fetch('data_type')
          assert_not_includes payload.fetch('data').keys, interview.archive_id
          assert_includes payload.fetch('data').keys, replacement.archive_id
          cached_ids = cache.read("#{project.shortname}-interview-random-featured-ids-v1-#{logged_in}")
          assert_includes cached_ids, replacement.id
          assert_not_includes cached_ids, interview.id
        end
      end
    end
  end

  test 'cached homepage candidates are scoped to the current project and ignore legacy payloads' do
    project.interviews.update_all(startpage_position: nil)
    interview.update!(workflow_state: 'public', media_type: 'audio')
    other_project = DataHelper.test_project(shortname: "other#{SecureRandom.hex(2)}a")
    other_interview = Interview.create!(project: other_project, archive_id: "#{other_project.shortname}001",
      workflow_state: 'public', media_type: 'audio')
    cache = ActiveSupport::Cache::MemoryStore.new
    prefix = "#{project.shortname}-interview-random-featured"
    cache.write("#{prefix}-false", { data: { other_interview.archive_id => { id: other_interview.id } } })
    cache.write("#{prefix}-ids-v1-false", [other_interview.id, interview.id])
    portal_uri = URI.parse(OHD_DOMAIN)
    host! "#{portal_uri.host}:#{portal_uri.port}"

    Rails.stub(:cache, cache) do
      get "/#{project.shortname}/en/random_featured_interviews.json"
    end

    assert_response :success
    assert_equal [interview.archive_id], JSON.parse(response.body).fetch('data').keys
  end

  test "reference tree uses the configured umbrella root" do
    umbrella_project = DataHelper.test_project(
      shortname: "umb#{SecureRandom.hex(2)}a"
    )
    InstanceSetting.current.update!(umbrella_project: umbrella_project)
    umbrella_entry = DataHelper.registry_entry_with_names(
      umbrella_project,
      en: "Umbrella entry"
    )
    umbrella_type = RegistryReferenceType.create!(
      project: umbrella_project,
      registry_entry: umbrella_project.root_registry_entry,
      code: "umbrella_type",
      name: "Umbrella type"
    )
    segment = Segment.create!(
      interview: interview,
      tape: interview.tapes.first,
      speaking_person: interview.interviewee,
      timecode: "00:00:01.000"
    )
    RegistryReference.create!(
      interview: interview,
      ref_object: segment,
      registry_entry: umbrella_entry,
      registry_reference_type: umbrella_type,
      workflow_state: "checked",
      ref_position: 1
    )
    portal_uri = URI.parse(OHD_DOMAIN)
    host! "#{portal_uri.host}:#{portal_uri.port}"
    access_token = Doorkeeper::AccessToken.create!(
      resource_owner_id: User.find_by!(email: "alice@example.com").id
    ).token

    # Old cached responses must not reintroduce the removed "ohd" tree key.
    cache = ActiveSupport::Cache::MemoryStore.new
    legacy_key = "#{project.shortname}-interview-ref-tree-#{interview.id}-#{interview.reload.updated_at}"
    cache.write(legacy_key, { data: { ohd: { id: 999 }, project: nil } })
    Rails.stub(:cache, cache) do
      get "/#{project.shortname}/en/interviews/#{interview.archive_id}/ref_tree.json",
        params: { access_token: access_token }
    end

    assert_response :success
    data = JSON.parse(response.body).fetch("data")
    assert_not data.key?('ohd')
    assert_equal umbrella_project.root_registry_entry.id, data.fetch("umbrella").fetch("id")
    assert_not_equal Project.find_by!(shortname: "ohd").root_registry_entry.id,
      data.fetch("umbrella").fetch("id")
  end
end

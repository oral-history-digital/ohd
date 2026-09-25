require 'test_helper'

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
      timecode: "00:00:01.00"
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

    get "/#{project.shortname}/en/interviews/#{interview.archive_id}/ref_tree.json",
      params: { access_token: access_token }

    assert_response :success
    data = JSON.parse(response.body).fetch("data")
    assert_equal umbrella_project.root_registry_entry.id, data.fetch("ohd").fetch("id")
    assert_not_equal Project.find_by!(shortname: "ohd").root_registry_entry.id,
      data.fetch("ohd").fetch("id")
  end
end

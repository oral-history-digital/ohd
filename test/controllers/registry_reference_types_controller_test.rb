require "test_helper"

class RegistryReferenceTypesControllerTest < ActionDispatch::IntegrationTest
  test "global reference types use the configured umbrella project" do
    current_project = Project.find_by!(shortname: "test")
    ohd_project = Project.find_by!(shortname: "ohd")
    umbrella_project = DataHelper.test_project(
      shortname: "umb#{SecureRandom.hex(2)}a"
    )
    InstanceSetting.current.update!(umbrella_project: umbrella_project)
    umbrella_type = RegistryReferenceType.create!(
      project: umbrella_project,
      registry_entry: umbrella_project.root_registry_entry,
      code: "umbrella_type",
      name: "Umbrella type"
    )
    ohd_type = RegistryReferenceType.create!(
      project: ohd_project,
      registry_entry: ohd_project.root_registry_entry,
      code: "ohd_only_type",
      name: "OHD-only type"
    )
    portal_uri = URI.parse(OHD_DOMAIN)
    host! "#{portal_uri.host}:#{portal_uri.port}"
    access_token = Doorkeeper::AccessToken.create!(
      resource_owner_id: User.find_by!(email: "alice@example.com").id
    ).token

    get "/#{current_project.shortname}/en/registry_reference_types/global.json",
      params: { access_token: access_token }

    assert_response :success
    type_ids = JSON.parse(response.body).map { |type| type["id"] }
    assert_includes type_ids, umbrella_type.id
    assert_not_includes type_ids, ohd_type.id
  end
end

require "test_helper"

class RegistryEntriesControllerTest < ActionDispatch::IntegrationTest
  test "global tree uses the configured umbrella project" do
    current_project = Project.find_by!(shortname: "test")
    ohd_project = Project.find_by!(shortname: "ohd")
    umbrella_project = DataHelper.test_project(
      shortname: "umb#{SecureRandom.hex(2)}a"
    )
    InstanceSetting.current.update!(umbrella_project: umbrella_project)
    portal_uri = URI.parse(OHD_DOMAIN)
    host! "#{portal_uri.host}:#{portal_uri.port}"
    access_token = Doorkeeper::AccessToken.create!(
      resource_owner_id: User.find_by!(email: "alice@example.com").id
    ).token

    get "/#{current_project.shortname}/en/global_registry_entry_tree.json",
      params: { access_token: access_token }

    assert_response :success
    entry_ids = JSON.parse(response.body).map { |entry| entry["id"] }
    assert_includes entry_ids, umbrella_project.root_registry_entry.id
    assert_not_includes entry_ids, ohd_project.root_registry_entry.id
  end
end

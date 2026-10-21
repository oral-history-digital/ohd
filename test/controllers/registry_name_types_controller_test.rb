require 'test_helper'

# Checks translated name ordering and project isolation for both list consumers.
class RegistryNameTypesControllerTest < ActionDispatch::IntegrationTest
  setup do
    portal = URI.parse(OHD_DOMAIN)
    host! "#{portal.host}:#{portal.port}"
    @project = DataHelper.test_project(shortname: "rnt#{SecureRandom.hex(3)}a", archive_domain: nil)
    @project.registry_name_types.destroy_all
    @last = @project.registry_name_types.create!(code: 'last', name: 'Zulu')
    @first = @project.registry_name_types.create!(code: 'first', name: 'Alpha')
    @other = Project.find_by!(shortname: 'ohd').registry_name_types.create!(code: 'other', name: 'Other project')
  end

  test 'name editor choices are ordered by translated name and belong to the route project' do
    get "/#{@project.shortname}/en/registry_name_types.json", params: { for_projects: @other.project_id }

    assert_response :success
    body = JSON.parse(response.body)
    assert_equal [@first.id, @last.id], body.fetch('data').values.map { |record| record['id'] }
    assert_equal "for_projects_#{@project.id}", body['extra_params']
  end

  test 'paginated administration lists use translated names and exclude other projects' do
    get "/#{@project.shortname}/en/registry_name_types.json", params: { page: 1 }

    assert_response :success
    body = JSON.parse(response.body)
    assert_equal [@first.id, @last.id], body.fetch('data').values.map { |record| record['id'] }
    assert_equal 1, body['result_pages_count']
  end
end

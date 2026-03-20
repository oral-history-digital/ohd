require 'test_helper'
require 'securerandom'

class InstitutionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
  end

  test 'should get paginated institutions list payload' do
    get "#{root_url}/en/institutions/list.json?page=1"
    assert_response :success

    data = JSON.parse(response.body)
    assert data.key?('data')
    assert data.key?('page')
    assert data.key?('result_pages_count')
    assert data['data'].is_a?(Array)
    assert data['data'].any?

    institution = data['data'].first

    assert institution.key?('id')
    assert institution.key?('name')
    assert institution.key?('description')
    assert institution.key?('latitude')
    assert institution.key?('longitude')
    assert institution.key?('parent')
    assert institution.key?('children')
    assert institution.key?('logo')
    assert institution.key?('archives')
    assert institution.key?('collections')
    assert institution.key?('interviews')

    assert institution['collections'].key?('public')
    assert institution['collections'].key?('restricted')
    assert institution['collections'].key?('unshared')
    assert institution['collections'].key?('total')
    assert institution['interviews'].key?('public')
    assert institution['interviews'].key?('restricted')
    assert institution['interviews'].key?('unshared')
    assert institution['interviews'].key?('total')
  end

  test 'should support all option for institutions list payload' do
    get "#{root_url}/en/institutions/list.json?all=true"
    assert_response :success

    data = JSON.parse(response.body)
    assert data.key?('data')
    assert_nil data['page']
    assert_nil data['result_pages_count']
    assert data['data'].is_a?(Array)
  end

  test 'should hide unshared project archives for anonymous users in institutions list' do
    reset!
    host! 'test.portal.oral-history.localhost:47001'

    institution = Institution.create!(name: "Inst #{SecureRandom.hex(4)}")
    project = DataHelper.test_project(
      shortname: "iu#{SecureRandom.hex(4)}a",
      workflow_state: 'unshared'
    )
    InstitutionProject.create!(institution: institution, project: project)

    get "#{root_url}/en/institutions/list.json"
    assert_response :success

    data = JSON.parse(response.body)['data']
    record = data.find { |entry| entry['id'] == institution.id }

    refute_nil record
    archive_ids = record.fetch('archives', []).map { |archive| archive['id'] }
    assert_not_includes archive_ids, project.id
  end

  test 'should allow admin to see unshared project archives in institutions list' do
    institution = Institution.create!(name: "Inst #{SecureRandom.hex(4)}")
    project = DataHelper.test_project(
      shortname: "iv#{SecureRandom.hex(4)}a",
      workflow_state: 'unshared'
    )
    InstitutionProject.create!(institution: institution, project: project)

    login_as User.find_by!(email: 'alice@example.com')
    get "#{root_url}/en/institutions/list.json"
    assert_response :success

    data = JSON.parse(response.body)['data']
    record = data.find { |entry| entry['id'] == institution.id }

    refute_nil record
    archive_ids = record.fetch('archives', []).map { |archive| archive['id'] }
    assert_includes archive_ids, project.id
  end
end

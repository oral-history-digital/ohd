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
    assert institution.key?('isil')
    assert institution.key?('gnd')
    assert institution.key?('website')
    assert institution.key?('address')
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

    assert institution['address'].key?('street')
    assert institution['address'].key?('zip')
    assert institution['address'].key?('city')
    assert institution['address'].key?('country')
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

  test 'should return lightweight single institution payload when lite flag is set' do
    institution = Institution.create!(
      name: "Lite Inst #{SecureRandom.hex(4)}",
      shortname: "li#{SecureRandom.hex(3)}",
      isil: 'DE-123',
      gnd: '9876543-2',
      website: 'https://example.org',
      street: 'Main St 1',
      zip: '12345',
      city: 'Berlin',
      country: 'Germany'
    )

    project = DataHelper.test_project(
      shortname: "il#{SecureRandom.hex(4)}a",
      workflow_state: 'public'
    )

    InstitutionProject.create!(institution: institution, project: project)

    get institution_path(institution, locale: 'en', format: :json), params: { lite: 1 }
    assert_response :success

    body = JSON.parse(response.body)
    assert_equal institution.id, body['id']
    assert_equal 'institutions', body['data_type']

    payload = body['data']
    assert payload.key?('id')
    assert payload.key?('name')
    assert payload.key?('description')
    assert payload.key?('isil')
    assert payload.key?('gnd')
    assert payload.key?('website')
    assert payload.key?('address')
    assert payload.key?('latitude')
    assert payload.key?('longitude')
    assert payload.key?('parent')
    assert payload.key?('children')
    assert payload.key?('logo')
    assert payload.key?('archives')
    assert payload.key?('collections')
    assert payload.key?('interviews')

    assert payload['collections'].key?('public')
    assert payload['collections'].key?('restricted')
    assert payload['collections'].key?('unshared')
    assert payload['collections'].key?('total')

    assert payload['interviews'].key?('public')
    assert payload['interviews'].key?('restricted')
    assert payload['interviews'].key?('unshared')
    assert payload['interviews'].key?('total')

    assert_equal 'Main St 1', payload.dig('address', 'street')
    assert_equal '12345', payload.dig('address', 'zip')
    assert_equal 'Berlin', payload.dig('address', 'city')
    assert_equal 'Germany', payload.dig('address', 'country')
    assert_equal 'DE-123', payload['isil']
    assert_equal '9876543-2', payload['gnd']
    assert_equal 'https://example.org', payload['website']

    archive_ids = payload.fetch('archives', []).map { |archive| archive['id'] }
    assert_includes archive_ids, project.id
  end

  test 'should include child interview stats with unique project counting' do
    parent = Institution.create!(name: "Parent #{SecureRandom.hex(4)}")
    child = Institution.create!(name: "Child #{SecureRandom.hex(4)}", parent: parent)

    shared_project = DataHelper.test_project(
      shortname: "is#{SecureRandom.hex(4)}a",
      workflow_state: 'public'
    )
    child_only_project = DataHelper.test_project(
      shortname: "is#{SecureRandom.hex(4)}b",
      workflow_state: 'public'
    )

    InstitutionProject.create!(institution: parent, project: shared_project)
    InstitutionProject.create!(institution: child, project: shared_project)
    InstitutionProject.create!(institution: child, project: child_only_project)

    shared_collection = Collection.create!(
      project: shared_project,
      institution: parent,
      name: "Shared #{SecureRandom.hex(2)}"
    )
    child_collection = Collection.create!(
      project: child_only_project,
      institution: child,
      name: "Child #{SecureRandom.hex(2)}"
    )

    Interview.create!(
      project: shared_project,
      collection: shared_collection,
      archive_id: "#{shared_project.shortname}001",
      media_type: 'audio',
      workflow_state: 'public'
    )

    Interview.create!(
      project: child_only_project,
      collection: child_collection,
      archive_id: "#{child_only_project.shortname}001",
      media_type: 'audio',
      workflow_state: 'restricted'
    )

    get "#{root_url}/en/institutions/list.json?all=true"
    assert_response :success

    payload = JSON.parse(response.body)
    parent_entry = payload['data'].find { |entry| entry['id'] == parent.id }

    refute_nil parent_entry
    assert_equal 1, parent_entry.dig('interviews', 'public')
    assert_equal 1, parent_entry.dig('interviews', 'restricted')
    assert_equal 2, parent_entry.dig('interviews', 'total')
  end
end

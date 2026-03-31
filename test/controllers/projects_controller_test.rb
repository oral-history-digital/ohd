require 'test_helper'
require 'securerandom'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
  end

  test 'should get lightweight archives payload with pagination metadata' do
    get list_projects_path(locale: 'en', format: :json), params: { page: 1 }
    assert_response :success

    data = JSON.parse(response.body)
    assert data.key?('data')
    assert data.key?('page')
    assert data.key?('result_pages_count')

    data = data['data']
    assert data.is_a?(Array)
    assert data.any?

    archive = data.first

    assert archive.key?('id')
    assert archive.key?('name')
    assert archive.key?('display_name')
    assert archive.key?('shortname')
    assert archive.key?('archive_domain')
    assert archive.key?('latitude')
    assert archive.key?('longitude')
    assert archive.key?('introduction')
    assert archive.key?('more_text')
    assert archive.key?('institutions')
    assert archive.key?('interviews')
    assert archive.key?('collections')
    assert archive.key?('logo')
    assert archive.key?('workflow_state')
    assert archive.key?('languages_ui')
    assert archive.key?('languages_interviews')
    assert archive.key?('has_map')
    assert archive.key?('is_catalog')
    assert archive.key?('has_newsletter')
    assert archive.key?('publication_date')

    assert archive['interviews'].key?('public')
    assert archive['interviews'].key?('restricted')
    assert archive['interviews'].key?('unshared')
    assert archive['interviews'].key?('total')

    assert archive['collections'].key?('public')
    assert archive['collections'].key?('restricted')
    assert archive['collections'].key?('total')
  end

  test 'should support all option for archives payload' do
    get list_projects_path(locale: 'en', format: :json), params: { all: true }
    assert_response :success

    data = JSON.parse(response.body)
    assert data.key?('data')
    assert_nil data['page']
    assert_nil data['result_pages_count']
    assert data['data'].is_a?(Array)
  end

  test 'should hide unshared projects in index all mode for anonymous users' do
    reset!
    host! 'test.portal.oral-history.localhost:47001'

    unshared_project = DataHelper.test_project(
      shortname: "us#{SecureRandom.hex(4)}i",
      workflow_state: 'unshared'
    )

    get projects_path(locale: 'en', format: :json), params: { all: true }
    assert_response :success

    data = JSON.parse(response.body)
    project_ids = data.fetch('data', {}).keys
    assert_not_includes project_ids, unshared_project.id.to_s
  end

  test 'should allow admin to see unshared projects in index all mode' do
    unshared_project = DataHelper.test_project(
      shortname: "us#{SecureRandom.hex(4)}j",
      workflow_state: 'unshared'
    )

    login_as User.find_by!(email: 'alice@example.com')
    get projects_path(locale: 'en', format: :json), params: { all: true }
    assert_response :success

    data = JSON.parse(response.body)
    project_ids = data.fetch('data', {}).keys
    assert_includes project_ids, unshared_project.id.to_s
  end

  test 'should hide unshared projects for anonymous users when filtering by workflow_state' do
    reset!
    host! 'test.portal.oral-history.localhost:47001'

    DataHelper.test_project(
      shortname: "us#{SecureRandom.hex(4)}a",
      workflow_state: 'unshared'
    )

    get list_projects_path(locale: 'en', format: :json), params: {
      workflow_state: 'unshared',
      all: true
    }
    assert_response :success

    data = JSON.parse(response.body)
    assert_equal [], data['data']
  end

  test 'should allow admin users to see unshared projects when filtering by workflow_state' do
    unshared_project = DataHelper.test_project(
      shortname: "us#{SecureRandom.hex(4)}b",
      workflow_state: 'unshared'
    )

    login_as User.find_by!(email: 'alice@example.com')
    get list_projects_path(locale: 'en', format: :json), params: {
      workflow_state: 'unshared',
      all: true
    }
    assert_response :success

    data = JSON.parse(response.body)
    ids = data['data'].map { |project| project['id'] }
    assert_includes ids, unshared_project.id
  end

  test 'should forbid anonymous users from loading unshared project lite payload' do
    reset!
    host! 'test.portal.oral-history.localhost:47001'

    unshared_project = DataHelper.test_project(
      shortname: "us#{SecureRandom.hex(4)}lp",
      workflow_state: 'unshared'
    )

    get project_path(unshared_project, locale: 'en', format: :json), params: { lite: 1 }
    assert_response :forbidden
  end

  test 'should return lightweight single project payload in show when lite flag is set' do
    project = DataHelper.test_project(
      shortname: "sp#{SecureRandom.hex(3)}a",
      workflow_state: 'public'
    )

    institution = Institution.create!(
      name: 'Lite Project Institution',
      shortname: "inst#{SecureRandom.hex(3)}"
    )
    InstitutionProject.create!(project: project, institution: institution)

    collection = Collection.create!(
      project: project,
      institution: institution,
      name: 'Lite Collection'
    )

    contribution_type = ContributionType.create!(
      project: project,
      code: 'interviewee',
      label: 'Interviewee'
    )

    person = Person.create!(
      project: project,
      first_name: 'Jane',
      last_name: 'Doe',
      date_of_birth: '1920-01-01'
    )

    interview = Interview.create!(
      project: project,
      collection: collection,
      archive_id: "#{project.shortname}001",
      media_type: 'audio',
      interview_date: '1978-04-02',
      workflow_state: 'public'
    )

    InterviewLanguage.create!(
      interview: interview,
      language: Language.find_by!(code: 'eng'),
      spec: 'primary'
    )

    Contribution.create!(
      interview: interview,
      person: person,
      contribution_type: contribution_type
    )

    root_registry_entry = project.registry_entries.find_by!(code: 'root')
    reference_type = RegistryReferenceType.create!(
      project: project,
      registry_entry: root_registry_entry,
      code: "lite_ref_#{SecureRandom.hex(4)}",
      name: 'Lite Test Reference',
      use_in_transcript: false
    )

    subject_entry = RegistryEntry.ohd_subjects&.children&.first
    if subject_entry
      RegistryReference.create!(
        interview: interview,
        ref_object: interview,
        registry_entry: subject_entry,
        registry_reference_type: reference_type,
        workflow_state: 'preliminary'
      )
    end

    level_entry = RegistryEntry.ohd_level_of_indexing&.children&.first
    if level_entry
      RegistryReference.create!(
        interview: interview,
        ref_object: interview,
        registry_entry: level_entry,
        registry_reference_type: reference_type,
        workflow_state: 'preliminary'
      )
    end

    get project_path(project, locale: 'en', format: :json), params: { lite: 1 }
    assert_response :success

    body = JSON.parse(response.body)
    assert_equal project.id, body['id']
    assert_equal 'projects', body['data_type']

    payload = body['data']
    assert payload.key?('institutions')
    assert payload.key?('interviews')
    assert payload.key?('collections')
    assert payload.key?('languages_interviews')
    assert payload.key?('media_types')
    assert payload.key?('subjects')
    assert payload.key?('levels_of_indexing')
    assert payload.key?('interview_year_range')
    assert payload.key?('birth_year_range')
    assert payload.key?('sponsors')
    assert payload.key?('contact_people')

    assert_equal 1, payload.dig('interviews', 'public')
    assert_equal 1, payload.dig('interviews', 'total')
    assert_equal 1, payload.dig('collections', 'total')
    assert_equal 1978, payload.dig('interview_year_range', 'min')
    assert_equal 1978, payload.dig('interview_year_range', 'max')
    assert_equal 1920, payload.dig('birth_year_range', 'min')
    assert_equal 1920, payload.dig('birth_year_range', 'max')
    assert_includes payload['languages_interviews'], 'eng'
    assert_equal 1, payload.dig('media_types', 'audio')
    assert_equal 0, payload.dig('media_types', 'video')

    if subject_entry
      assert payload['subjects'].any?
      assert payload['subjects'].all? { |item| item.is_a?(String) }
    end

    assert payload['levels_of_indexing'].all? do |item|
      item.is_a?(Hash) && item['descriptor'].is_a?(String)
    end

    assert_equal project.cooperation_partner, payload.dig('contact_people', 'cooperation_partner')
    assert_equal project.leader, payload.dig('contact_people', 'leader')
    assert_equal project.manager, payload.dig('contact_people', 'manager')
  end

  test 'should only count interviews from public projects in lite payload' do
    public_project = DataHelper.test_project(
      shortname: "pup#{SecureRandom.hex(3)}a",
      workflow_state: 'public'
    )

    unshared_project = DataHelper.test_project(
      shortname: "pup#{SecureRandom.hex(3)}b",
      workflow_state: 'unshared'
    )

    institution = Institution.first
    
    public_collection = Collection.create!(
      project: public_project,
      institution: institution,
      name: 'Public Collection'
    )

    unshared_collection = Collection.create!(
      project: unshared_project,
      institution: institution,
      name: 'Unshared Collection'
    )

    # Create interview in public project
    Interview.create!(
      project: public_project,
      collection: public_collection,
      archive_id: "#{public_project.shortname}001",
      media_type: 'audio',
      workflow_state: 'public'
    )

    # Create interview in unshared project - should NOT be counted
    Interview.create!(
      project: unshared_project,
      collection: unshared_collection,
      archive_id: "#{unshared_project.shortname}001",
      media_type: 'video',
      workflow_state: 'public'
    )

    login_as User.find_by!(email: 'alice@example.com')
    get project_path(public_project, locale: 'en', format: :json), params: { lite: 1 }
    assert_response :success

    body = JSON.parse(response.body)
    payload = body['data']

    # Should only count interviews from the public project
    assert_equal 1, payload.dig('interviews', 'public')
    assert_equal 1, payload.dig('interviews', 'total')
  end
end

require 'test_helper'
require 'minitest/mock'
require_relative '../../../support/api_schema_assertions'

class Api::V2::ProjectListCachingTest < ActionDispatch::IntegrationTest
  include ApiSchemaAssertions

  setup do
    # These fixtures and translation edits use English, regardless of test order.
    @previous_locale = I18n.locale
    @previous_globalize_locale = Globalize.locale
    I18n.locale = :en
    Globalize.locale = :en
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
    host! 'test.portal.oral-history.localhost:47001'
    @project = DataHelper.test_project(shortname: "cache#{SecureRandom.hex(3)}a")
    Project.where.not(id: @project.id).update_all(workflow_state: 'unshared')
    @institution = Institution.create!(name: 'Institute', shortname: "inst#{SecureRandom.hex(3)}")
    @link = InstitutionProject.create!(project: @project, institution: @institution, primary: true)
    @collection = Collection.create!(project: @project, institution: @institution, name: 'Collection', notes: 'Notes', workflow_state: 'public')
    @interview = Interview.create!(project: @project, collection: @collection,
      archive_id: "#{@project.shortname}001", media_type: 'audio', workflow_state: 'public')
    @language = Language.create!(code: "lang#{SecureRandom.hex(3)}")
    @language_link = InterviewLanguage.create!(interview: @interview, language: @language, spec: 'primary')
    @all_includes = 'counts,institutions,interview_languages,collection_preview'
  end

  teardown do
    Rails.cache = @previous_cache
    I18n.locale = @previous_locale
    Globalize.locale = @previous_globalize_locale
  end

  test 'normalized requests share cache entries and hits skip metrics and serialization' do
    first = nil
    assert_equal 1, generations {
      first = request_list(all: true, workflow_state: 'public,unshared', include: @all_includes)
      host! 'another.oral-history.localhost:47001'
      second = request_list(all: true, workflow_state: ' unshared, public, public ',
        include: ' collection_preview, counts, counts, institutions, interview_languages ', suffix: '.json')
      assert_equal first, second
    }

    fail_on_call = ->(*) { flunk 'Cache hits must skip optional repositories and serialization' }
    ProjectMetricsRepository.stub(:new, fail_on_call) do
      CollectionContentRepository.stub(:new, fail_on_call) do
        Api::V2::ProjectListSerializer.stub(:new, fail_on_call) do
          assert_equal 0, generations {
            assert_equal first, request_list(all: true, workflow_state: 'public,unshared', include: @all_includes)
          }
        end
      end
    end
  end

  test 'locale includes sorting pagination and filters have separate cache entries' do
    variants = [
      {}, { locale: 'de' }, { include: 'counts' }, { sort: 'name' }, { sort: '-id' },
      { page: 2 }, { per_page: 1 }, { all: true }, { workflow_state: 'unshared' }, { include_umbrella: true },
    ]
    variants.each do |parameters|
      assert_equal 1, generations { request_list(**parameters) }, parameters.inspect
      assert_equal 0, generations { request_list(**parameters) }, parameters.inspect
    end
    assert_equal 0, generations { request_list(page: 1, per_page: 25, sort: '-created_at', include_umbrella: false) }
  end

  test 'project edits translations creation deletion and umbrella settings refresh cached pages' do
    first = request_list(per_page: 1, sort: 'name')
    assert_equal @project.id, first['data'].first['id']
    @project.translations.find_by!(locale: 'en').update_columns(name: 'Changed name', display_name: nil)
    assert_equal 'Changed name', request_list(per_page: 1, sort: 'name')['data'].first['name']
    @project.update_columns(shortname: "ren#{SecureRandom.hex(3)}a", grant_access_without_login: true)
    summary = request_list(per_page: 1, sort: 'name')['data'].first
    assert_equal @project.shortname, summary['shortname']
    assert_equal true, summary['grant_access_without_login']

    added = DataHelper.test_project(shortname: "added#{SecureRandom.hex(3)}a", name: 'Alphabet')
    page = request_list(per_page: 1, sort: 'name')
    assert_equal added.id, page['data'].first['id']
    assert_equal 2, page['pagination']['total_count']
    added.destroy!
    assert_equal 1, request_list(per_page: 1, sort: 'name')['pagination']['total_count']

    InstanceSetting.current.update!(umbrella_project: @project)
    assert_empty request_list(all: true)['data']
    assert_equal true, request_list(all: true, include_umbrella: true)['data'].first['is_umbrella']
  end

  test 'metrics refresh after workflow edits additions deletions and reassignment' do
    assert_equal 1, summary(include: 'counts')['interview_counts']['public']
    @interview.update_column(:workflow_state, 'restricted')
    counts = summary(include: 'counts')['interview_counts']
    assert_equal 0, counts['public']
    assert_equal 1, counts['restricted']
    other = DataHelper.test_project(shortname: "other#{SecureRandom.hex(3)}a")
    summary(include: 'counts')
    @interview.update_column(:project_id, other.id)
    assert_equal 0, summary(include: 'counts')['interview_counts']['total']
    @interview.update_column(:project_id, @project.id)
    assert_equal 1, summary(include: 'counts')['interview_counts']['total']
    @interview.destroy!
    assert_equal 0, summary(include: 'counts')['interview_counts']['total']

    assert_equal 1, summary(include: 'counts')['collection_counts']['total']
    @collection.update_column(:workflow_state, 'unshared')
    assert_equal 0, summary(include: 'counts')['collection_counts']['total']
    added = Collection.create!(project: @project, institution: @institution, name: 'Added', workflow_state: 'public')
    assert_equal 1, summary(include: 'counts')['collection_counts']['total']
    added.destroy!
    assert_equal 0, summary(include: 'counts')['collection_counts']['total']
  end

  test 'collection previews refresh after text edits deletions and movement to another project' do
    assert_equal 'Notes', summary(include: 'collection_preview')['collection_preview'].first['notes']
    @collection.translations.find_by!(locale: 'en').update_column(:notes, 'Edited notes')
    assert_equal 'Edited notes', summary(include: 'collection_preview')['collection_preview'].first['notes']
    other = DataHelper.test_project(shortname: "other#{SecureRandom.hex(3)}a")
    summary(include: 'collection_preview')
    @collection.update_column(:project_id, other.id)
    assert_empty summary(include: 'collection_preview')['collection_preview']
    @collection.update_column(:project_id, @project.id)
    assert_equal 1, summary(include: 'collection_preview')['collection_preview'].length
    @collection.destroy!
    assert_empty summary(include: 'collection_preview')['collection_preview']
  end

  test 'language links and codes invalidate only representations that include languages' do
    summary
    assert_equal [@language.code], summary(include: 'interview_languages')['interview_languages']
    @language.update_column(:code, 'changed-language-code')
    assert_equal ['changed-language-code'], summary(include: 'interview_languages')['interview_languages']
    @language_link.destroy!
    assert_equal [], summary(include: 'interview_languages')['interview_languages']
    assert_equal 0, generations { summary }, 'Unrelated includes must not invalidate the base response'
    InterviewLanguage.create!(interview: @interview, language: @language, spec: 'primary')
    assert_equal ['changed-language-code'], summary(include: 'interview_languages')['interview_languages']
  end

  test 'institution parents translations primary links and removals refresh cached includes' do
    assert_equal 'Institute', summary(include: 'institutions')['institutions'].first['name']
    @institution.translations.find_by!(locale: 'en').update_column(:name, 'New institute name')
    assert_equal 'New institute name', summary(include: 'institutions')['institutions'].first['name']
    parent = Institution.create!(name: 'Parent', shortname: "parent#{SecureRandom.hex(3)}")
    @institution.update_column(:parent_id, parent.id)
    assert_equal 'Parent', summary(include: 'institutions')['institutions'].first['parent']['name']
    parent.translations.find_by!(locale: 'en').update_column(:name, 'Renamed parent')
    assert_equal 'Renamed parent', summary(include: 'institutions')['institutions'].first['parent']['name']
    second = Institution.create!(name: 'Second', shortname: "second#{SecureRandom.hex(3)}")
    link = InstitutionProject.create!(project: @project, institution: second)
    assert_equal [true, false], summary(include: 'institutions')['institutions'].map { |record| record['is_primary'] }
    @link.update_column(:primary, false)
    link.update_column(:primary, true)
    assert_equal [false, true], summary(include: 'institutions')['institutions'].map { |record| record['is_primary'] }
    link.destroy!
    @link.destroy!
    assert_empty summary(include: 'institutions')['institutions']
  end

  test 'favicon and logo attachment replacement deletion and blob renaming refresh branding' do
    FileUtils.mkdir_p(Rails.root.join('tmp', 'files'))
    assert_nil summary['favicon_url']
    @project.favicon.attach(io: StringIO.new('favicon'), filename: 'first.ico', content_type: 'image/x-icon')
    first_url = summary['favicon_url']
    assert_match(/first.ico/, first_url)
    @project.favicon.blob.update_column(:filename, 'renamed.ico')
    assert_match(/renamed.ico/, summary['favicon_url'])
    @project.favicon.attach(io: StringIO.new('new favicon'), filename: 'second.ico', content_type: 'image/x-icon')
    assert_not_equal first_url, summary['favicon_url']
    @project.favicon.detach
    assert_nil summary['favicon_url']

    logo = Logo.new(ref: @project, locale: 'en')
    logo.file.attach(io: StringIO.new('logo'), filename: 'logo.png', content_type: 'image/png')
    logo.save!
    assert_equal logo.id, summary['logo']['id']
    logo.file.attach(io: StringIO.new('other logo'), filename: 'new-logo.png', content_type: 'image/png')
    assert_match(/new-logo.png/, summary['logo']['url'])
    logo.destroy!
    assert_nil summary['logo']
  end

  test 'cached responses respect role and permission revocation account changes and logout' do
    hidden = Collection.create!(project: @project, institution: @institution,
      name: 'Hidden', notes: 'Protected preview', workflow_state: 'unshared')
    private_project = DataHelper.test_project(shortname: "priv#{SecureRandom.hex(3)}a", workflow_state: 'unshared')
    assert_equal [@project.id], request_list(all: true, include: 'collection_preview')['data'].map { |record| record['id'] }
    assert_not_includes response.body, 'Protected preview'

    user = User.find_by!(email: 'john@example.com')
    role = Role.create!(project: @project, name: 'Collection editor')
    permission = Permission.find_or_create_by!(klass: 'Collection', action_name: 'update')
    grant = RolePermission.create!(role: role, permission: permission)
    UserRole.create!(user: user, role: role)
    private_role = Role.create!(project: private_project, name: 'Reader')
    private_grant = UserRole.create!(user: user, role: private_role)
    login_as user
    assert_includes request_list(all: true, include: 'collection_preview')['data'].map { |record| record['id'] }, private_project.id
    assert_includes summary(include: 'collection_preview')['collection_preview'].map { |record| record['id'] }, hidden.id
    grant.destroy!
    assert_not_includes summary(include: 'collection_preview')['collection_preview'].map { |record| record['id'] }, hidden.id
    private_grant.destroy!
    assert_not_includes request_list(all: true, include: 'collection_preview')['data'].map { |record| record['id'] }, private_project.id
    membership = UserProject.create!(user: user, project: private_project)
    membership.update_column(:workflow_state, 'project_access_granted')
    assert_includes request_list(all: true, include: 'collection_preview')['data'].map { |record| record['id'] }, private_project.id
    membership.destroy!
    assert_not_includes request_list(all: true, include: 'collection_preview')['data'].map { |record| record['id'] }, private_project.id

    login_as User.find_by!(email: 'alice@example.com')
    assert_includes summary(include: 'collection_preview')['collection_preview'].map { |record| record['id'] }, hidden.id
    delete '/en/users/sign_out'
    assert_response :redirect
    request_list(all: true, include: 'collection_preview')
    assert_not_includes response.body, 'Protected preview'
    assert_not_includes JSON.parse(response.body)['data'].map { |record| record['id'] }, private_project.id
  end

  test 'a grant during response generation cannot populate a less privileged cache entry' do
    hidden = Collection.create!(project: @project, institution: @institution,
      name: 'Hidden', notes: 'Protected preview', workflow_state: 'unshared')
    user = User.find_by!(email: 'john@example.com')
    role = Role.create!(project: @project, name: 'Collection editor')
    permission = Permission.find_or_create_by!(klass: 'Collection', action_name: 'update')
    RolePermission.create!(role: role, permission: permission)
    login_as user
    constructor = CollectionContentRepository.method(:new)
    grant = nil
    grant_during_generation = lambda do |**options|
      grant = UserRole.create!(user: user, role: role)
      constructor.call(**options)
    end
    CollectionContentRepository.stub(:new, grant_during_generation) do
      assert_not_includes summary(include: 'collection_preview')['collection_preview'].map { |record| record['id'] }, hidden.id
    end
    assert_includes summary(include: 'collection_preview')['collection_preview'].map { |record| record['id'] }, hidden.id
    grant.destroy!
    assert_not_includes summary(include: 'collection_preview')['collection_preview'].map { |record| record['id'] }, hidden.id
  end

  private

  def request_list(suffix: '', **parameters)
    get "/api/v2/projects#{suffix}", params: { locale: 'en', **parameters }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    JSON.parse(response.body)
  end

  def summary(**parameters)
    request_list(all: true, **parameters)['data'].find { |record| record['id'] == @project.id }
  end

  def generations
    count = 0
    subscriber = ->(*event) { count += 1 if event.last[:key].to_s.start_with?('api/v2/projects/list/') }
    ActiveSupport::Notifications.subscribed(subscriber, 'cache_generate.active_support') { yield }
    count
  end
end

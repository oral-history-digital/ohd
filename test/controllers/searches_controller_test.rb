require 'test_helper'
require 'minitest/mock'

class SearchesControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  test 'interview fulltext requires project access and a grant for restricted interviews' do
    project = Project.find_by!(shortname: 'test')
    interview = project.interviews.first
    interview.update!(workflow_state: 'restricted')
    reader = User.find_by!(email: 'john@example.com')

    assert_fulltext_access(nil, project, interview, :forbidden)
    assert_fulltext_access(reader, project, interview, :forbidden)
    access = UserProject.find_or_create_by!(user: reader, project: project)
    assert_fulltext_access(reader, project, interview, :forbidden)
    access.update_columns(workflow_state: 'project_access_granted')
    assert_fulltext_access(reader, project, interview, :forbidden)

    InterviewPermission.create!(user: reader, interview: interview, action_name: 'show')
    assert_fulltext_access(reader, project, interview, :success)
    other = Interview.create!(project: project, archive_id: "#{project.shortname}999",
      workflow_state: 'restricted', media_type: 'audio')
    assert_fulltext_access(reader, project, other, :forbidden)

    umbrella = Project.find_by!(shortname: 'ohd')
    InstanceSetting.current.update!(umbrella_project: umbrella)
    umbrella_access = UserProject.find_or_create_by!(user: reader, project: umbrella)
    umbrella_access.update_columns(workflow_state: 'project_access_granted')
    access.update_columns(workflow_state: 'project_access_requested')
    assert_fulltext_access(reader, umbrella, interview, :forbidden)
    access.update_columns(workflow_state: 'project_access_granted')
    assert_fulltext_access(reader, umbrella, interview, :success)
    assert_fulltext_access(reader, umbrella, other, :forbidden)
    assert_fulltext_access(User.find_by!(email: 'alice@example.com'), project, interview, :success)

    permission = Permission.find_or_create_by!(klass: 'General', action_name: 'edit')
    role = Role.create!(project: project, name: 'Search editor')
    role_permission = RolePermission.create!(role: role, permission: permission)
    UserRole.create!(user: reader, role: role)
    assert_fulltext_access(reader, umbrella, other, :success)
    assert_fulltext_access(reader, project, other, :success)
    assert_fulltext_access(reader, DataHelper.test_project(shortname: 'elsewhere'), interview, :forbidden)

    role_permission.update!(permission: Permission.find_or_create_by!(klass: 'Interview', action_name: 'show'))
    assert_fulltext_access(reader, umbrella, other, :success)
    role_permission.destroy!
    task_type = TaskType.create!(project: project, key: 'fulltext_test')
    TaskTypePermission.create!(task_type: task_type,
      permission: Permission.find_by!(klass: 'Interview', action_name: 'show'))
    other.tasks.find_by!(task_type: task_type).update_columns(user_id: reader.id)
    assert_fulltext_access(reader, umbrella, other, :success)
  end

  test 'public fulltext respects anonymous project access and rejects unknown archive IDs' do
    project = Project.find_by!(shortname: 'test')
    interview = project.interviews.first
    interview.update!(workflow_state: 'public')
    project.update!(grant_access_without_login: false, grant_project_access_instantly: false)
    assert_fulltext_access(nil, project, interview, :forbidden)
    project.update!(grant_access_without_login: true)
    assert_fulltext_access(nil, project, interview, :success)

    @controller.stub(:current_project, project) do
      assert_raises(ActiveRecord::RecordNotFound) do
        get :interview, params: { id: 'unknown', locale: 'en', format: :json }
      end
    end
  end

  test 'authorized fulltext builds scoped public-content queries and returns highlighted matches' do
    project = Project.find_by!(shortname: 'test')
    project.update!(grant_access_without_login: true)
    interview = project.interviews.first
    interview.update!(workflow_state: 'public')
    segment = interview.segments.first
    highlight = Object.new
    highlight.define_singleton_method(:format) { |&block| "matched #{block.call('protected')}" }
    hit = Struct.new(:instance).new(segment)
    hit.define_singleton_method(:highlights) { |*| [highlight] }
    queries = []
    search = lambda do |model, &block|
      queries << Sunspot.new_search(model, &block).query.to_params
      Struct.new(:hits).new(model == Segment ? [hit] : [])
    end
    # Stub only the external Solr execution boundary, retaining the real query DSL.
    run = ->(*) { get :interview, params: { id: interview.archive_id, fulltext: 'protected', locale: 'en', format: :json } }
    [Segment, BiographicalEntry, Photo, RegistryEntry, Annotation, Interview].each do |model|
      previous = run
      run = ->(*) { model.stub(:search, ->(&block) { search.call(model, &block) }, &previous) }
    end
    @controller.stub(:current_project, project, &run)

    assert_response :success
    payload = JSON.parse(response.body)
    assert_equal segment.id, payload['found_segments'].first['id']
    assert_includes payload['found_segments'].first['text']['eng'], '<mark>protected</mark>'
    assert_equal 8, queries.size
    queries.each do |query|
      assert_match(/\barchive_id_\w+:#{Regexp.escape(interview.archive_id)}\b/, query[:fq].join(' '))
      assert_match(/\bworkflow_state_\w+:public\b/, query[:fq].join(' '))
    end
  end

  test 'fulltext map requests recheck permissions instead of sharing cached matches' do
    project = Project.find_by!(shortname: 'test')
    project.metadata_fields.create!(source: 'Interview', name: 'archive_id', map_color: '#000')
    user = User.find_by!(email: 'john@example.com')
    requests = []
    search = lambda do |request_user, *|
      requests << request_user
      Struct.new(:hits).new([])
    end
    repository = Struct.new(:combined_entries_for_map).new([])

    Rails.stub(:cache, ActiveSupport::Cache::MemoryStore.new) do
      Interview.stub(:archive_search, search) do
        RegistryEntryRepository.stub(:new, repository) do
          @controller.stub(:current_project, project) do
            [user, nil, user].each do |request_user|
              sign_out :user
              sign_in request_user if request_user
              get :map, params: { fulltext: 'protected', locale: 'en', format: :json }
              assert_response :success
            end
          end
        end
      end
    end
    assert_equal [user, nil, user], requests
  end

  test 'public interviews in unshared collections remain search results without collection identity' do
    project = DataHelper.test_project(shortname: "vis#{SecureRandom.hex(3)}a", workflow_state: 'public')
    collection = Collection.create!(project: project, name: 'Hidden collection', workflow_state: 'unshared')
    interview = Interview.create!(
      project: project, collection: collection, archive_id: "#{project.shortname}001",
      workflow_state: 'public', media_type: 'audio',
      interview_languages: [InterviewLanguage.new(language: Language.find_by!(code: 'eng'), spec: 'primary')]
    )
    results = [interview]
    results.define_singleton_method(:total_pages) { 1 }
    search = Struct.new(:results, :total).new(results, 1)

    Interview.stub(:archive_search, search) do
      @controller.stub(:current_project, project) do
        [nil, User.find_by!(email: 'john@example.com')].each do |user|
          sign_in user if user
          get :archive, params: { locale: 'en', format: :json }
          assert_response :success
          payload = JSON.parse(response.body)
          assert_equal 1, payload['results_count']
          assert_equal interview.archive_id, payload['interviews'].first['archive_id']
          assert_nil payload['interviews'].first['collection_id']
        end
      end
    end
  end

  test 'collection facets respect collection visibility' do
    umbrella = DataHelper.test_project(shortname: "fac#{SecureRandom.hex(4)}a")
    public_project = DataHelper.test_project(
      shortname: "pub#{SecureRandom.hex(4)}a",
      workflow_state: 'public'
    )
    hidden_project = DataHelper.test_project(
      shortname: "hid#{SecureRandom.hex(4)}a",
      workflow_state: 'unshared'
    )
    visible = Collection.create!(project: public_project, name: 'Visible collection', workflow_state: 'public')
    unshared = Collection.create!(project: public_project, name: 'Private collection', workflow_state: 'unshared')
    cross_project = Collection.create!(project: hidden_project, name: 'Hidden project collection', workflow_state: 'public')
    subfacets = [visible, unshared, cross_project].to_h do |collection|
      [collection.id.to_s, { name: { en: collection.name }, count: 1 }]
    end
    facet_data = { collection_id: { subfacets: subfacets }, media_type: { subfacets: { video: { count: 1 } } } }

    Interview.stub(:archive_search, Object.new) do
      umbrella.stub(:updated_search_facets, ->(*) { facet_data.deep_dup }) do
        @controller.stub(:current_project, umbrella) do
          get :facets, params: { locale: 'en', format: :json }
          assert_response :success
          anonymous_facets = JSON.parse(response.body).fetch('facets')
          assert_equal [visible.id.to_s], anonymous_facets.dig('collection_id', 'subfacets').keys
          assert anonymous_facets.key?('media_type')

          sign_in User.find_by!(email: 'john@example.com')
          get :facets, params: { locale: 'en', format: :json }
          assert_response :success
          reader_facets = JSON.parse(response.body).fetch('facets')
          assert_equal [visible.id.to_s], reader_facets.dig('collection_id', 'subfacets').keys

          sign_in User.find_by!(email: 'alice@example.com')
          get :facets, params: { locale: 'en', format: :json }
          assert_response :success
          authorized_facets = JSON.parse(response.body).fetch('facets')
          assert_includes authorized_facets.dig('collection_id', 'subfacets').keys, unshared.id.to_s
          assert_includes authorized_facets.dig('collection_id', 'subfacets').keys, cross_project.id.to_s
        end
      end
    end
  end

  test 'suggestion archive IDs use separate global and project cache namespaces' do
    project = DataHelper.test_project(shortname: 'global')
    cache = ActiveSupport::Cache::MemoryStore.new
    computations = 0
    archive_ids = ->(*) { computations += 1; ["archive#{computations}"] }
    dropdown = { all_interviews_titles: [], all_interviews_pseudonyms: [] }
    @request.host = URI.parse(OHD_DOMAIN).host
    @request.port = URI.parse(OHD_DOMAIN).port

    Rails.stub(:cache, cache) do
      Interview.stub(:dropdown_search_values, dropdown) do
        Interview.stub(:archive_ids_by_alphabetical_order, archive_ids) do
          @controller.stub(:current_project, project) do
            get :suggestions, params: { locale: 'en', format: :json }
            assert_response :success
            assert_equal ['archive1'], JSON.parse(response.body)['sorted_archive_ids']
          end
          @controller.stub(:current_project, nil) do
            2.times do
              get :suggestions, params: { locale: 'en', format: :json }
              assert_response :success
              assert_equal ['archive2'], JSON.parse(response.body)['sorted_archive_ids']
            end
          end
        end
      end
    end

    suffix = "sorted_archive_ids-#{Interview.maximum(:created_at)}"
    assert cache.exist?("global-#{suffix}")
    assert cache.exist?("project-#{project.id}-#{suffix}")
    assert_equal 2, computations
  end

  private

  # Checks both response formats and rejects content queries before they execute.
  #
  # @param user [User, nil] Requesting user
  # @param project [Project] Request project context
  # @param interview [Interview] Requested interview
  # @param status [Symbol] Expected response status
  # @return [void]
  def assert_fulltext_access(user, project, interview, status)
    sign_out :user
    sign_in user if user
    @controller.send(:pundit_reset!)
    searches = []
    search = lambda do |*args|
      flunk 'Unauthorized request executed a content search' unless status == :success
      searches << args
      Struct.new(:hits).new([])
    end

    @controller.stub(:current_project, project) do
      @controller.stub(:search, search) do
        (status == :success ? [:json] : [:json, :html]).each do |format|
          get :interview, params: { id: interview.archive_id, fulltext: 'protected', locale: 'en', format: format }
          assert_response status
          if status == :success
            assert_equal 8, searches.size if format == :json
            assert_equal [], JSON.parse(response.body)['found_segments'] if format == :json
          elsif format == :json
            assert_equal({ 'msg' => 'not_authorized' }, JSON.parse(response.body))
          end
        end
      end
    end
  end
end

require 'test_helper'
require 'minitest/mock'

class InterviewArchiveSearchTest < ActiveSupport::TestCase
  # Stand in for Sunspot's query builder so we can inspect project filters
  # without executing a search or depending on a populated Solr index.
  class Query
    attr_reader :filters

    def initialize
      @filters = []
    end

    def with(*args)
      @filters << args
    end

    def dynamic(*, &block)
      # Nested DSL blocks must run against this stand-in, just as in Sunspot.
      instance_eval(&block) if block
    end

    # Text matching, sorting, and pagination are outside this test's scope.
    def fulltext(*)
    end

    def order_by(*)
    end

    def paginate(*)
    end
  end

  setup do
    # Deliberately separate umbrella identity from the legacy shortname:
    # the project named 'ohd' must now behave like any other archive.
    @umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a")
    InstanceSetting.current.update!(umbrella_project: @umbrella)
    @archive = Project.find_by!(shortname: 'ohd')
  end

  test 'umbrella browsing searches public projects while former ohd searches itself' do
    query = capture_search(nil, @umbrella, {})
    assert_includes query.filters, [:project_id, Project.where(workflow_state: 'public').pluck(:id)]

    query = capture_search(nil, @archive, {})
    assert_includes query.filters, [:project_id, @archive.id]
  end

  test 'fulltext filters protected matches while browsing preserves discovery' do
    user = User.find_by!(email: 'john@example.com')
    access = UserProject.create!(user: user, project: @archive)
    # Set up granted access without triggering the grant event's mail workflow.
    access.update_columns(workflow_state: 'project_access_granted')
    interviews = %w[public restricted restricted].each_with_index.map do |state, index|
      Interview.create!(project: @archive, archive_id: "#{@archive.shortname}00#{index}",
        workflow_state: state, media_type: 'audio')
    end
    public_interview, granted, denied = interviews

    access.update_columns(workflow_state: 'project_access_requested')
    query = capture_search(user, @umbrella, fulltext: 'history')
    assert_includes query.filters, [:archive_id, '__no_authorized_interviews__']
    access.update_columns(workflow_state: 'project_access_granted')

    query = capture_search(user, @umbrella, fulltext: 'history')
    assert_includes query.filters, [:archive_id, [public_interview.archive_id]]
    InterviewPermission.create!(user: user, interview: granted)

    query = capture_search(user, @umbrella, fulltext: 'history')
    assert_equal [public_interview.archive_id, granted.archive_id].sort,
      query.filters.assoc(:archive_id).last.sort

    query = capture_search(user, @archive, fulltext: 'history')
    assert_equal [public_interview.archive_id, granted.archive_id].sort,
      query.filters.assoc(:archive_id).last.sort
    refute_includes query.filters.assoc(:archive_id).last, denied.archive_id

    query = capture_search(user, @archive, {})
    assert_nil query.filters.assoc(:archive_id)
    assert_includes query.filters, [:workflow_state, ['restricted', 'public']]

    permission = Permission.find_or_create_by!(klass: 'General', action_name: 'edit')
    role = Role.create!(project: @archive, name: 'Search editor')
    RolePermission.create!(role: role, permission: permission)
    UserRole.create!(user: user, role: role)
    denied.update!(workflow_state: 'unshared')
    query = capture_search(user, @umbrella, fulltext: 'history')
    assert_includes query.filters.assoc(:archive_id).last, denied.archive_id
    assert_includes query.filters, [:workflow_state, ['public', 'restricted', 'unshared']]
  end

  private

  def capture_search(user, project, params)
    query = Query.new
    # Execute the real archive_search DSL block with Query as its receiver.
    search = ->(&block) { query.instance_eval(&block); query }
    # Replace only the search execution boundary. Minitest restores the
    # original Interview.search method when this block finishes.
    Interview.stub(:search, search) do
      Interview.archive_search(user, project, :en, params)
    end
    query
  end
end
